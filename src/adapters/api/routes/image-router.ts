import { uploadImageMiddleware, validateUUIDParamMiddleware } from '../middlewares/index';
import { imageProcessorFactory } from '@core/factories/index';
import { Router } from 'express';
import { getImageTaskStatusBuilder, uploadImageBuilder } from '../controllers/image-controller';
import { Db } from 'mongodb';
import { Config } from '@config/environment';
import EventEmitter from 'events';

export function makeTaskRouter(db: Db, config: Config, channel: EventEmitter) {
  const commands = imageProcessorFactory(db, config, channel);

  return Router()
    .post('/tasks', uploadImageMiddleware, uploadImageBuilder(commands.imageTaskProcessingCommand))
    .get('/tasks/:taskId', validateUUIDParamMiddleware, getImageTaskStatusBuilder(commands.getImageTaskCommand));
}
