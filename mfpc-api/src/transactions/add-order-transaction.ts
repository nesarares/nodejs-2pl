import { BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from 'src/dtos/create-order.dto';
import { DiscountCode } from 'src/models/discount-code.model';
import { Order } from 'src/models/order.model';
import { Product } from 'src/models/product.model';
import { DatabaseService } from 'src/services/database.service';
import { LockType } from 'src/services/transaction.service';
import { MongoUtils } from 'src/utils/mongo.utils';
import { Utils } from 'src/utils/utils';
import { User } from '../models/user.model';
import { Transaction } from './transaction';

export class AddOrderTransaction extends Transaction {
  constructor(private db: DatabaseService, private data: { user: User; order: CreateOrderDto }) {
    super();
  }

  protected async doTransaction(): Promise<any> {
    const { order, user } = this.data;

    // Check if discount code is valid
    let discount: DiscountCode;
    if (order.discountCode) {
      await this.lock(LockType.read, 'DiscountCode');
      discount = await this.db.discountCodes.findOne<DiscountCode>({ code: order.discountCode });

      if (!discount || discount.uses <= 0) {
        throw new BadRequestException('The discount code specified is invalid');
      }
    }

    // Get all order products
    const productIds = order.products.map((product) => MongoUtils.toObjectId(product._id));

    await this.lock(LockType.read, 'Product');
    const products = await this.db.products
      .find<Product>({ _id: { $in: productIds } })
      .toArray();

    if (!products || products.length !== order.products.length) {
      throw new BadRequestException('One or more products are not valid');
    }
    const orderProducts: Order['products'] = products.map((product) => {
      return {
        ...product,
        amount: order.products.find((p) => p._id === product._id?.toString()).amount,
      };
    });

    // Add order
    const subtotal = orderProducts.reduce((acc, prod) => (acc += prod.price * prod.amount), 0);
    let total = subtotal;
    let discountPrice = 0;
    if (discount) {
      discountPrice = (total * discount.discount) / 100;
      total -= discountPrice;
    }
    const toAddOrder: Order = {
      userId: user._id,
      created: new Date(),
      products: orderProducts,
      subtotal,
      total,
      ...(discount
        ? {
            discount: discountPrice,
            discountCode: discount.code,
          }
        : {}),
    };

    await this.lock(LockType.write, 'Order');
    const response = (await this.db.orders.insertOne(toAddOrder as any))?.ops[0];

    await Utils.sleep(3000); // Debug for deadlock

    // Update user points
    await this.lock(LockType.read, 'User');
    const userDoc = await this.db.users.findOne<User>({ _id: user._id });
    const newPoints = userDoc.points + Math.floor(total);

    await this.lock(LockType.write, 'User');
    await this.db.users.updateOne({ _id: user._id }, { $set: { points: newPoints } });

    // Decrease discount code uses
    await this.lock(LockType.write, 'DiscountCode');

    if (discount) {
      await this.db.discountCodes.updateOne(
        { _id: discount._id },
        {
          $set: { uses: discount.uses - 1 },
        }
      );
    }
    return response;
  }
}
