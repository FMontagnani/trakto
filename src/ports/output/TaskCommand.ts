import { TaskImageSchema, TaskImageSchemaWithId } from "../../types";

export interface TaskCommand {
  createTask(task: TaskImageSchemaWithId): Promise<void>;
  updateTask(taskId: string, task: Partial<TaskImageSchema>): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}