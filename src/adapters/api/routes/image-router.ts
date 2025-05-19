import { uploadImageMiddleware, validateUUIDParamMiddleware } from '../middlewares';
import { imageProcessorFactory } from '@core/factories'
import { Router } from 'express';
import { getImageTaskStatusBuilder, uploadImageBuilder } from '../controllers/image-controller';
import { Db } from 'mongodb';
import { Config } from '@config/environment';

export function makeTaskRouter(db: Db, config: Config) {
  const commands = imageProcessorFactory(db, config);

  return Router()
    .post('/tasks', uploadImageMiddleware, uploadImageBuilder(commands.imageTaskProcessingCommand))
    .get('/tasks/:taskId', validateUUIDParamMiddleware, getImageTaskStatusBuilder(commands.getImageTaskCommand));
}
