import { ImageQuality } from "./Image"
import { TaskStatus } from "./Task"

export type TaskImageSchemaWithId = Partial<TaskImageSchema> & Pick<TaskImageSchema, 'id'>

export interface TaskImageSchema {
  id: string
  original_filename: string
  status: TaskStatus
  original_metadata?: {
    width: number
    height: number
    mimetype: string
    exif: EXIF
  }
  processed_at: Date
  error_message?: string
  versions?: {
    filename: string
    dimensions: {
      width: number
      height: number
    }
    quality: ImageQuality
  }[]
}

export interface EXIF {
  manufacturer?: string         // Camera manufacturer
  model?: string                // Camera model
  orientation?: number          // Orientation of the image
  xResolution?: number          // Horizontal resolution
  yResolution?: number          // Vertical resolution
  resolutionUnit?: number       // Unit of resolution
  software?: string             // Software used
  dateTime?: string             // Date and time of image creation
  exposureTime?: number         // Exposure time in seconds
  fNumber?: number              // F-number
  isoSpeedRatings?: number      // ISO speed
  shutterSpeedValue?: number    // Shutter speed
  apertureValue?: number        // Aperture
  brightnessValue?: number      // Brightness
  exposureBiasValue?: number    // Exposure bias
  maxApertureValue?: number     // Maximum aperture value
  subjectDistance?: number      // Subject distance
  flash?: number                // Flash status
  focalLength?: number          // Focal length
  gpsLatitude?: number          // GPS latitude
  gpsLongitude?: number         // GPS longitude
  gpsAltitude?: number          // GPS altitude
  [key: string]: unknown        // Allow for other EXIF properties
}
