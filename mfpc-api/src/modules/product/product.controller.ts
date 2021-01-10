import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Product } from './models/product.model';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get()
	public async getProducts(@Query('ids') ids: string): Promise<Product[]> {
		const filter: any = {};
		if (ids) {
			filter.ids = ids.split(',');
		}
		return this.productService.getProducts(filter);
	}

	@Post()
	public async addProduct(@Body() product: Product): Promise<Product> {
		return this.productService.addProduct(product);
	}
}
