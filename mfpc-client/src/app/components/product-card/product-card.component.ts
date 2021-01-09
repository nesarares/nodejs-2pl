import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@UntilDestroy()
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;

  isInCart = false;
  cartAmount = 0;

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart) => {
      const foundInCart = cart.items.find(
        (item) => item._id === this.product?._id
      );
      if (foundInCart) {
        this.isInCart = true;
        this.cartAmount = foundInCart.amount;
      } else {
        this.isInCart = false;
      }
    });
  }
}
