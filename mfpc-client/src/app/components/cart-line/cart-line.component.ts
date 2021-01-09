import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-cart-line',
  templateUrl: './cart-line.component.html',
  styleUrls: ['./cart-line.component.scss']
})
export class CartLineComponent implements OnInit {
  @Input() product: Product;
  @Input() amount: number;

  constructor() { }

  ngOnInit(): void {
  }

}
