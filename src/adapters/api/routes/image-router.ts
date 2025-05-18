import { uploadImageMiddleware, validateUUIDParamMiddleware } from '../middlewares';
import { imageProcessorFactory } from '@core/factories'
import { Router } from 'express';
import { getImageTaskStatusBuilder, uploadImageBuilder } from '../controllers/image-controller';
import { Db } from 'mongodb';

export function makeTaskRouter(db: Db) {
  const commands = imageProcessorFactory(db);

  return Router()
    .post('/tasks', uploadImageMiddleware, uploadImageBuilder(commands.imageTaskProcessingCommand))
    .get('/tasks/:taskId', validateUUIDParamMiddleware, getImageTaskStatusBuilder(commands.getImageTaskCommand));
}
