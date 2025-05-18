import { TaskStatusResult, UploadTaskResult } from "../../types";

export interface ImageTaskProcessingCommand {
  execute: (fileData: Buffer, fileName: string) => Promise<UploadTaskResult>
}

export interface GetImageTaskStatusCommand {
  execute: (taskId: string) => Promise<TaskStatusResult>
}