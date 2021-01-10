import * as path from 'path';

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'config') + path.sep;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const port = config.get<number>('server.port');
  await app.listen(port);
}
bootstrap();
