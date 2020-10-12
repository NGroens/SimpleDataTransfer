import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './api/ws/adapter/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(process.env.EXPRESS_PORT || 3000);
}
bootstrap();
