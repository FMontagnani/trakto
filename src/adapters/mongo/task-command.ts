import { Db } from 'mongodb';
import { TaskCommand } from '@ports/output/TaskCommand';
import { TaskImageSchemaWithId } from '../../types';
import { parseToDocument } from './utils';

export function taskCommandFactory(db: Db): TaskCommand {
  return {
    async createTask(task: TaskImageSchemaWithId) {
      await db.collection('tasks').insertOne(parseToDocument<TaskImageSchemaWithId>(task))
    },
    async updateTask(taskId, task) {
      await db.collection('tasks').updateOne(parseToDocument<TaskImageSchemaWithId>({ id: taskId }), { $set: task });
    },
    async deleteTask(taskId) {
      await db.collection('tasks').deleteOne(parseToDocument<TaskImageSchemaWithId>({ id: taskId }));
    }
  }
}
