import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { StorageService } from './storage-service'
import axios from 'axios'

export interface ImageProcessingOptions {
  backgroundPrompt: string
  modelType?: 'realistic' | 'artistic' | 'minimalist' | 'dramatic'
  sceneStyle?: string
}

export interface ProcessedImage {
  originalUrl: string
  processedUrl: string
  processingTimeMs: number
  status: 'success' | 'fallback' | 'error'
  message?: string
}

export class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel
  private storageService: StorageService

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)

    // Use Gemini 2.5 Flash for image generation
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    this.model = this.genAI.getGenerativeModel({ model: modelName })

    this.storageService = new StorageService()
  }

  /**
   * Process a single image with AI background generation using Gemini 2.5 Flash
   */
  async processImage(
    imageUrl: string,
    options: ImageProcessingOptions
  ): Promise<ProcessedImage> {
    const startTime = Date.now()

    try {
      // Download the image
      const imageBuffer = await this.downloadImage(imageUrl)

      // Convert to base64 for Gemini
      const base64Image = imageBuffer.toString('base64')

      // Build the prompt for background generation
      const prompt = this.buildImageGenerationPrompt(options)

      console.log('Processing with Gemini 2.5 Flash...')
      console.log('Prompt:', prompt.substring(0, 150) + '...')

      // Generate with Gemini 2.5 Flash Image model
      const result = await this.model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: this.getMimeType(imageUrl),
          },
        },
        prompt,
      ])

      const response = await result.response

      // Check if the response contains generated image
      // Note: The actual response format may vary - adjust based on API response
      const candidates = response.candidates || []

      if (candidates.length > 0 && candidates[0].content.parts) {
        // Look for inline data in the response (generated image)
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            // We got a generated image!
            console.log('✓ Successfully generated image with Gemini 2.5 Flash')
            const generatedImageBuffer = Buffer.from(part.inlineData.data, 'base64')

            // Upload to S3
            const processedImageUrl = await this.uploadProcessedImage(
              generatedImageBuffer,
              imageUrl,
              part.inlineData.mimeType || 'image/jpeg'
            )

            const processingTimeMs = Date.now() - startTime

            return {
              originalUrl: imageUrl,
              processedUrl: processedImageUrl,
              processingTimeMs,
              status: 'success',
              message: 'Image successfully processed by Gemini 2.5 Flash',
            }
          }
        }
      }

      // If no image was generated, log response for debugging
      const generatedText = response.text()
      console.warn('⚠ Gemini did not return an image. Response:', generatedText.substring(0, 300))
      console.warn('⚠ Using original image as fallback')

      const processingTimeMs = Date.now() - startTime

      // Return fallback with clear status
      return {
        originalUrl: imageUrl,
        processedUrl: imageUrl, // Fallback to original
        processingTimeMs,
        status: 'fallback',
        message: 'Gemini returned text instead of image - using original image as fallback',
      }
    } catch (error) {
      console.error('✗ Error processing image with Gemini:', error)

      const processingTimeMs = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Return error status instead of throwing - allows job to complete with some images
      return {
        originalUrl: imageUrl,
        processedUrl: imageUrl, // Fallback to original on error
        processingTimeMs,
        status: 'error',
        message: `Processing failed: ${errorMessage}`,
      }
    }
  }

  /**
   * Process multiple images in batch
   */
  async processImages(
    imageUrls: string[],
    options: ImageProcessingOptions,
    onProgress?: (progress: number, currentImage: number) => void
  ): Promise<ProcessedImage[]> {
    const results: ProcessedImage[] = []
    const totalImages = imageUrls.length

    console.log(`Starting batch processing of ${totalImages} images...`)

    for (let i = 0; i < totalImages; i++) {
      console.log(`Processing image ${i + 1}/${totalImages}...`)

      const result = await this.processImage(imageUrls[i], options)
      results.push(result)

      // Log result status
      if (result.status === 'success') {
        console.log(`✓ Image ${i + 1}/${totalImages} processed successfully`)
      } else if (result.status === 'fallback') {
        console.warn(`⚠ Image ${i + 1}/${totalImages} using fallback: ${result.message}`)
      } else {
        console.error(`✗ Image ${i + 1}/${totalImages} failed: ${result.message}`)
      }

      if (onProgress) {
        const progress = Math.round(((i + 1) / totalImages) * 100)
        onProgress(progress, i + 1)
      }
    }

    // Log batch summary
    const successCount = results.filter((r) => r.status === 'success').length
    const fallbackCount = results.filter((r) => r.status === 'fallback').length
    const errorCount = results.filter((r) => r.status === 'error').length

    console.log(`\nBatch Processing Summary:`)
    console.log(`  ✓ Success: ${successCount}/${totalImages}`)
    console.log(`  ⚠ Fallback: ${fallbackCount}/${totalImages}`)
    console.log(`  ✗ Error: ${errorCount}/${totalImages}`)

    return results
  }

  /**
   * Build the image generation prompt for Gemini 2.5 Flash
   */
  private buildImageGenerationPrompt(options: ImageProcessingOptions): string {
    const { backgroundPrompt, modelType = 'realistic', sceneStyle } = options

    let prompt = `Transform this product image by replacing its background while keeping the product perfectly intact.

Product Background Request: ${backgroundPrompt}

Requirements:
- Photography Style: ${modelType}
${sceneStyle ? `- Scene Style: ${sceneStyle}` : ''}
- Keep the product completely unchanged (no modifications to the product itself)
- Replace ONLY the background
- Maintain professional ${modelType} photography quality
- Ensure proper lighting that matches the new background
- Keep the product in sharp focus
- Make it look like a professional studio photograph

Generate a high-quality image with the new background that looks natural and professionally photographed.`

    return prompt
  }

  /**
   * Download image from URL
   */
  private async downloadImage(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 seconds timeout
      })

      return Buffer.from(response.data)
    } catch (error) {
      throw new Error(`Failed to download image from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get MIME type from image URL
   */
  private getMimeType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()

    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
    }

    return mimeTypes[extension || 'jpg'] || 'image/jpeg'
  }

  /**
   * Upload processed image to S3
   */
  private async uploadProcessedImage(
    imageBuffer: Buffer,
    originalUrl: string,
    mimeType: string
  ): Promise<string> {
    try {
      // Generate unique filename for processed image
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const extension = mimeType.split('/')[1] || 'jpg'
      const filename = `processed/${timestamp}_${randomString}.${extension}`

      // Upload to S3
      const uploadedUrl = await this.storageService.uploadBuffer(
        imageBuffer,
        filename,
        mimeType
      )

      console.log('Processed image uploaded:', uploadedUrl)

      return uploadedUrl
    } catch (error) {
      console.error('Failed to upload processed image:', error)
      throw new Error(`Failed to upload processed image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get model information
   */
  getModelInfo(): { name: string; apiKey: string } {
    return {
      name: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_AI_API_KEY ? '***' + process.env.GOOGLE_AI_API_KEY.slice(-4) : 'not set',
    }
  }
}
