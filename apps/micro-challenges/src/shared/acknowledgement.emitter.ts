import { RmqContext } from '@nestjs/microservices';
import { ACK_ERRORS } from '../constants/ack.errors';

export class AcknowledgementEmitter {
  static async emit(context: RmqContext, executionError?: Error) {
    // When working with message acknowledgements, we need to capture the channel and message
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    if (executionError) {
      const acknowledgeableError = ACK_ERRORS.find((err) =>
        executionError.message.includes(err),
      );
      acknowledgeableError
        ? await channel.ack(originalMessage)
        : await channel.nack(originalMessage);
    }
    // and acknowledge that to RabbitMQ after the execution is confirmed
    await channel.ack(originalMessage);
  }
}
