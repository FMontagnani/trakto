import { s3FtpHandler } from "@adapters/s3/s3-ftp-handler";
import { taskCommandFactory, taskQueryFactory } from "@adapters/mongo";
import { getTaskStatusBuilder, imageProcessorBuilder } from "@core/image-processor";
import { Db } from "mongodb";

function imageProcessorFactory(db: Db) {
  const taskCommand = taskCommandFactory(db);
  const taskQuery = taskQueryFactory(db);  
  
  return {
    imageTaskProcessingCommand: imageProcessorBuilder(taskCommand, s3FtpHandler),
    getImageTaskCommand: getTaskStatusBuilder(taskQuery),
  };
}

export { imageProcessorFactory };
