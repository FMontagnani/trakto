import { Request, Response } from 'express';
import { GetImageTaskStatusCommand, ImageTaskProcessingCommand } from '@ports/input/TaskProcessing';

export const uploadImageBuilder = (command: ImageTaskProcessingCommand) => async function uploadImage(req: Request, res: Response) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await command.execute(file.buffer, file.originalname);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

export const getImageTaskStatusBuilder = (command: GetImageTaskStatusCommand) => async function getImageTaskStatus(req: Request, res: Response) {
  try {
    const taskId = req.params.taskId;

    if (!taskId) {
      return res.status(400).json({ message: 'No task ID provided' });
    }

    const result = await command.execute(taskId)

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}