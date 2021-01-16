import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './services/database.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { DiscountCodeService } from './services/discount-code.service';
import { DiscountCodeController } from './controllers/discount-code.controller';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, ProductController, DiscountCodeController, OrderController],
  providers: [AppService, DatabaseService, AuthService, ProductService, DiscountCodeService, OrderService],
})
export class AppModule {}
