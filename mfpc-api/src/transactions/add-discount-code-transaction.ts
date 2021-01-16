import { Transaction } from './transaction';

export class AddDiscountCodeTransaction extends Transaction {
  constructor() {
    super();
  }

  protected async doTransaction(): Promise<void> {
    // TODO: Implement add discount code transaction
    console.log('run');

    // // Check if user has discount
    // const user = await this.db.users.findOne<User>({ _id: MongoUtils.toObjectId(userId) });
    // const foundCode = (user.discountCodes ?? []).find((dc) => dc.code === code);
    // if (foundCode) {
    //   throw new BadRequestException('You already have or had this discount code');
    // }

    // // Check if discount code is valid
    // const discountCode = await this.db.discountCodes.findOne<DiscountCode>({ code });
    // if (!discountCode || discountCode.uses <= 0) {
    //   throw new BadRequestException('The discount code is invalid');
    // }

    // // Decrease discount code uses
    // await this.db.discountCodes.updateOne(
    //   { code },
    //   {
    //     $set: { uses: discountCode.uses - 1 },
    //   }
    // );

    // // Update user discounts
    // const newDiscountCodes: User['discountCodes'] = [
    //   ...user.discountCodes,
    //   {
    //     _id: discountCode._id,
    //     code,
    //     discount: discountCode.discount,
    //     used: false,
    //   },
    // ];
    // await this.db.users.findOneAndUpdate(
    //   { _id: MongoUtils.toObjectId(userId) },
    //   { $set: { discountCodes: newDiscountCodes } },
    // );

    // return { added: true };
  }
}
