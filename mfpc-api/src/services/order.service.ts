import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database.service';
import { MongoUtils } from 'src/utils/mongo.utils';
import { User } from '../models/user.model';
import { DiscountCode } from '../models/discount-code.model';
import { Product } from '../models/product.model';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { Order } from '../models/order.model';

@Injectable()
export class OrderService {
  constructor(private db: DatabaseService) {}

  public async getUserOrders(user: User) {
    return this.db.orders.find({ userId: user._id }).sort({ created: -1 });
  }

  public async addOrder(order: CreateOrderDto, user: User) {
    // Check if discount code is valid
    let discount: DiscountCode;
    if (order.discountCode) {
      discount = await this.db.discountCodes.findOne<DiscountCode>({ code: order.discountCode });
      if (!discount || discount.uses <= 0) {
        throw new BadRequestException('The discount code specified is invalid');
      }
    }

    // Get all order products
    const productIds = order.products.map((product) => MongoUtils.toObjectId(product._id));
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
    const response = (await this.db.orders.insertOne(toAddOrder as any))?.ops[0];

    // Update user points
    const userDoc = await this.db.users.findOne<User>({ _id: user._id });
    const newPoints = userDoc.points + Math.floor(total);
    await this.db.users.updateOne({ _id: user._id }, { $set: { points: newPoints } });

    // Decrease discount code uses
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
