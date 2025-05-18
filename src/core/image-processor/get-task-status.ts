import { TaskNotFoundError } from "@core/errors/image-processor/TaskNotFoundError";
import { GetImageTaskStatusCommand } from "@ports/input/TaskProcessing"
import { TaskQuery } from "@ports/output/TaskQuery";
import { TaskStatusResult } from "../../types";

export function getTaskStatusBuilder(imageQueryRepository: TaskQuery): GetImageTaskStatusCommand  {
  return {
    async execute(taskId: string): Promise<TaskStatusResult> {   
      const task = await imageQueryRepository.getTaskById(taskId, ['status']);
      
      if (!task) {
        console.log('!task', task)
        throw new TaskNotFoundError(taskId);
      }

      return {
        status: task.status
      }  as TaskStatusResult
    }
  }
}
