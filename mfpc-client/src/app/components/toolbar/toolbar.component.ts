import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CartService } from 'src/app/services/cart.service';

@UntilDestroy()
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  cartAmount = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.pipe(untilDestroyed(this)).subscribe(cart => {
      this.cartAmount = cart.amount;
    })
  }

}
