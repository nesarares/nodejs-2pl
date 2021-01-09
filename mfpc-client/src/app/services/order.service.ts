import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orders: Order[] = [
    {
      discountCode: null,
      subtotal: 79,
      total: 79,
      products: [
        {
          amount: 1,
          _id: '2',
          category: 'Beer',
          name: 'Scotch Silly',
          price: 15,
          imageUrl:
            'https://www.beerstation.ro/wp-content/uploads/2020/11/BS-Scotch-silly..jpg',
        },
        {
          amount: 4,
          _id: '3',
          category: 'Beer',
          name: 'Hop Hooligans – Royal Eexecution',
          price: 16,
          imageUrl:
            'https://www.beerstation.ro/wp-content/uploads/2020/11/BS-hop-hooligans-Royal-execution-the-final-cut.jpg',
        },
      ],
      created: new Date('2021-01-09T15:22:39.106Z'),
    },
    {
      discountCode: 'DISCO',
      subtotal: 32,
      products: [
        {
          amount: 2,
          _id: '3',
          category: 'Beer',
          name: 'Hop Hooligans – Royal Eexecution',
          price: 16,
          imageUrl:
            'https://www.beerstation.ro/wp-content/uploads/2020/11/BS-hop-hooligans-Royal-execution-the-final-cut.jpg',
        },
      ],
      discount: 3.2,
      total: 35.2,
      created: new Date('2021-01-09T15:25:18.432Z'),
    },
  ];

  constructor(private cartService: CartService) {}

  async checkDiscountCode(
    code: string
  ): Promise<{ valid: boolean; discount?: number }> {
    return {
      valid: true,
      discount: 10,
    };
  }

  async placeOrder(
    discountCode: string,
    cartProducts: any,
    subtotal: any,
    discountPrice: any
  ) {
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
      discount: discountPrice,
      total: subtotal + discountPrice,
      created: new Date(),
    };
    console.log(order);
    this.orders.push(order);
    this.cartService.emptyCart();
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }
}
