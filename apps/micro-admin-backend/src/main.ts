import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as momentTimezone from 'moment-timezone';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  // Creates app as a microservice
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      noAck: false, //<-- This flag changes the message deleting behavior on Rabbit,
      //it will not delete messages until the receiver acknowledges
      queue: process.env.RMQ_BACKEND_QUEUE,
    },
  });

  Date.prototype.toJSON = function (): string {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();

  logger.log('admin-backend microservice listening.');
}
bootstrap();
