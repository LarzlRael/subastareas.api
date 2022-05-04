import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  /* const reflector = app.get(Reflector); */
  /*   app.useGlobalGuards(new AuthGuard(reflector)); */
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
