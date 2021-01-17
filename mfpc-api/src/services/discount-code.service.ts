import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from 'src/services/database.service';
import { DiscountCode } from '../models/discount-code.model';
import { AddDiscountCodeTransaction } from 'src/transactions/add-discount-code-transaction';

@Injectable()
export class DiscountCodeService {
  constructor(private db: DatabaseService) {}

  public async addDiscountCode(discountCode: DiscountCode): Promise<DiscountCode> {
    const result = await this.db.discountCodes.insertOne(discountCode);
    return result.ops[0];
  }

  public async verifyDiscountCode(code: string): Promise<{ valid: boolean; discount?: number }> {
    const discount = await this.db.discountCodes.findOne<DiscountCode>({ code, uses: { $gt: 0 } });
    if (discount) {
      return { valid: true, discount: discount.discount };
    } else {
      return { valid: false };
    }
  }

  public async addMyDiscountCode(userId: string | ObjectId, code: string) {
    const transaction = new AddDiscountCodeTransaction(this.db, { userId, code });
    return transaction.run();
  }
}
