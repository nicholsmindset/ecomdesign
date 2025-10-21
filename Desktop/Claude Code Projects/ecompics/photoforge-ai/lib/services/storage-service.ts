import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class StorageService {
  private s3Client: S3Client
  private bucket: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    })

    this.bucket = process.env.AWS_S3_BUCKET || ''

    if (!this.bucket) {
      throw new Error('AWS_S3_BUCKET environment variable is not set')
    }
  }

  /**
   * Upload a buffer to S3
   */
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })

    await this.s3Client.send(command)

    // Return the public URL
    return `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    file: File,
    key: string
  ): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer())
    return this.uploadBuffer(buffer, key, file.type)
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    await this.s3Client.send(command)
  }

  /**
   * Delete multiple files from S3
   */
  async deleteFiles(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.deleteFile(key)))
  }

  /**
   * Generate a presigned URL for temporary access
   */
  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    return await getSignedUrl(this.s3Client, command, { expiresIn })
  }

  /**
   * Extract S3 key from URL
   */
  extractKeyFromUrl(url: string): string {
    const match = url.match(/\.amazonaws\.com\/(.+)$/)
    return match ? match[1] : url
  }

  /**
   * Upload multiple files in parallel
   */
  async uploadFiles(files: Array<{ buffer: Buffer; key: string; contentType: string }>): Promise<string[]> {
    const uploadPromises = files.map(file =>
      this.uploadBuffer(file.buffer, file.key, file.contentType)
    )

    return await Promise.all(uploadPromises)
  }
}
