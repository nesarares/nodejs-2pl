import { Injectable } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private cartService: CartService) { }

  async checkDiscountCode(code: string): Promise<boolean> {
    console.log(code);
    return true;
  }

  async placeOrder(discountCode?: string) {
    const cart = await this.cartService.cart;
    console.log({cart, discountCode});
    this.cartService.emptyCart();
  }
}
