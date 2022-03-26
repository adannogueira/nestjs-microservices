import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as momentTimezone from 'moment-timezone';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      noAck: false,
      queue: process.env.RMQ_RANKING_QUEUE,
    },
  });

  Date.prototype.toJSON = function (): string {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();

  logger.log('micro-rankings microservice listening.');
}
bootstrap();
