import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CartService } from 'src/app/services/cart.service';

@UntilDestroy()
@Component({
  selector: 'app-product-actions',
  templateUrl: './product-actions.component.html',
  styleUrls: ['./product-actions.component.scss'],
})
export class ProductActionsComponent implements OnInit {
  @Input() productId: string;
  isInCart = false;
  cartAmount = 0;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart) => {
      const foundInCart = cart.items.find(
        (item) => item._id === this.productId
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
