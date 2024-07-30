import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
