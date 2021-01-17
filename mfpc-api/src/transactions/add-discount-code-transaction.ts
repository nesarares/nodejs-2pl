import { LockType } from 'src/services/transaction.service';
import { Transaction } from './transaction';
import { MongoUtils } from 'src/utils/mongo.utils';
import { User } from '../models/user.model';
import { DatabaseService } from 'src/services/database.service';
import { BadRequestException } from '@nestjs/common';
import { DiscountCode } from 'src/models/discount-code.model';
import { ObjectId } from 'mongodb';
import { Utils } from 'src/utils/utils';

export class AddDiscountCodeTransaction extends Transaction {
  constructor(private db: DatabaseService, private data: { userId: string | ObjectId; code: string }) {
    super();
  }

  protected async doTransaction(): Promise<any> {
    const { userId, code } = this.data;

    // Check if user has discount
    await this.lock(LockType.read, 'User');
    const user = await this.db.users.findOne<User>({ _id: MongoUtils.toObjectId(userId) });

    const foundCode = (user.discountCodes ?? []).find((dc) => dc.code === code);
    if (foundCode) {
      throw new BadRequestException('You already have or had this discount code');
    }

    // Check if discount code is valid
    await this.lock(LockType.read, 'DiscountCode');
    const discountCode = await this.db.discountCodes.findOne<DiscountCode>({ code });

    if (!discountCode || discountCode.uses <= 0) {
      throw new BadRequestException('The discount code is invalid');
    }

    await Utils.sleep(3000); // Debug for deadlock

    // Decrease discount code uses
    await this.lock(LockType.write, 'DiscountCode');
    await this.db.discountCodes.updateOne(
      { code },
      {
        $set: { uses: discountCode.uses - 1 },
      }
    );

    // Update user discounts
    const newDiscountCodes: User['discountCodes'] = [
      ...user.discountCodes,
      {
        _id: discountCode._id,
        code,
        discount: discountCode.discount,
        used: false,
      },
    ];

    await this.lock(LockType.write, 'User');
    await this.db.users.findOneAndUpdate({ _id: MongoUtils.toObjectId(userId) }, { $set: { discountCodes: newDiscountCodes } });

    return { added: true };
  }
}
