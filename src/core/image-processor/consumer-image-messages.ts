import { FTPHandler } from '@ports/output/FTPHandler';
import { ImageProcessorService } from '../../types';
import { TaskCommand } from '@ports/output/TaskCommand';
import { TaskStatusEnum } from '../../types';
import { ImageNotFoundError } from '../errors/image-processor/ImageNotFoundError';
import { ImageProcessingError } from '../errors/image-processor/ImageProcessingError';

export function consumeImageProcessorBuilder(ftpHandler: FTPHandler, imageCommandRepository: TaskCommand, imageService: ImageProcessorService) {
  return {
    async execute(imagePath: string, imageId: string): Promise<void> {
      try {
        const imageFile = await ftpHandler.download(imagePath);
            
        if (!imageFile) {
          throw new ImageNotFoundError(imageId);
        }

        const [low, medium, high] = await Promise.all([
          imageService.getProcessedImage(imageFile, imagePath, 'low'),
          imageService.getProcessedImage(imageFile, imagePath, 'medium'),
          imageService.getProcessedImage(imageFile, imagePath, 'high_optimized')
        ]);
                
        await imageCommandRepository.updateTask(imageId, {
          status: TaskStatusEnum.COMPLETED,
          versions: [low.version, medium.version, high.version],
          'original_metadata.width': high.metadata.width,
          'original_metadata.height': high.metadata.height,
          'original_metadata.exif': high.metadata.exif,
          processed_at: new Date(),
        })
               
        await Promise.all([
          ftpHandler.upload(low.image, low.version.filename),
          ftpHandler.upload(medium.image, medium.version.filename),
          ftpHandler.upload(high.image, high.version.filename),
        ])

        await ftpHandler.delete(imagePath)

      } catch (err: unknown) {
        if (err instanceof ImageNotFoundError) {
          console.error(err?.message)

          await imageCommandRepository.updateTask(imagePath, {
            status: TaskStatusEnum.FAILED,
            error_message: err.message,
            processed_at: new Date()
          })
        }

        throw new ImageProcessingError()
      }
    }
  }
};
