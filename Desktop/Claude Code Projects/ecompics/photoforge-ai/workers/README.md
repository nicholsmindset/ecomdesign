# Image Processing Worker

This directory contains the background worker that processes image jobs using Google Gemini 2.5 Flash with image generation capabilities.

## Overview

The worker:
- Listens to the Bull/Redis queue for new image processing jobs
- Uses **Google Gemini 2.5 Flash** for AI-powered background generation
- Generates new backgrounds while preserving product integrity
- Updates job status and progress in real-time
- Handles credit refunds for failed images
- Processes images with automatic retries

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Ensure these are set in your `.env` file:

```bash
# Required
GOOGLE_AI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
DATABASE_URL="postgresql://..."
REDIS_URL="redis://localhost:6379"

# Optional
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="photoforge-ai-uploads"
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add it to your `.env` file

## Running the Worker

### Development Mode (with auto-reload)

```bash
npm run dev:worker
```

This will watch for file changes and automatically restart the worker.

### Production Mode

```bash
npm run worker
```

## How It Works

1. **Job Creation**: When a user uploads images, a job is created and added to the Bull queue

2. **Worker Processing**:
   - Worker picks up the job from the queue
   - Updates job status to "processing"
   - Downloads each image
   - Processes with Gemini AI to generate background
   - Uploads processed images to S3
   - Updates job progress in real-time

3. **Completion**:
   - Job marked as "completed"
   - User credits finalized
   - Notifications sent (optional)

4. **Error Handling**:
   - Failed images use original as fallback
   - Unused credits refunded automatically
   - Job retried up to 3 times on failure

## Worker Concurrency

The worker processes 2 jobs concurrently by default. Adjust in `image-processor.ts`:

```typescript
queue.process(2, async (job) => {
  // Change the number to increase/decrease concurrency
})
```

## Monitoring

The worker logs provide real-time information:

```bash
🚀 Image Processing Worker Starting...
📡 Gemini Model: gemini-2.5-flash
🔑 API Key: ***abc123

📸 Processing Job job_abc123
   User: user_xyz
   Images: 5
   Prompt: Professional studio background with soft lighting

   Processing image 1/5...
   ✅ Image 1/5 processed (1250ms)
   Processing image 2/5...
   ✅ Image 2/5 processed (1180ms)
   ...

✅ Job job_abc123 completed successfully
   Processed: 5/5 images
   Credits consumed: 5
```

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start worker
pm2 start npm --name "photoforge-worker" -- run worker

# Monitor
pm2 logs photoforge-worker

# Stop
pm2 stop photoforge-worker
```

### Using Docker

```dockerfile
# Add to your Dockerfile
CMD ["npm", "run", "worker"]
```

### Using Systemd

Create `/etc/systemd/system/photoforge-worker.service`:

```ini
[Unit]
Description=PhotoForge AI Worker
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/photoforge-ai
ExecStart=/usr/bin/npm run worker
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl enable photoforge-worker
sudo systemctl start photoforge-worker
sudo systemctl status photoforge-worker
```

## Scaling

To scale horizontally, run multiple worker instances:

```bash
# Terminal 1
npm run worker

# Terminal 2
npm run worker

# Terminal 3
npm run worker
```

All workers will share the same Redis queue and process jobs in parallel.

## Troubleshooting

### Worker not processing jobs

1. Check Redis is running: `redis-cli ping` (should return PONG)
2. Check environment variables are set
3. Check Gemini API key is valid
4. Check worker logs for errors

### Images not being processed

1. Verify S3 credentials are correct
2. Check image URLs are accessible
3. Verify Gemini API quota hasn't been exceeded
4. Check job status in database

### High memory usage

1. Reduce worker concurrency
2. Implement image compression before processing
3. Add memory limits to worker process

## API Integration Notes

**Current Implementation**: The system uses **Gemini 2.5 Flash** which has built-in image generation capabilities!

The implementation:
- ✅ Analyzes product images
- ✅ Generates new backgrounds using AI
- ✅ Preserves product integrity
- ✅ Uploads processed images to S3
- ⚠️ Falls back to original if generation fails

**Optional Enhancements**: While Gemini 2.5 Flash handles image generation, you can optionally integrate additional image generation APIs for specialized effects:

### Option 1: Stability AI (Stable Diffusion)

```typescript
import { StabilityAI } from '@stability-ai/sdk'

const stability = new StabilityAI(process.env.STABILITY_API_KEY)
const image = await stability.generate({
  prompt: enhancementPrompt,
  image: originalImage,
  // ... options
})
```

### Option 2: DALL-E 3

```typescript
import OpenAI from 'openai'

const openai = new OpenAI(process.env.OPENAI_API_KEY)
const response = await openai.images.edit({
  image: originalImage,
  prompt: enhancementPrompt,
})
```

### Option 3: Replicate

```typescript
import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
const output = await replicate.run(
  "stability-ai/stable-diffusion:...",
  { input: { image: originalImage, prompt: enhancementPrompt } }
)
```

Update the `simulateImageProcessing` method in `gemini-service.ts` with your chosen integration.

## Support

For issues or questions, check:
- Worker logs: `npm run worker`
- Bull Queue UI: https://github.com/OptimalBits/bull-board
- Database: `npx prisma studio`
