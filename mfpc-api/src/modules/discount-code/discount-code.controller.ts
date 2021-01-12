import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/models/user.model';
import { DiscountCodeService } from './discount-code.service';
import { DiscountCode } from './models/discount-code.model';

@Controller('discount-codes')
export class DiscountCodeController {
  constructor(private discountCodeService: DiscountCodeService) {}

  @Post()
  public async addDiscountCode(@Body() discountCode: DiscountCode): Promise<DiscountCode> {
    return this.discountCodeService.addDiscountCode(discountCode);
  }

	@Post('me')
	@UseGuards(AuthGuard)
  public async addMyDiscountCode(@ReqUser() user: User, @Body('code') code: string) {
    code = (code || '').toUpperCase();
    return this.discountCodeService.addMyDiscountCode(user._id, code);
  }
}
