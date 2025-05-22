import { createRabbitMQProducer } from '@adapters/rabbitmq/mq-producer';
import { imageMessageProducerBuilder } from '@core/image-processor/produce-messages';
import { Config } from '@config/environment';
import { SendImageProcessingMessageCommand } from '@ports/input/TaskProcessing';
import { getMQChannel } from '@adapters/rabbitmq/broker';

let startupPromise: Promise<SendImageProcessingMessageCommand> | null = null;

export function messageProducerFactory(config: Config): Promise<SendImageProcessingMessageCommand> {
  if (!startupPromise) {
    startupPromise = (async () => {
      const channel = await getMQChannel(config);
      const producer = createRabbitMQProducer(config.queue.queueName, channel);

      return imageMessageProducerBuilder(producer);
    })();
  }
  return startupPromise;
}
