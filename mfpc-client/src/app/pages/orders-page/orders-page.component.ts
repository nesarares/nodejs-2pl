import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit {
  orders: Order[];

  error: any;

  constructor(private orderService: OrderService) { }

  async ngOnInit() {
    try {
      this.error = null;
      this.orders = await this.orderService.getOrders();
    } catch (error) {
      this.error = error;
    }
  }

}
