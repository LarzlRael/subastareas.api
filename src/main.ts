import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/guard/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
/*   app.useGlobalGuards(new AuthGuard(reflector)); */
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
