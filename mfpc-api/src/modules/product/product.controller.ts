import { Body, Controller, Get, Post } from '@nestjs/common';
import { Product } from './models/product.model';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get()
	public async getProducts(): Promise<Product[]> {
		return this.productService.getProducts();
	}

	@Post()
	public async addProduct(@Body() product: Product): Promise<Product> {
		return this.productService.addProduct(product);
	}
}
