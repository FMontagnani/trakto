import { s3FtpBuilder } from '@adapters/s3/s3-ftp-handler';
import { taskCommandFactory, taskQueryFactory } from '@adapters/mongo/index';
import { getTaskStatusBuilder, imageProcessorBuilder } from '@core/image-processor/index';
import { Db } from 'mongodb';
import { Config } from '@config/environment';
import { createRabbitMQProducer } from '@adapters/rabbitmq/index';
import EventEmitter from 'events';

function imageProcessorFactory(db: Db, config: Config, channel: EventEmitter) {
  const taskCommand = taskCommandFactory(db);
  const taskQuery = taskQueryFactory(db);  
  const producer = createRabbitMQProducer(config.queue.queueName, channel);

  return {
    imageTaskProcessingCommand: imageProcessorBuilder(taskCommand, s3FtpBuilder(config), producer),
    getImageTaskCommand: getTaskStatusBuilder(taskQuery),
  };
}

export { imageProcessorFactory };
