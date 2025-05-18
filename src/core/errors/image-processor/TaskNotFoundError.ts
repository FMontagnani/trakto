export class TaskNotFoundError extends Error {
  constructor(taskId: string) {
    super(`Task with ID ${taskId} not found`);
    this.name = "TaskNotFoundError";
  }
}
