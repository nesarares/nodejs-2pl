import { Injectable } from '@nestjs/common';
import * as config from 'config';
import { Collection, Db, MongoClient } from 'mongodb';

@Injectable()
export class DatabaseService {
  public client: MongoClient;

  public authDb: Db;
  public mainDb: Db;

  public users: Collection;
  public sessions: Collection;
  public products: Collection;
  public discountCodes: Collection;
  public orders: Collection;

  constructor() {
    const url = config.get<string>('mongo.url');

    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.initDb();
  }

  private async initDb() {
    try {
      await this.client.connect();
      console.log('Connected to the mongo database server.');

      this.authDb = this.client.db('auth');
      this.mainDb = this.client.db('main');

      this.users = this.authDb.collection('users');
      this.sessions = this.authDb.collection('sessions');
      this.products = this.mainDb.collection('products');
      this.discountCodes = this.mainDb.collection('discount-codes');
      this.orders = this.mainDb.collection('orders');

      await this.setIndexes();
    } catch (err) {
      console.error(err);
    }
  }

  private async setIndexes() {
    await Promise.all([
      this.users.createIndex({ email: 1 }),
      this.sessions.createIndex({ token: 1 }),
      this.products.createIndex({ name: 1 }),
      this.orders.createIndex({ userId: 1, created: -1 }),
      this.discountCodes.createIndex({ code: 1 }),
    ])
  }
}
