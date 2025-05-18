import Task from "@core/entities/task";
import { UploadFileError } from "@core/errors/ftp-errors/UploadFileError";
import { StartTaskError } from "@core/errors/image-processor/StartTaskError";
import { ImageTaskProcessingCommand } from "@ports/input/TaskProcessing"
import { FTPHandler } from "@ports/output/FTPHandler";
import { TaskCommand } from "@ports/output/TaskCommand";
import { UploadTaskResult, TaskStatusEnum } from "../../types";

export function imageProcessorBuilder(imageCommandRepository: TaskCommand, ftpHandler: FTPHandler): ImageTaskProcessingCommand  {
  return {
    async execute(fileData: Buffer, fileName: string): Promise<UploadTaskResult> {
      const taskId = Task.generateTaskId();
      
      try {
        await imageCommandRepository.createTask({ id: taskId, status: TaskStatusEnum.PENDING, original_filename: fileName });
        await ftpHandler.upload(fileData, taskId)
        
        return {
          taskId,
          status: TaskStatusEnum.PENDING
        }
      } catch (error: unknown) {
        console.error("Error uploading image:", error);

        if (error instanceof UploadFileError) {
          console.error("Removing task from database, taskId:", taskId);
          await imageCommandRepository.deleteTask(taskId)          
        }
        
        throw new StartTaskError();
      }
    }
  }
}
