import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@UntilDestroy()
@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cart: Cart;
  cartProducts: { amount: number; product: Product }[];
  products: Product[];

  isLoading = false;
  error: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(untilDestroyed(this))
      .subscribe(async (cart) => {
        this.cart = cart;
        if (!this.cartProducts && !this.isLoading) {
          await this.loadProducts();
        }
        await this.filterProducts();
      });
  }

  async loadProducts() {
    try {
      this.isLoading = true;
      const products = await this.productService.getProductsById(
        this.cart.items.map((i) => i._id)
      );
      this.products = products.sort((p1, p2) => p1.name.localeCompare(p2.name));
    } catch (err) {
      console.error(err);
      this.error = err;
      this.cartProducts = [];
    } finally {
      this.isLoading = false;
    }
  }

  async filterProducts() {
    this.cartProducts = [];
    this.cart.items.forEach((item) => {
      this.cartProducts.push({
        amount: item.amount,
        product: this.products.find((p) => p._id === item._id),
      });
    });
  }
}
