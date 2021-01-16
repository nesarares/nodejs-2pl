import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from 'src/services/database.service';
import { MongoUtils } from 'src/utils/mongo.utils';
import { User } from '../models/user.model';
import { DiscountCode } from '../models/discount-code.model';
import { AddDiscountCodeTransaction } from 'src/transactions/add-discount-code-transaction';

@Injectable()
export class DiscountCodeService {
  constructor(private db: DatabaseService) {}

  public async addDiscountCode(discountCode: DiscountCode): Promise<DiscountCode> {
    const result = await this.db.discountCodes.insertOne(discountCode);
    return result.ops[0];
  }

  public async addMyDiscountCode(userId: string | ObjectId, code: string) {
    const transaction = new AddDiscountCodeTransaction();
    return transaction.run();
  }
}
