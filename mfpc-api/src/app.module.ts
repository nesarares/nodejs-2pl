import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './shared/services/database.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, ProductController],
  providers: [AppService, DatabaseService, AuthService, ProductService],
})
export class AppModule {}
