import path from 'node:path';
import Task from '../entities/task';
import { UploadFileError } from '../errors/ftp-errors/UploadFileError';
import { StartTaskError } from '../errors/image-processor/StartTaskError';
import { ImageTaskProcessingCommand } from '@ports/input/TaskProcessing';
import { FTPHandler } from '@ports/output/FTPHandler';
import { TaskCommand } from '@ports/output/TaskCommand';
import { UploadTaskResult, TaskStatusEnum } from '../../types';
import { MessageProducer } from '@ports/output/MessageProducer';

export function imageProcessorBuilder(imageCommandRepository: TaskCommand, ftpHandler: FTPHandler, producer: MessageProducer): ImageTaskProcessingCommand  {
  return {
    async execute(fileData: Buffer, fileName: string, mimetype: string): Promise<UploadTaskResult> {
      const taskId = Task.generateTaskId();
      const extension = path.extname(fileName);

      try {
        await imageCommandRepository.createTask({ id: taskId, status: TaskStatusEnum.PENDING, original_filename: fileName, 'original_metadata.mimetype': mimetype });
        const fileKey = `${taskId}${extension}`;
        await ftpHandler.upload(fileData, fileKey);

        const message = {
          fileKey,
          imageId: taskId
        };
      
        await producer.sendMessage(message);

        return {
          taskId,
          status: TaskStatusEnum.PENDING
        }
      } catch (error: unknown) {
        console.error('Error uploading image:', error);

        if (error instanceof UploadFileError) {
          console.error('Removing task from database, taskId:', taskId);
          await imageCommandRepository.deleteTask(taskId)          
        }
        
        throw new StartTaskError();
      }
    }
  }
}
