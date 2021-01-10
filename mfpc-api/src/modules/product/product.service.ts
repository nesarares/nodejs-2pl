import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/services/database.service';
import { MongoUtils } from 'src/shared/utils/mongo.utils';
import { Product } from './models/product.model';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  public async getProducts(filter: { ids?: string[] }): Promise<Product[]> {
    const query: any = {};
    if (filter.ids) {
      query._id = { $in: filter.ids.map((id) => MongoUtils.toObjectId(id)) };
    }
    return this.db.products.find<Product>(query).sort({ name: 1 }).toArray();
  }

  public async addProduct(product: Product): Promise<Product> {
    const result = await this.db.products.insertOne(product);
    return result.ops[0];
  }
}
