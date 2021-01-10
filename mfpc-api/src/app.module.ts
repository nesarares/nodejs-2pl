import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './shared/services/database.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, DatabaseService, AuthService],
})
export class AppModule {}
