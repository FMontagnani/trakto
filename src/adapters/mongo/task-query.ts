import { Db } from 'mongodb';
import { TaskQuery } from '@ports/output/TaskQuery';
import { TaskImageSchema, TaskImageSchemaWithId } from '../../types';
import { parseToDocument, parseToSchema } from './utils';

export function taskQueryFactory(db: Db): TaskQuery {
  return {
    async getTaskById(taskId: string, fields?: (keyof TaskImageSchema)[]): Promise<TaskImageSchemaWithId | null> {
      const query = parseToDocument<TaskImageSchemaWithId>({ id: taskId })

      const task = await db.collection('tasks').findOne(query, { projection: fields });

      return task ? parseToSchema<TaskImageSchema>(task) : null;
    }
  }
}
