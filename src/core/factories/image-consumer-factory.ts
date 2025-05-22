import { Db } from 'mongodb';
import { Config } from '@config/environment';
import { taskCommandFactory } from '@adapters/mongo/index';
import { s3FtpBuilder } from '@adapters/s3/s3-ftp-handler';
import { consumeImageProcessorBuilder } from '@core/image-processor/consumer-image-messages';
import SharpProcessorService from '@core/image-processor/sharp-image-service';

export function imageConsumerFactory(db: Db, config: Config) {
  const taskCommand = taskCommandFactory(db);
  const ftpHandler = s3FtpBuilder(config);
  
  return {
    imageProcessor: consumeImageProcessorBuilder(ftpHandler, taskCommand, SharpProcessorService)
  };
}