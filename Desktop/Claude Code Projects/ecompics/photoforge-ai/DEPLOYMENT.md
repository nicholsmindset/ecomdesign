# PhotoForge AI - Production Deployment Guide

This guide covers all steps required to deploy PhotoForge AI to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [External Services Configuration](#external-services-configuration)
6. [Application Deployment](#application-deployment)
7. [Worker Deployment](#worker-deployment)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Domain name registered and DNS access
- [ ] Hosting platform account (Vercel recommended, or AWS/DigitalOcean)
- [ ] Credit card for service subscriptions
- [ ] Access to create accounts for required services:
  - PostgreSQL database (Neon, Supabase, or Railway)
  - Redis instance (Upstash or Redis Cloud)
  - AWS account (for S3)
  - Stripe account
  - Google Cloud account (for Gemini API)
  - Email service (optional: Gmail, SendGrid, or AWS SES)

---

## Infrastructure Setup

### 1. PostgreSQL Database

**Option A: Neon (Recommended - Serverless)**
1. Sign up at https://neon.tech
2. Create new project: `photoforge-ai-prod`
3. Copy connection string (format: `postgresql://user:pass@host/dbname?sslmode=require`)
4. Enable connection pooling for better performance

**Option B: Supabase**
1. Sign up at https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy "Connection string" (Transaction mode)

**Option C: Railway**
1. Sign up at https://railway.app
2. New Project > Add PostgreSQL
3. Copy `DATABASE_URL` from Variables tab

### 2. Redis Instance

**Option A: Upstash (Recommended - Serverless)**
1. Sign up at https://upstash.com
2. Create Redis database
3. Select region closest to your hosting
4. Copy `UPSTASH_REDIS_REST_URL`
5. Format: `redis://:password@host:port`

**Option B: Redis Cloud**
1. Sign up at https://redis.com/try-free
2. Create subscription (Free tier: 30MB)
3. Copy connection string

---

## Environment Configuration

### Required Environment Variables

Create `.env.production` or configure in your hosting platform:

```bash
# === REQUIRED VARIABLES ===

# Database
DATABASE_URL="postgresql://user:password@host:5432/photoforge?sslmode=require"

# Application URLs
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"

# NextAuth Secret (CRITICAL - generate new for production)
# Generate: openssl rand -base64 32
NEXTAUTH_SECRET="generate-a-new-secret-key-for-production-minimum-32-chars"

# AWS S3 (for image storage)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="photoforge-prod-uploads"

# Redis (for job queue)
REDIS_URL="redis://:password@host:port"

# Stripe (PRODUCTION KEYS - NOT TEST KEYS)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Product Price IDs (create in Stripe Dashboard)
STRIPE_STARTER_PRICE_ID="price_1..."
STRIPE_PROFESSIONAL_PRICE_ID="price_1..."
STRIPE_ENTERPRISE_PRICE_ID="price_1..."
STRIPE_ALA_CARTE_50_PRICE_ID="price_1..."
STRIPE_ALA_CARTE_100_PRICE_ID="price_1..."
STRIPE_ALA_CARTE_500_PRICE_ID="price_1..."

# Google Gemini AI (REQUIRED for image processing)
GOOGLE_AI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"

# Cron Secret (for protected endpoints)
# Generate: openssl rand -hex 32
CRON_SECRET="generate-random-string-for-cron-protection"

# === OPTIONAL BUT RECOMMENDED ===

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
SMTP_FROM="PhotoForge AI <noreply@yourdomain.com>"

# Google OAuth (for social login)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."

# Sentry (error tracking - highly recommended)
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="photoforge-ai"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# Rate Limiting (adjust based on your needs)
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="60000"
```

---

## Database Setup

### 1. Run Migrations

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Deploy migrations to production database
npx prisma migrate deploy

# Verify database schema
npx prisma db pull
```

### 2. Seed Initial Data (Optional)

If you have a seed script:
```bash
npm run db:seed
```

### 3. Enable Connection Pooling

For Prisma with serverless:
```bash
# Add to DATABASE_URL
?pgbouncer=true&connection_limit=1
```

---

## External Services Configuration

### 1. AWS S3 Setup

```bash
# 1. Create S3 bucket
aws s3 mb s3://photoforge-prod-uploads --region us-east-1

# 2. Enable CORS
aws s3api put-bucket-cors --bucket photoforge-prod-uploads --cors-configuration file://cors.json
```

**cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

**Bucket Policy (Public Read for processed images):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::photoforge-prod-uploads/processed/*"
    }
  ]
}
```

**Create IAM User:**
1. Go to AWS IAM Console
2. Create user: `photoforge-ai-prod`
3. Attach policy: `AmazonS3FullAccess` (or create custom limited policy)
4. Create access key
5. Save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### 2. Stripe Setup (Production Mode)

**A. Switch to Live Mode**
1. Go to https://dashboard.stripe.com
2. Toggle "Test mode" OFF (top right)
3. Go to Developers > API Keys
4. Copy "Publishable key" and "Secret key"

**B. Create Products & Prices**

```bash
# Use Stripe CLI or Dashboard to create:

# 1. Subscription Plans
- Starter Plan: $29/month → get price_id
- Professional Plan: $99/month → get price_id
- Enterprise Plan: $299/month → get price_id

# 2. One-Time Purchases
- 50 Credits: $19 → get price_id
- 100 Credits: $29 → get price_id
- 500 Credits: $99 → get price_id
```

**C. Set Up Webhook**
1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret (`whsec_...`)

### 3. Google Gemini API Setup

1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Enable billing (required for production usage)
4. Set quota limits (optional but recommended)
5. Copy API key

**Quota Recommendations:**
- Start: 10 requests/minute
- Monitor usage and increase as needed

### 4. Google OAuth Setup (Optional)

1. Go to https://console.cloud.google.com
2. Create new project: `PhotoForge AI`
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret

### 5. Email Service Setup (Optional)

**Option A: Gmail App Password**
1. Enable 2FA on Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password as `SMTP_PASSWORD`

**Option B: SendGrid**
1. Sign up at https://sendgrid.com
2. Create API key
3. Verify sender domain
4. Use SMTP credentials

### 6. Sentry Error Tracking (Recommended)

1. Sign up at https://sentry.io
2. Create new project: `photoforge-ai`
3. Copy DSN
4. Create auth token for source maps

---

## Application Deployment

### Option A: Vercel (Recommended)

**1. Install Vercel CLI**
```bash
npm i -g vercel
```

**2. Deploy**
```bash
# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production
# ... add all other env vars
```

**3. Configure Project**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x

**4. Add Domain**
- Go to Project Settings > Domains
- Add your custom domain
- Update DNS records as instructed

### Option B: Docker + AWS ECS/Railway

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Deploy:**
```bash
# Build image
docker build -t photoforge-ai .

# Push to registry (ECR, Docker Hub, etc.)
docker tag photoforge-ai:latest your-registry/photoforge-ai:latest
docker push your-registry/photoforge-ai:latest

# Deploy to ECS/Railway/DigitalOcean
```

---

## Worker Deployment

The worker process must run separately from the Next.js app to process image jobs.

### Option A: Separate Vercel Deployment (Not ideal for long-running workers)

### Option B: Railway (Recommended)

1. Create new Railway project
2. Add GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm run worker`
5. Add all environment variables (same as main app)
6. Deploy

### Option C: AWS ECS/Fargate

1. Create task definition for worker
2. Use same Docker image
3. Override CMD: `["npm", "run", "worker"]`
4. Deploy as ECS service (1+ instances)

### Option D: PM2 on VPS

```bash
# Install PM2
npm install -g pm2

# Start worker
pm2 start npm --name "photoforge-worker" -- run worker

# Enable auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs photoforge-worker
```

### Worker Scaling Recommendations

- **Start**: 1 worker instance
- **Scale up** when job queue > 100 pending jobs
- **Monitor**: Queue length, processing time, error rate

---

## Post-Deployment Verification

### 1. Health Checks

Test all critical endpoints:

```bash
# API health
curl https://yourdomain.com/api/health

# Database connection
curl https://yourdomain.com/api/health/db

# Redis connection
curl https://yourdomain.com/api/health/redis
```

### 2. User Flow Testing

Complete these flows in production:

- [ ] Sign up with email
- [ ] Sign in with Google OAuth
- [ ] Purchase subscription
- [ ] Purchase à la carte credits
- [ ] Upload images
- [ ] Create processing job
- [ ] Check job progress
- [ ] Download processed images
- [ ] Update profile settings
- [ ] Cancel subscription
- [ ] View billing history

### 3. Webhook Testing

Test Stripe webhook:
```bash
stripe trigger payment_intent.succeeded
```

### 4. Worker Testing

Verify worker is processing jobs:
```bash
# Check Redis queue
redis-cli -u $REDIS_URL
LLEN bull:image-processing:wait
LLEN bull:image-processing:active

# Check logs
pm2 logs photoforge-worker  # if using PM2
vercel logs                  # if using Vercel
railway logs                 # if using Railway
```

---

## Monitoring & Maintenance

### 1. Set Up Monitoring

**Uptime Monitoring:**
- UptimeRobot (free): https://uptimerobot.com
- Monitor: `https://yourdomain.com/api/health`
- Alert on downtime

**Performance Monitoring:**
- Vercel Analytics (automatic if on Vercel)
- Google Analytics
- PostHog (product analytics)

**Error Tracking:**
- Sentry (recommended)
- LogRocket (session replay)

**Database Monitoring:**
- Neon/Supabase built-in dashboards
- Monitor: connections, query performance, disk usage

**Queue Monitoring:**
- Bull Board UI: https://github.com/felixmosh/bull-board
- Monitor: pending jobs, failed jobs, processing rate

### 2. Set Up Alerts

Configure alerts for:
- Application errors (Sentry)
- API downtime (UptimeRobot)
- Database connection issues
- Redis connection issues
- Worker crashes
- Failed Stripe payments
- High job queue length (>500)
- Low credit balance (if using paid APIs)

### 3. Backups

**Database Backups:**
```bash
# Automated (most hosting platforms do this)
# Manual backup:
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore:
psql $DATABASE_URL < backup-20240101.sql
```

**S3 Backups:**
- Enable S3 versioning
- Set lifecycle policies to archive old objects

### 4. Regular Maintenance Tasks

**Weekly:**
- Review error logs (Sentry)
- Check job queue health
- Monitor API costs (Gemini, Stripe)
- Review failed payments

**Monthly:**
- Review database size and optimize
- Audit user activity
- Review and rotate secrets
- Check dependency updates: `npm outdated`

**Quarterly:**
- Security audit
- Performance optimization
- Cost optimization review
- Update dependencies: `npm update`

---

## Security Checklist

Before going live:

- [ ] All production secrets are unique (not from .env.example)
- [ ] NEXTAUTH_SECRET is generated with `openssl rand -base64 32`
- [ ] Stripe webhook secret is configured
- [ ] AWS credentials are for production-only IAM user with limited permissions
- [ ] Database has strong password and SSL enabled
- [ ] Redis has password authentication enabled
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] Environment variables are not committed to git
- [ ] SSL/HTTPS is enforced
- [ ] OAuth redirect URIs are restricted to production domain
- [ ] Sentry is configured to not send sensitive data

---

## Troubleshooting

### Common Issues

**1. Database connection failed**
```bash
# Check connection string format
# Ensure SSL is enabled: ?sslmode=require
# Verify IP allowlist (if using Neon/Supabase)
```

**2. Redis connection failed**
```bash
# Verify REDIS_URL format
# Check Redis instance is running
# Verify firewall rules
```

**3. Stripe webhook not working**
```bash
# Verify webhook URL is correct
# Check webhook secret matches
# Review Stripe logs: https://dashboard.stripe.com/logs
```

**4. Worker not processing jobs**
```bash
# Check worker is running
# Verify Redis connection
# Check worker logs for errors
# Verify GOOGLE_AI_API_KEY is set
```

**5. Images not uploading to S3**
```bash
# Verify AWS credentials
# Check S3 bucket permissions
# Verify CORS configuration
# Check IAM user has S3 access
```

---

## Cost Estimation

**Monthly costs for moderate usage (1000 users, 10k images/month):**

- Vercel Pro: $20
- Database (Neon): $20-50
- Redis (Upstash): $10-30
- S3 Storage: $5-20
- Stripe fees: ~2.9% + $0.30 per transaction
- Gemini API: ~$0.10-0.50 per 1000 images (estimate)
- Email (SendGrid): $0-15
- Sentry: $0 (free tier) - $26

**Total: ~$80-180/month** (excluding transaction fees)

Scale costs as user base grows.

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Stripe Docs**: https://stripe.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Vercel Docs**: https://vercel.com/docs

---

## Rollback Plan

If issues arise after deployment:

```bash
# Vercel
vercel rollback

# Docker
docker pull your-registry/photoforge-ai:previous-tag
docker-compose up -d

# Database
psql $DATABASE_URL < backup-latest.sql
```

---

**Last Updated**: 2025-01-21
**Version**: 1.0.0

