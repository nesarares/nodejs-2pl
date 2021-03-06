import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReqUser } from 'src/decorators/req-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../models/user.model';
import { DiscountCodeService } from '../services/discount-code.service';
import { DiscountCode } from '../models/discount-code.model';

@Controller('discount-codes')
export class DiscountCodeController {
  constructor(private discountCodeService: DiscountCodeService) {}

  @Post()
  public async addDiscountCode(@Body() discountCode: DiscountCode): Promise<DiscountCode> {
    return this.discountCodeService.addDiscountCode(discountCode);
  }

  @Get('valid')
  public async validate(@Query('code') code: string) {
    code = (code || '').toUpperCase();
    return this.discountCodeService.verifyDiscountCode(code);
  }

	@Post('me')
	@UseGuards(AuthGuard)
  public async addMyDiscountCode(@ReqUser() user: User, @Body('code') code: string) {
    code = (code || '').toUpperCase();
    return this.discountCodeService.addMyDiscountCode(user._id, code);
  }
}
