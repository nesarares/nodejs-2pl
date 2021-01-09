import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { debounceTime } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';

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
  subtotal: number;
  discountCode: string;

  checkCodeSubject = new Subject();
  isCodeValid = false;
  codeChecked = false;
  discount: number;

  isLoading = false;
  isLoadingOrder = false;
  error: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
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

    this.checkCodeSubject.pipe(debounceTime(400)).subscribe(() => {
      this.checkDiscountCode();
    })
  }

  get discountPrice() {
    return this.discountCode && this.codeChecked && this.isCodeValid ? (this.subtotal * this.discount / 100) : 0;
  }

  async loadProducts() {
    try {
      this.error = null;
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
    this.subtotal = this.cartProducts.reduce(
      (acc, prod) => (acc += prod.amount * prod.product.price),
      0
    );
  }

  async checkDiscountCode() {
    try {
      this.error = null;
      this.codeChecked = false;
      const response = await this.orderService.checkDiscountCode(this.discountCode);
      this.isCodeValid = response.valid;
      if (this.isCodeValid) {
        this.discount = response.discount;
      }
    } catch (error) {
      console.error(error);
      this.error = error;
      this.isCodeValid = false;
    } finally {
      this.codeChecked = true;
    }
  }

  async placeOrder() {
    try {
      this.error = null;
      this.isLoadingOrder = true;
      await this.orderService.placeOrder(this.discountCode, this.cartProducts, this.subtotal);
      await this.router.navigate(['/orders']);
    } catch (error) {
      console.error(error);
      this.error = error;
    } finally {
      this.isLoadingOrder = false;
    }
  }
}
