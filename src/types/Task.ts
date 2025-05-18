export const TaskStatusEnum = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type TaskStatus = (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum];

export interface TaskStatusResult {
  status: TaskStatus;
}

export type UploadTaskResult = {
  taskId: string;
} & TaskStatusResult;