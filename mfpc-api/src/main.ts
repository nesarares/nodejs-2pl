import * as path from 'path';

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'config') + path.sep;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as morgan from 'morgan';
import { TimeUtils } from './shared/utils/time.utils';
import * as consoleStamp from 'console-stamp';
import * as chalk from 'chalk';

consoleStamp(console, {
  format: ':date(yyyy-mm-dd HH:MM:ss).green'
});

morgan.token('customDate', () => chalk.green(`[${TimeUtils.nowFormatted}]`));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(morgan(`:customDate :method ${chalk.yellow(':url')} :status :response-time ms - :res[content-length] B`))

  const port = config.get<number>('server.port');
  await app.listen(port);

  console.log(`Server started listening on port ${port}`);
}
bootstrap();
