import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(null);
  public cart$ = this.cartSubject.asObservable();
  cart: Cart;

  constructor() {
    let cart: Cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || !cart.items) {
      cart = { items: [], amount: 0 };
    }
    this.cart = cart;
    this.cartChanged();
  }

  private cartChanged() {
    this.cart.amount = this.cart?.items?.reduce(((acc, item) => acc += item.amount), 0) ?? 0;
    this.cartSubject.next(this.cart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  public addToCart(productId: Product['_id'], amount: number) {
    if (amount === 0) return;
    const foundInCart = this.cart.items.find(
      (item) => item._id === productId
    );
    if (foundInCart) {
      foundInCart.amount += amount;
      if (foundInCart.amount <= 0) {
        this.cart.items = this.cart.items.filter(
          (item) => item._id !== productId
        );
      }
      this.cartChanged();
    } else if (amount > 0) {
      this.cart.items.push({
        _id: productId,
        amount,
      });
      this.cartChanged();
    }
  }
}
