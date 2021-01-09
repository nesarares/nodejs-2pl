import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  error: any;

  constructor(private productService: ProductService) { }

  async ngOnInit() {
    try {
      this.products = await this.productService.getProducts();
    } catch (error) {
      this.error = error;
    }
  }

}
