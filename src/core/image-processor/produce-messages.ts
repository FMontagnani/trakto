import { SendImageProcessingMessageCommand } from '@ports/input/TaskProcessing';
import { MessageProducer } from '@ports/output/MessageProducer';

export function imageMessageProducerBuilder(producer: MessageProducer): SendImageProcessingMessageCommand  {
  return {
    async execute(fileKey: string, imageId: string): Promise<void> {
      const message = {
        fileKey,
        imageId
      };
      
      await producer.sendMessage(message);
    }
  }
}

