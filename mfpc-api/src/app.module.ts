import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './shared/services/database.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { DiscountCodeService } from './modules/discount-code/discount-code.service';
import { DiscountCodeController } from './modules/discount-code/discount-code.controller';
import { OrderController } from './modules/order/order.controller';
import { OrderService } from './modules/order/order.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, ProductController, DiscountCodeController, OrderController],
  providers: [AppService, DatabaseService, AuthService, ProductService, DiscountCodeService, OrderService],
})
export class AppModule {}
