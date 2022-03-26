import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  // While dealing with a single service, only one method is enough
  getAdminBackendInstance(): ClientProxy {
    const queue = process.env.RMQ_BACKEND_QUEUE;
    return this.getInstance(queue);
  }

  // As the microservices increase, new methods are necessary
  getChallengesInstance(): ClientProxy {
    const queue = process.env.RMQ_CHALLENGE_QUEUE;
    return this.getInstance(queue);
  }

  getRankingsInstance(): ClientProxy {
    const queue = process.env.RMQ_RANKING_QUEUE;
    return this.getInstance(queue);
  }

  // The instance method is the same though
  private getInstance(queue: string): ClientProxy {
    // Adding the proxy layer to top level interface
    return ClientProxyFactory.create({
      transport: Transport.RMQ, // RabbitMQ transport layer
      options: {
        urls: [process.env.RMQ_URL],
        queue,
      },
    });
  }
}
