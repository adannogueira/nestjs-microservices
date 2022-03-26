import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class ExceptionLogger {
  logger: Logger;
  constructor(loggerName: string) {
    this.logger = new Logger(loggerName);
  }

  logAndThrowException(error: Error): never {
    this.logger.error(`Error: ${JSON.stringify(error.message)}`);
    // Microservices exceptions are not HTTP!
    throw new RpcException(error.message);
  }
}
