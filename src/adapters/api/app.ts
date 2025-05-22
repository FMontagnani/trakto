import express from 'express';
import { EventEmitter } from 'node:stream';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { makeTaskRouter } from './routes/index';
import config from '@config/environment';
import { getDB } from '../mongo/index';
import { Db } from 'mongodb';
import { getMQChannel } from '../rabbitmq/broker';
import { createRabbitMQConsumer } from '../rabbitmq/index';
import { imageConsumerFactory } from '@core/factories/image-consumer-factory';

const createExpressApp = (db: Db, channel: EventEmitter) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Routes
  app.use('/api', makeTaskRouter(db, config, channel));

  return app;
};

const startServer = async (port: number) => {
  const db = await getDB(config.mongodb.uri, config.mongodb.dbName);
  const mqChannel = await getMQChannel(config);

  // Create the image processor using our factory
  const { imageProcessor } = imageConsumerFactory(db, config);

  // Instantiate and start the RabbitMQ consumer with the image processor
  const consumer = createRabbitMQConsumer(config.queue.queueName, mqChannel, imageProcessor);
  consumer.consumeMessage().catch((err: unknown) => {
    console.error('Error in message consumer:', err);
  });

  const app = createExpressApp(db, mqChannel);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Image processing consumer is active and listening on queue: ${config.queue.queueName}`);
  });
}

startServer(Number(config.port)).catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
