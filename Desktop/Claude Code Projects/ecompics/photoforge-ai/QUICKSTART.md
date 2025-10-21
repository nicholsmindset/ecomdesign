# Quick Start Guide - Going Live in 30 Minutes

This is a rapid deployment guide to get PhotoForge AI live as quickly as possible. For complete documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites

Before starting, have ready:
- Domain name (or use Vercel's free subdomain)
- Credit card for service signups
- 30-45 minutes of focused time

## Step 1: Set Up External Services (15 minutes)

### A. Database - Neon (2 minutes)

1. Go to https://neon.tech
2. Sign up and create project: `photoforge-prod`
3. Copy connection string
   ```
   postgresql://user:pass@host/dbname?sslmode=require
   ```

### B. Redis - Upstash (2 minutes)

1. Go to https://upstash.com
2. Create Redis database
3. Copy connection URL
   ```
   redis://:password@host:port
   ```

### C. AWS S3 (5 minutes)

1. Create S3 bucket: `photoforge-prod-uploads`
2. Enable CORS in bucket settings
3. Create IAM user with S3 access
4. Save Access Key ID and Secret Key

**Quick CORS config:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### D. Stripe (3 minutes)

1. Go to https://dashboard.stripe.com
2. Toggle "Live mode" ON
3. Go to Developers > API Keys
4. Copy Publishable Key and Secret Key
5. Create webhook endpoint (add after deployment): `https://yourdomain.com/api/webhooks/stripe`

### E. Google Gemini (2 minutes)

1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Enable billing if not already enabled

### F. Google OAuth (Optional - 3 minutes)

1. Go to https://console.cloud.google.com
2. Create OAuth credentials
3. Add redirect URI: `https://yourdomain.com/api/auth/callback/google`

## Step 2: Deploy to Vercel (5 minutes)

### Option A: Deploy via Dashboard (Easiest)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 3: Configure Environment Variables (5 minutes)

In Vercel Dashboard > Project > Settings > Environment Variables, add:

```bash
# Required - Database
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# Required - Redis
REDIS_URL=redis://:password@host:port

# Required - App URLs (replace with your domain)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app

# Required - Generate this!
NEXTAUTH_SECRET=run_openssl_rand_base64_32

# Required - AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=photoforge-prod-uploads

# Required - Stripe (LIVE keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (add after setting up webhook)

# Required - Google Gemini
GOOGLE_AI_API_KEY=your-api-key
GEMINI_MODEL=gemini-2.5-flash

# Required - Cron Secret
CRON_SECRET=run_openssl_rand_hex_32

# Optional - Google OAuth
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# Optional - Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=PhotoForge AI <noreply@yourdomain.com>
```

### Generate Secrets Quickly

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -hex 32
```

## Step 4: Run Database Migration (2 minutes)

```bash
# Install dependencies locally
npm install

# Set your DATABASE_URL temporarily
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

## Step 5: Create Stripe Products (3 minutes)

In Stripe Dashboard > Products:

1. **Starter Plan**
   - Name: Starter Plan
   - Price: $29/month recurring
   - Copy price_id → Add as `STRIPE_STARTER_PRICE_ID`

2. **Professional Plan**
   - Name: Professional Plan
   - Price: $99/month recurring
   - Copy price_id → Add as `STRIPE_PROFESSIONAL_PRICE_ID`

3. **Enterprise Plan**
   - Name: Enterprise Plan
   - Price: $299/month recurring
   - Copy price_id → Add as `STRIPE_ENTERPRISE_PRICE_ID`

4. **50 Credits**
   - Name: 50 Credits
   - Price: $19 one-time
   - Copy price_id → Add as `STRIPE_ALA_CARTE_50_PRICE_ID`

5. **100 Credits**
   - Name: 100 Credits
   - Price: $29 one-time
   - Copy price_id → Add as `STRIPE_ALA_CARTE_100_PRICE_ID`

6. **500 Credits**
   - Name: 500 Credits
   - Price: $99 one-time
   - Copy price_id → Add as `STRIPE_ALA_CARTE_500_PRICE_ID`

Add all price IDs to Vercel environment variables and redeploy.

## Step 6: Set Up Stripe Webhook (2 minutes)

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy signing secret
5. Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`
6. Redeploy

## Step 7: Deploy Worker (5 minutes)

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. New Project > Deploy from GitHub
3. Select your repo
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm run worker`
5. Add ALL environment variables (same as Vercel)
6. Deploy

### Option B: Separate Vercel Project

1. Create new Vercel project (same repo)
2. Override build settings:
   - Build Command: `npm install`
   - Output Directory: (leave empty)
3. Add environment variables
4. Not ideal for long-running processes but works for low volume

## Step 8: Configure Domain (Optional - 3 minutes)

1. Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables:
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
   - `NEXTAUTH_URL=https://yourdomain.com`
5. Update Google OAuth redirect URI
6. Update Stripe webhook URL
7. Redeploy

## Step 9: Verify Deployment (5 minutes)

### Health Checks

```bash
# Basic health
curl https://your-domain.vercel.app/api/health

# Database
curl https://your-domain.vercel.app/api/health/db

# Redis
curl https://your-domain.vercel.app/api/health/redis
```

All should return `"status": "healthy"`.

### Test User Flow

1. Sign up with email
2. Sign in with Google
3. Go to /billing
4. Test payment (use Stripe test card: 4242 4242 4242 4242)
5. Upload an image
6. Create a job
7. Wait for processing (check /jobs page)
8. Download processed image

### Test Webhook

```bash
# Use Stripe CLI
stripe listen --forward-to https://your-domain.vercel.app/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

## Step 10: Set Up Monitoring (5 minutes)

### A. Uptime Monitoring (2 minutes)

1. Sign up at https://uptimerobot.com
2. Add monitor: `https://your-domain.vercel.app/api/health`
3. Alert email: your-email@example.com

### B. Error Tracking (3 minutes)

1. Sign up at https://sentry.io
2. Create project: photoforge-ai
3. Copy DSN
4. Add to Vercel environment variables:
   ```
   SENTRY_DSN=https://...@sentry.io/...
   ```
5. Redeploy

## You're Live! 🎉

Your application is now running in production.

## Post-Launch Checklist

- [ ] Test complete user flow
- [ ] Verify Stripe webhooks working
- [ ] Confirm worker processing jobs
- [ ] Check health endpoints
- [ ] Set up monitoring alerts
- [ ] Add your domain to Google OAuth
- [ ] Update Stripe webhook URL
- [ ] Enable Sentry error tracking
- [ ] Share with first users!

## Quick Commands Reference

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# Check health
curl https://your-domain.vercel.app/api/health
```

## Common Issues

**Worker not processing jobs?**
- Check Railway/worker logs
- Verify REDIS_URL is correct
- Ensure GOOGLE_AI_API_KEY is set

**Stripe webhook not working?**
- Verify webhook URL is correct
- Check STRIPE_WEBHOOK_SECRET matches
- Review Stripe webhook logs

**Database connection error?**
- Verify DATABASE_URL format
- Check SSL is enabled: `?sslmode=require`
- Ensure Neon database is running

## Next Steps

1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive guide
2. Review [SECURITY.md](./SECURITY.md) for security best practices
3. Set up automated backups
4. Configure rate limiting
5. Add analytics (Google Analytics, PostHog)
6. Create marketing pages
7. Launch! 🚀

## Support

- Documentation: See DEPLOYMENT.md
- Security: See SECURITY.md
- Issues: Open GitHub issue

---

**Estimated Total Time: 30-45 minutes**

Good luck with your launch! 🎉
