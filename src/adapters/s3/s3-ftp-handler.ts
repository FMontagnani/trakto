import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { UploadFileError } from "@core/errors/ftp-errors/UploadFileError"
import { FTPHandler } from "@ports/output/FTPHandler"
import { Config } from '@config/environment';

let client: S3Client
let Bucket: string 

export const s3FtpBuilder = (config: Config): FTPHandler => {
  console.log(config.aws.s3.endpoint)
  console.log(config.aws.s3.bucket)
  if (!client) {
    client = new S3Client({
      region: config.aws.region,
      endpoint: config.aws.s3.endpoint,
      credentials: config.aws.s3.credentials,
      forcePathStyle: true
    })
    Bucket = config.aws.s3.bucket
  }

  return {
    upload: async (file: Buffer, fileName: string) => {
      try {
        await client.send(new PutObjectCommand({
          Bucket,
          Key: fileName,
          Body: file
        }))
      } catch (err: unknown) {
        throw new UploadFileError((err as Error).message)
      }
    },
    download: async (fileName: string) => {
      const response = await client.send(new GetObjectCommand({
        Bucket,
        Key: fileName
      }))

      if (!response.Body) return Buffer.from([])

      const byteArray = await response.Body.transformToByteArray()

      return Buffer.from(byteArray)
    },
    delete: async (fileName: string) => {
      await client.send(new DeleteObjectCommand({
        Bucket,
        Key: fileName
      }))
    },
    listFiles: async () => {
      const response = await client.send(new ListObjectsV2Command({
        Bucket
      }))

      if (!response.Contents) return []
      
      return response.Contents?.map(item => item.Key) as string[]
    }
  }
}
