import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private cartService: CartService) {}

  async checkDiscountCode(
    code: string
  ): Promise<{ valid: boolean; discount?: number }> {
    return {
      valid: true,
      discount: 10,
    };
  }

  async placeOrder(discountCode: string) {
    const cart = await this.cartService.cart;
    console.log(cart);
    const body = {
      products: cart.items,
      ...(discountCode ? { discountCode } : {}),
    };
    await this.http.post('orders', body).toPromise();
    this.cartService.emptyCart();
  }

  async getOrders(): Promise<Order[]> {
    return this.http.get<Order[]>('orders').toPromise();
  }
}
