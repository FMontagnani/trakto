import sharp from 'sharp';
import exifReader from 'exif-reader';
import {
  ImageOptimizerResponse,
  ImageProcessorService,
  ImageQuality,
  ImageQualityDimensionsEnum,
  ImageVersion
} from '../../types'

const optimizeImage = async (inputPath: Buffer, quality: number) => {
  return sharp(inputPath).resize({ width: quality, withoutEnlargement: true })
};

const SharpProcessorService: ImageProcessorService = {
  async getProcessedImage(image: Buffer, imageId: string, quality: ImageQuality): Promise<ImageOptimizerResponse> {
    const optimizedImage = await optimizeImage(image, ImageQualityDimensionsEnum.low);

    const metadata = await optimizedImage.metadata();
    const resultImage = await optimizedImage.toBuffer();

    const newMetadata = await sharp(resultImage).metadata()

    const version: ImageVersion = {
      filename: `${quality}_${imageId}`,
      dimensions: {
        width: ImageQualityDimensionsEnum[quality] ?? metadata.width ?? 0,
        height: newMetadata.height ?? 0
      },
      quality,
      size: newMetadata.size ?? 0
    }

    return {
      image: resultImage,
      version,
      metadata: {
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        size: metadata.size ?? 0,
        exif: metadata.exif ? exifReader(metadata.exif) : {}
      }
    }
  }
}

export default SharpProcessorService;