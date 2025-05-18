import { TaskImageSchema } from "../../types";

export interface TaskQuery {
  getTaskById(taskId: string, fields?: (keyof TaskImageSchema)[]): Promise<Partial<TaskImageSchema> | null>;
}