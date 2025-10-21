/**
 * Email Notification Service
 *
 * Handles sending transactional emails to users for various events
 */

import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface JobCompletedEmailOptions {
  email: string
  jobId: string
  totalImages: number
  successfulImages: number
  failedImages: number
  jobUrl: string
}

export class EmailService {
  private transporter: Transporter | null = null
  private enabled: boolean = false

  constructor() {
    // Only initialize if SMTP credentials are provided
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
    ) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      this.enabled = true
      console.log('📧 Email service initialized')
    } else {
      console.warn('⚠️  Email service not configured - emails will not be sent')
      console.warn('   Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD to enable email notifications')
    }
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.enabled || !this.transporter) {
      console.log(`📧 [SKIPPED] Email to ${options.to}: ${options.subject}`)
      return false
    }

    try {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER

      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      console.log(`✅ Email sent to ${options.to}: ${options.subject}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to send email to ${options.to}:`, error)
      return false
    }
  }

  /**
   * Send job completed notification
   */
  async sendJobCompletedEmail(options: JobCompletedEmailOptions): Promise<boolean> {
    const { email, jobId, totalImages, successfulImages, failedImages, jobUrl } = options

    const appName = 'PhotoForge AI'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const subject = failedImages > 0
      ? `⚠️ Job Completed with Some Issues - ${successfulImages}/${totalImages} Images Processed`
      : `✅ Job Completed - ${successfulImages} Images Processed`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Your Image Processing Job is Complete!</h2>

    <div style="background: ${failedImages > 0 ? '#fff3cd' : '#d4edda'}; border-left: 4px solid ${failedImages > 0 ? '#ffc107' : '#28a745'}; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: ${failedImages > 0 ? '#856404' : '#155724'};">
        ${failedImages > 0 ? '⚠️ Completed with some issues' : '✅ Successfully completed'}
      </p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #495057;">Job Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6c757d;">Job ID:</td>
          <td style="padding: 8px 0; font-weight: bold;">${jobId.substring(0, 8)}...</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d;">Total Images:</td>
          <td style="padding: 8px 0; font-weight: bold;">${totalImages}</td>
        </tr>
        <tr style="background: #e7f5ff;">
          <td style="padding: 8px 0; color: #6c757d;">✅ Successfully Processed:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #28a745;">${successfulImages}</td>
        </tr>
        ${failedImages > 0 ? `
        <tr style="background: #fff3cd;">
          <td style="padding: 8px 0; color: #6c757d;">❌ Failed/Fallback:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #dc3545;">${failedImages}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${failedImages > 0 ? `
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #856404;">
        <strong>Note:</strong> Some images could not be processed and were returned as originals. You were only charged for successfully processed images (${successfulImages} credits).
      </p>
    </div>
    ` : ''}

    <div style="text-align: center; margin: 30px 0;">
      <a href="${jobUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        View Your Results
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">
      <strong>What's Next?</strong>
    </p>
    <ul style="color: #6c757d; font-size: 14px;">
      <li>Download your processed images from the job details page</li>
      <li>Review the results and provide feedback</li>
      <li>Process more images if needed</li>
    </ul>

    <div style="background: #f8f9fa; padding: 15px; margin-top: 20px; border-radius: 4px; text-align: center;">
      <p style="margin: 0; color: #6c757d; font-size: 12px;">
        Need help? <a href="${appUrl}/contact" style="color: #667eea;">Contact Support</a> |
        <a href="${appUrl}/dashboard" style="color: #667eea;">Dashboard</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
    <p style="margin: 5px 0;">
      <a href="${appUrl}/terms" style="color: #667eea; text-decoration: none;">Terms</a> |
      <a href="${appUrl}/privacy" style="color: #667eea; text-decoration: none;">Privacy</a>
    </p>
  </div>
</body>
</html>
    `

    const text = `
${appName} - Job Completed

${failedImages > 0 ? '⚠️ Completed with some issues' : '✅ Successfully completed'}

Job Summary:
- Job ID: ${jobId}
- Total Images: ${totalImages}
- Successfully Processed: ${successfulImages}
${failedImages > 0 ? `- Failed/Fallback: ${failedImages}` : ''}

${failedImages > 0 ? `Note: You were only charged for successfully processed images (${successfulImages} credits).\n` : ''}

View your results: ${jobUrl}

Need help? Contact us at ${appUrl}/contact

© ${new Date().getFullYear()} ${appName}
    `

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    })
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const appName = 'PhotoForge AI'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to ${appName}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Welcome to ${appName}!</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2>Hi ${name},</h2>
    <p>Thank you for joining ${appName}! We're excited to help you transform your product images with AI-powered backgrounds.</p>

    <p><strong>Your free credits are ready!</strong> You have 5 free credits to get started.</p>

    <h3>Quick Start Guide:</h3>
    <ol>
      <li>Upload your product images</li>
      <li>Describe the background you want</li>
      <li>Let our AI do the magic</li>
      <li>Download your professional images</li>
    </ol>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/upload" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Start Processing Images
      </a>
    </div>

    <p style="color: #6c757d; font-size: 14px;">
      Need more credits? Check out our <a href="${appUrl}/pricing" style="color: #667eea;">pricing plans</a>.
    </p>
  </div>
</body>
</html>
    `

    return await this.sendEmail({
      to: email,
      subject: `Welcome to ${appName}!`,
      html,
    })
  }

  /**
   * Check if email service is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }
}

// Export singleton instance
export const emailService = new EmailService()
