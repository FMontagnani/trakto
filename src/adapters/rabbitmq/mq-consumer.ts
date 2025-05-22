import amqp from 'amqplib';
import { MessageConsumer } from '@ports/input/MessageConsumer';

interface ImageTaskMessage {
  fileKey: string;
  imageId: string;
}

export const createRabbitMQConsumer = (
  queueName: string, 
  channel: amqp.Channel,
  imageProcessor?: { execute: (imagePath: string, imageId: string) => Promise<void> }
): MessageConsumer => {
  return {
    async consumeMessage(): Promise<void> {
      try {
        console.log(`Starting to consume messages from queue: ${queueName}`);
        
        channel.consume(queueName, async (msg) => {
          if (msg) {
            try {
              const message = JSON.parse(msg.content.toString()) as ImageTaskMessage;
              console.log(`Processing message: ${JSON.stringify(message)}`);
              
              if (imageProcessor && message.fileKey && message.imageId) {
                console.log(`Processing image: ${message.fileKey}, ID: ${message.imageId}`);
                await imageProcessor.execute(message.fileKey, message.imageId);
                console.log(`Successfully processed image: ${message.fileKey}`);
              } else {
                console.warn('No image processor provided or invalid message format');
              }
              
              channel.ack(msg);
            } catch (error) {
              console.error('Error processing message:', error);
              // Negative acknowledgment, message will be requeued
              channel.nack(msg, false, true);
            }
          }
        });
        
        console.log('RabbitMQ consumer started successfully');
      } catch (error) {
        console.error('Error consuming message from RabbitMQ:', error);
        throw new Error('Failed to consume message from RabbitMQ');
      }
    }
  }
}
