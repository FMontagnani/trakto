import { s3FtpBuilder } from "@adapters/s3/s3-ftp-handler";
import { taskCommandFactory, taskQueryFactory } from "@adapters/mongo";
import { getTaskStatusBuilder, imageProcessorBuilder } from "@core/image-processor";
import { Db } from "mongodb";
import { Config } from "@config/environment";

function imageProcessorFactory(db: Db, config: Config) {
  const taskCommand = taskCommandFactory(db);
  const taskQuery = taskQueryFactory(db);  
  
  return {
    imageTaskProcessingCommand: imageProcessorBuilder(taskCommand, s3FtpBuilder(config)),
    getImageTaskCommand: getTaskStatusBuilder(taskQuery),
  };
}

export { imageProcessorFactory };
