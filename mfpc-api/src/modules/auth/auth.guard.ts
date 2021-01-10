import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authentication header');
    }
    const token = authHeader.slice(7);
    const result = await this.authService.verifyToken(token);
    if (result.valid) {
      request.user = await this.authService.getUserById(result.decoded.uid);
    }
    return true;
  }
}
