import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/services/database.service';
import { Product } from './models/product.model';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  public async getProducts(): Promise<Product[]> {
    return this.db.products.find<Product>({}).sort({ name: 1 }).toArray();
	}
	
	public async addProduct(product: Product): Promise<Product> {
		const result = await this.db.products.insertOne(product);
		return result.ops[0];
  }
}
