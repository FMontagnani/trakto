import amqp from 'amqplib';
import { MessageProducer } from '@ports/output/MessageProducer';
import EventEmitter from 'events';

export const createRabbitMQProducer = (queueName: string, channel: EventEmitter): MessageProducer => {
  return {
    async sendMessage<T>(message: T): Promise<void> {
      try {
        const messageBuffer = Buffer.from(JSON.stringify(message));
        (channel as amqp.Channel).sendToQueue(queueName, messageBuffer, {
          persistent: true,
          contentType: 'application/json',
        });
      } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
        throw new Error('Failed to send message to RabbitMQ');
      }
    }
  }
}
