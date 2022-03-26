import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  getRankingsInstance(): ClientProxy {
    const queue = process.env.RMQ_RANKING_QUEUE;
    return this.getInstance(queue);
  }

  getMessagesInstance(): ClientProxy {
    const queue = process.env.RMQ_MESSAGE_QUEUE;
    return this.getInstance(queue);
  }

  private getInstance(queue: string): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue,
      },
    });
  }
}
