import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      noAck: false,
      queue: process.env.RMQ_MESSAGE_QUEUE,
    },
  });

  await app.listen();

  logger.log('micro-messages microservice listening.');
}
bootstrap();
