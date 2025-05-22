import { TaskStatusResult, UploadTaskResult } from '../../types';

export interface ImageTaskProcessingCommand {
  execute: (fileData: Buffer, fileName: string, mimetype: string) => Promise<UploadTaskResult>
}

export interface GetImageTaskStatusCommand {
  execute: (taskId: string) => Promise<TaskStatusResult>
}

export interface SendImageProcessingMessageCommand {
  execute: (fileKey: string, imageId: string) => Promise<void>
}
