import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest().authToken;
});
