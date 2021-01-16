import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReqToken } from 'src/decorators/req-token.decorator';
import { ReqUser } from 'src/decorators/req-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  public async logout(@ReqToken() authToken: string) {
    return this.authService.logout(authToken);
  }

  @Post('register')
  public async register(@Body() user: any) {
    return this.authService.register(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  public async getMe(@ReqUser() user: User) {
    return user;
  }
}
