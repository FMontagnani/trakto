import amqp from 'amqplib';
import { Config } from '@config/environment';

let channel: amqp.Channel | null = null;

export const getMQChannel = async (config: Config) => {
  if (!channel) {
    try {
      console.log(`Attempting to connect to RabbitMQ at: ${config.queue.queueUrl}`);
      const connection = await amqp.connect(config.queue.queueUrl);
      channel = await connection.createChannel();
      console.log(`Successfully connected to RabbitMQ, asserting queue: ${config.queue.queueName}`);
      await channel.assertQueue(config.queue.queueName);
      console.log('Queue assertion successful');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      channel = null; // Reset channel to null to allow retry
      throw error;
    }
  }
  return channel;
}
