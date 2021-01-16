import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReqUser } from 'src/decorators/req-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../models/user.model';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderService } from '../services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard)
  public async getMyOrders(@ReqUser() user: User) {
    return (await this.orderService.getUserOrders(user)).toArray();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createOrder(@Body() order: CreateOrderDto, @ReqUser() user: User) {
    if (order.discountCode) {
      order.discountCode = order.discountCode.toUpperCase();
    }
    return this.orderService.addOrder(order, user);
  }
}
