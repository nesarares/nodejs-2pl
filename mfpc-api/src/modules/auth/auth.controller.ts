import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './models/user.model';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	public async login(@Body('email') email: string, @Body('password') password: string) {
		return this.authService.login(email, password);
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
