import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orders: Order[] = [];

  constructor(private cartService: CartService) {}

  async checkDiscountCode(
    code: string
  ): Promise<{ valid: boolean; discount?: number }> {
    return {
      valid: true,
      discount: 10,
    };
  }

  async placeOrder(discountCode: string, cartProducts: any, subtotal: any) {
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 1000);
    });

    const cart = await this.cartService.cart;
    const products = cartProducts.map((cp) => {
      const prod = { amount: cp.amount, ...cp.product };
      delete prod.description;
      return prod;
    });
    const order: Order = {
      discountCode: discountCode ?? null,
      subtotal,
      products,
    };
    this.orders.push(order);
    this.cartService.emptyCart();
  }
}
