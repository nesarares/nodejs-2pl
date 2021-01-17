import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database.service';
import { AddOrderTransaction } from 'src/transactions/add-order-transaction';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { User } from '../models/user.model';

@Injectable()
export class OrderService {
  constructor(private db: DatabaseService) {}

  public async getUserOrders(user: User) {
    return this.db.orders.find({ userId: user._id }).sort({ created: -1 });
  }

  public async addOrder(order: CreateOrderDto, user: User) {
    const transaction = new AddOrderTransaction(this.db, { order, user });
    return transaction.run();
  }
}
