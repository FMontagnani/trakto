export class ImageNotFoundError extends Error {
  constructor(imageId: string) {
    super(`Image with ID ${imageId} not found`);
    this.name = 'ImageNotFoundError';
  }
}
