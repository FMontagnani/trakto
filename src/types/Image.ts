import { EXIF } from './TaskImageSchema';

export const ImageQualityEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH_OPTIMIZED: 'high_optimized',
} as const;

export const ImageQualityDimensionsEnum = {
  [ImageQualityEnum.LOW]: 320,
  [ImageQualityEnum.MEDIUM]: 800,
  [ImageQualityEnum.HIGH_OPTIMIZED]: null
}

export type ImageQuality = (typeof ImageQualityEnum)[keyof typeof ImageQualityEnum];

export interface ImageVersion {
  filename: string
  dimensions: {
    width: number
    height: number
  }
  quality: ImageQuality
  size: number
}

export interface ImageOptimizerResponse {
  image: Buffer
  version: ImageVersion
  metadata: {
    width: number
    height: number
    size: number
    exif?: EXIF
  }
}

export interface ImageProcessorService {
  getProcessedImage(image: Buffer, imageId: string, quality: ImageQuality): Promise<ImageOptimizerResponse>
}
