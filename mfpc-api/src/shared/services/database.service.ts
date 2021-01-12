import { Injectable } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';
import * as config from 'config';

@Injectable()
export class DatabaseService {
  public client: MongoClient;

  public authDb: Db;
  public mainDb: Db;

  public users: Collection;
  public sessions: Collection;
  public products: Collection;
  public discountCodes: Collection;

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
    } catch (err) {
      console.error(err);
    }
  }
}
