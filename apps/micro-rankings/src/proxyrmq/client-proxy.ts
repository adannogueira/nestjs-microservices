import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  getAdminBackendInstance(): ClientProxy {
    const queue = process.env.RMQ_BACKEND_QUEUE;
    return this.getInstance(queue);
  }

  getChallengesInstance(): ClientProxy {
    const queue = process.env.RMQ_CHALLENGE_QUEUE;
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
