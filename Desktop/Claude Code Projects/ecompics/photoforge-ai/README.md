<div align="center">

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ██████╗ ██╗  ██╗ ██████╗ ████████╗ ██████╗                    ║
║   ██╔══██╗██║  ██║██╔═══██╗╚══██╔══╝██╔═══██╗                   ║
║   ██████╔╝███████║██║   ██║   ██║   ██║   ██║                   ║
║   ██╔═══╝ ██╔══██║██║   ██║   ██║   ██║   ██║                   ║
║   ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝                   ║
║   ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝                    ║
║                                                                   ║
║   ███████╗ ██████╗ ██████╗  ██████╗ ███████╗                    ║
║   ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝                    ║
║   █████╗  ██║   ██║██████╔╝██║  ███╗█████╗                      ║
║   ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝                      ║
║   ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗                    ║
║   ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝                    ║
║                                                                   ║
║            🎨 AI-Powered Product Image Transformation 🚀          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

<h3>Transform Your Product Photos with AI-Generated Backgrounds</h3>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com/yourusername/photoforge-ai)

[Features](#-key-features) •
[Demo](#-demo) •
[Installation](#-quick-start) •
[Documentation](#-documentation) •
[API](#-api-reference) •
[Deployment](#-deployment)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

**PhotoForge AI** is a production-ready, full-stack SaaS platform that uses advanced AI to transform product images with custom backgrounds. Built for e-commerce businesses, photographers, and marketers who need professional product photos at scale.

### Why PhotoForge AI?

- **🎨 AI-Powered Magic**: Leverages Google Gemini 2.5 Flash to generate stunning, realistic backgrounds
- **⚡ Lightning Fast**: Process hundreds of images with our optimized queue system
- **💰 Fair Pricing**: Credit-based system with flexible plans and batch discounts
- **🔒 Enterprise Ready**: Built with security, scalability, and reliability in mind
- **📧 Full Automation**: Background processing with email notifications
- **🎯 Production Tested**: Comprehensive code review, all critical bugs fixed

### Perfect For:

- E-commerce stores needing product photos
- Marketing agencies managing multiple clients
- Photographers offering background replacement services
- Social media managers creating engaging content
- Anyone who wants professional product images without expensive photoshoots

---

## 🎬 Demo

### Live Demo
> **Coming Soon**: https://photoforge-ai.vercel.app

### Example Transformations

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  BEFORE: Plain white background          AFTER: Beach sunset   │
│  ┌───────────────┐                       ┌───────────────┐     │
│  │               │                       │               │     │
│  │   [Product]   │  ─────────────────>   │   [Product]   │     │
│  │               │    ✨ AI Magic        │               │     │
│  └───────────────┘                       └───────────────┘     │
│                                                                 │
│  Processing Time: 2-5 seconds | Cost: 1 credit                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Screenshots

**Dashboard** - Monitor all your jobs in real-time
```
╔════════════════════════════════════════════════════════════╗
║  PhotoForge AI | Dashboard                                 ║
╠════════════════════════════════════════════════════════════╣
║  Credits: 250        Active Jobs: 2        Completed: 47   ║
║  ─────────────────────────────────────────────────────────  ║
║  Recent Jobs                                               ║
║  • Beach Background (5 images) - Processing 80%           ║
║  • Studio Setup (12 images) - Completed ✓                 ║
║  • Minimalist White (3 images) - Queued                   ║
╚════════════════════════════════════════════════════════════╝
```

**Upload Interface** - Drag & drop with instant preview
```
╔════════════════════════════════════════════════════════════╗
║  Upload Images                                             ║
╠════════════════════════════════════════════════════════════╣
║  ┌──────────────────────────────────────────────────────┐  ║
║  │   📸  Drag & drop images here                       │  ║
║  │   or click to browse                                │  ║
║  │                                                      │  ║
║  │   Supports: JPG, PNG, WebP (max 10MB each)         │  ║
║  └──────────────────────────────────────────────────────┘  ║
║                                                            ║
║  Background Prompt: "Luxury marble countertop"             ║
║  Style: Realistic  |  Images: 5  |  Cost: 5 credits       ║
║                                                            ║
║  [Process Images →]                                        ║
╚════════════════════════════════════════════════════════════╝
```

---

## ✨ Key Features

### 🎨 **AI Image Processing**
- **Google Gemini 2.5 Flash Integration** - State-of-the-art AI model for realistic backgrounds
- **Custom Background Prompts** - Describe any scene you want
- **Multiple Style Options** - Realistic, artistic, minimalist, or dramatic
- **Batch Processing** - Process up to 100 images at once
- **Smart Fallbacks** - Automatic handling of processing failures
- **Quality Preservation** - Maintains original image quality and product details

### 💳 **Flexible Pricing**
- **Credit-Based System** - Pay only for what you use
- **4 Subscription Tiers** - Free, Starter ($49), Professional ($149), Enterprise ($449)
- **À La Carte Options** - Buy credits without subscription
- **Batch Discounts** - Up to 30% off for bulk processing
- **Credit Rollover** - Unused credits carry forward (up to plan limits)
- **Fair Billing** - Only charged for successfully processed images

### 🔐 **Authentication & Security**
- **NextAuth.js Integration** - Secure session management
- **Multiple Auth Methods** - Email/password + Google OAuth
- **JWT Tokens** - Encrypted session tokens
- **Protected Routes** - Server-side authentication checks
- **HTTPS Enforced** - All traffic encrypted
- **Security Headers** - HSTS, CSP, XSS protection

### 💰 **Payment Processing**
- **Stripe Integration** - PCI-compliant payment processing
- **Subscription Management** - Automatic billing and renewals
- **One-Time Purchases** - À la carte credit packages
- **Secure Webhooks** - Verified Stripe event handling
- **Transaction History** - Complete billing records
- **Automatic Refunds** - Credits refunded for failed images

### 📊 **Job Management**
- **Real-Time Progress Tracking** - Watch your jobs process live
- **Bull Queue System** - Reliable background job processing
- **Job Cancellation** - Cancel with automatic credit refunds
- **History & Analytics** - View all past jobs and usage
- **Status Filtering** - Pending, processing, completed, failed
- **Pagination** - Efficient loading of large job lists

### 📧 **Email Notifications**
- **Job Completion Alerts** - Know when your images are ready
- **Welcome Emails** - Onboarding for new users
- **Beautiful Templates** - Professional HTML emails
- **Status Summaries** - Success/failure breakdowns
- **Direct Links** - Jump straight to your results
- **Optional Feature** - Works without SMTP configuration

### 📱 **Modern UI/UX**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Tailwind CSS** - Beautiful, consistent styling
- **Radix UI Components** - Accessible, high-quality components
- **Dark Mode Ready** - Theme support built-in
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Clear feedback during operations

### 🏗️ **Developer Experience**
- **TypeScript Throughout** - Full type safety
- **Comprehensive Documentation** - Deployment guides, API docs, security checklist
- **Automated Scripts** - Pre-deploy checks, post-deploy verification
- **Error Tracking** - Sentry integration for production monitoring
- **Health Check Endpoints** - Monitor app, database, and queue status
- **Code Quality** - ESLint, Prettier, comprehensive code review

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Latest-black)](https://www.radix-ui.com/)

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Latest-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Bull](https://img.shields.io/badge/Bull-Queue-D82C21)](https://github.com/OptimalBits/bull)

### AI & Storage
[![Google AI](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![AWS S3](https://img.shields.io/badge/AWS%20S3-Storage-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/)

### Payments & Auth
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe&logoColor=white)](https://stripe.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-Auth-000000)](https://next-auth.js.org/)

### DevOps
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?logo=sentry&logoColor=white)](https://sentry.io/)

</div>

### Full Stack Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend Layer                                                 │
│  ├── Next.js 14 (App Router, Server Components)               │
│  ├── React 18 (Concurrent rendering)                          │
│  ├── TypeScript (Full type safety)                            │
│  ├── Tailwind CSS (Utility-first styling)                     │
│  └── Radix UI (Accessible components)                         │
├─────────────────────────────────────────────────────────────────┤
│  Backend Layer                                                  │
│  ├── Next.js API Routes (RESTful endpoints)                   │
│  ├── Prisma ORM (Type-safe database access)                   │
│  ├── NextAuth.js (Authentication & sessions)                  │
│  ├── Stripe SDK (Payment processing)                          │
│  └── Bull Queue (Background job processing)                   │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                     │
│  ├── PostgreSQL (Primary database)                            │
│  ├── Redis (Queue & caching)                                  │
│  └── AWS S3 (Image storage)                                   │
├─────────────────────────────────────────────────────────────────┤
│  AI & Processing                                                │
│  ├── Google Gemini 2.5 Flash (Image generation)              │
│  ├── Custom Worker Process (Job processing)                   │
│  └── Axios (HTTP client for image downloads)                  │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure                                                 │
│  ├── Vercel (Application hosting)                             │
│  ├── Railway (Worker hosting)                                 │
│  ├── Neon/Supabase (Managed PostgreSQL)                       │
│  ├── Upstash (Managed Redis)                                  │
│  └── Sentry (Error tracking)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         User's Browser                               │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ HTTPS
                                ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    Next.js Application (Vercel)                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  App Router Pages                                              │  │
│  │  • Landing, Dashboard, Upload, Jobs, Billing, Settings        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  API Routes                                                    │  │
│  │  • /api/jobs/* - Job management                              │  │
│  │  • /api/auth/* - Authentication                              │  │
│  │  • /api/subscriptions/* - Subscription management           │  │
│  │  • /api/webhooks/stripe - Payment events                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└───────┬──────────────┬──────────────┬───────────────┬───────────────┘
        │              │              │               │
        │ Prisma       │ Stripe       │ S3           │ Bull Queue
        ↓              ↓              ↓               ↓
┌───────────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐
│  PostgreSQL   │ │  Stripe  │ │  AWS S3  │ │     Redis       │
│   (Database)  │ │   API    │ │(Storage) │ │  (Job Queue)    │
└───────────────┘ └──────────┘ └──────────┘ └─────────┬───────┘
                                                       │
                                                       │ Processes jobs
                                                       ↓
                                        ┌──────────────────────────────┐
                                        │   Worker Process (Railway)   │
                                        │  ┌────────────────────────┐  │
                                        │  │  Image Processor       │  │
                                        │  │  • Download images     │  │
                                        │  │  • Call Gemini API    │  │
                                        │  │  • Upload to S3       │  │
                                        │  │  • Update job status  │  │
                                        │  │  • Send emails        │  │
                                        │  └────────────────────────┘  │
                                        └───────────┬──────────────────┘
                                                    │
                                                    ↓
                                            ┌───────────────┐
                                            │  Gemini API   │
                                            │ (Google AI)   │
                                            └───────────────┘
```

### Data Flow

```
User Upload Flow:
1. User uploads images → Next.js app
2. Images uploaded to S3 (original/)
3. Job created in PostgreSQL
4. Job added to Redis queue
5. Worker picks up job
6. Worker downloads images from S3
7. Worker calls Gemini API for processing
8. Worker uploads processed images to S3 (processed/)
9. Worker updates job status in PostgreSQL
10. Worker sends email notification
11. User receives notification & downloads images
```

### Credit System Flow

```
Credit Lifecycle:
┌──────────────────────────────────────────────────────────────┐
│  Purchase → Available → Reserved → Consumed/Refunded         │
└──────────────────────────────────────────────────────────────┘

1. User purchases subscription/credits
2. Credits added to availableCredits
3. Job creation reserves credits (availableCredits → 0)
4. Job processing:
   • Success: Credits consumed (logged in CreditTransaction)
   • Failure: Credits refunded (back to availableCredits)
5. Monthly: Subscription credits reset, rollovers capped
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.17.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** database ([Neon](https://neon.tech), [Supabase](https://supabase.com), or local)
- **Redis** server ([Upstash](https://upstash.com) or local)
- **AWS Account** with S3 bucket configured
- **Stripe Account** ([Sign up](https://stripe.com))
- **Google AI API Key** ([Get here](https://aistudio.google.com/app/apikey))

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/photoforge-ai.git
cd photoforge-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Start Redis (in separate terminal)
redis-server

# 6. Start development server
npm run dev

# 7. Start worker (in separate terminal)
npm run dev:worker

# 8. Open browser
open http://localhost:3000
```

✅ **You're ready!** Sign up and start processing images.

---

## 📦 Installation

### Detailed Installation Steps

#### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/photoforge-ai.git
cd photoforge-ai

# Install dependencies
npm install

# Verify installation
npm run type-check
```

#### 2. Database Setup

**Option A: Cloud Database (Recommended)**

```bash
# Using Neon (https://neon.tech)
# 1. Create account and project
# 2. Copy connection string
# 3. Add to .env.local:
DATABASE_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/photoforge?sslmode=require"
```

**Option B: Local PostgreSQL**

```bash
# Install PostgreSQL
brew install postgresql  # macOS
# or
sudo apt install postgresql  # Ubuntu

# Create database
createdb photoforge_ai

# Add to .env.local:
DATABASE_URL="postgresql://localhost:5432/photoforge_ai"
```

#### 3. Redis Setup

**Option A: Cloud Redis (Recommended)**

```bash
# Using Upstash (https://upstash.com)
# 1. Create database
# 2. Copy Redis URL
# 3. Add to .env.local:
REDIS_URL="redis://:password@region.upstash.io:port"
```

**Option B: Local Redis**

```bash
# Install Redis
brew install redis  # macOS
# or
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server

# Add to .env.local:
REDIS_URL="redis://localhost:6379"
```

#### 4. AWS S3 Setup

```bash
# 1. Create AWS account
# 2. Create S3 bucket: photoforge-ai-uploads
# 3. Create IAM user with S3 permissions
# 4. Generate access keys
# 5. Add to .env.local:
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="photoforge-ai-uploads"
```

#### 5. Stripe Setup

```bash
# 1. Create Stripe account
# 2. Get API keys from dashboard
# 3. Create products and prices
# 4. Set up webhook endpoint
# 5. Add to .env.local:
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
# Add all price IDs...
```

#### 6. Google AI Setup

```bash
# 1. Visit https://aistudio.google.com/app/apikey
# 2. Create API key
# 3. Enable billing (required for production)
# 4. Add to .env.local:
GOOGLE_AI_API_KEY="your-api-key"
GEMINI_MODEL="gemini-2.5-flash"
```

#### 7. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npm run db:seed

# Verify with Prisma Studio
npm run db:studio
```

#### 8. Start Application

```bash
# Terminal 1: Next.js app
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Image processor worker
npm run dev:worker
# Listens for jobs from Redis queue

# Terminal 3: Redis (if local)
redis-server
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the project root:

```bash
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"

# ============================================
# AUTHENTICATION
# ============================================
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."

# ============================================
# AWS S3
# ============================================
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="photoforge-ai-uploads"

# ============================================
# REDIS
# ============================================
REDIS_URL="redis://localhost:6379"
# or for Upstash: redis://:password@host:port

# ============================================
# STRIPE
# ============================================
# Use test keys in development, live keys in production
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Subscription Price IDs (create in Stripe Dashboard)
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# À La Carte Price IDs
STRIPE_ALA_CARTE_50_PRICE_ID="price_..."
STRIPE_ALA_CARTE_100_PRICE_ID="price_..."
STRIPE_ALA_CARTE_500_PRICE_ID="price_..."

# ============================================
# GOOGLE AI (REQUIRED)
# ============================================
GOOGLE_AI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"

# ============================================
# SECURITY
# ============================================
# Generate with: openssl rand -hex 32
CRON_SECRET="your-cron-secret-for-protected-endpoints"

# ============================================
# EMAIL (OPTIONAL)
# ============================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
SMTP_FROM="PhotoForge AI <noreply@photoforge-ai.com>"

# ============================================
# MONITORING (OPTIONAL)
# ============================================
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="photoforge-ai"
SENTRY_AUTH_TOKEN="..."

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="60000"
```

### Stripe Product Setup

Create products in Stripe Dashboard:

```bash
# 1. Go to https://dashboard.stripe.com/products
# 2. Create subscription products:

Product: Starter Plan
├── Price: $49/month
├── Recurring: Monthly
└── Copy price_id → STRIPE_STARTER_PRICE_ID

Product: Professional Plan
├── Price: $149/month
├── Recurring: Monthly
└── Copy price_id → STRIPE_PROFESSIONAL_PRICE_ID

Product: Enterprise Plan
├── Price: $449/month
├── Recurring: Monthly
└── Copy price_id → STRIPE_ENTERPRISE_PRICE_ID

# 3. Create one-time purchase products:

Product: 50 Credits
├── Price: $29
├── One-time
└── Copy price_id → STRIPE_ALA_CARTE_50_PRICE_ID

Product: 100 Credits
├── Price: $49
├── One-time
└── Copy price_id → STRIPE_ALA_CARTE_100_PRICE_ID

Product: 500 Credits
├── Price: $199
├── One-time
└── Copy price_id → STRIPE_ALA_CARTE_500_PRICE_ID
```

---

## 📚 Usage

### Basic Workflow

```bash
# 1. Sign up for an account
Navigate to http://localhost:3000/auth/signup

# 2. Get free credits
New users receive 5 free credits

# 3. Upload images
Go to /upload and drag & drop your product images

# 4. Describe background
Enter a prompt like: "Luxury marble countertop with soft lighting"

# 5. Process images
Click "Process Images" and monitor progress

# 6. Download results
View processed images and download
```

### Example Prompts

```javascript
// Realistic Scenes
"Wooden table with natural window light"
"Modern kitchen countertop with marble background"
"Outdoor garden setting with blurred bokeh"
"Professional studio with gray seamless backdrop"

// Creative Scenes
"Floating in clouds with sunset colors"
"Underwater scene with coral reef"
"Minimalist white space with geometric shadows"
"Cyberpunk neon city background"

// Seasonal
"Christmas setting with decorated tree and lights"
"Beach scene with ocean and palm trees"
"Autumn forest with colorful leaves"
"Winter wonderland with snow"
```

### API Usage Examples

#### Creating a Job

```typescript
// POST /api/jobs/create
const response = await fetch('/api/jobs/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    backgroundPrompt: 'Luxury marble countertop',
    modelType: 'realistic',
    inputImages: [
      'https://s3.amazonaws.com/bucket/image1.jpg',
      'https://s3.amazonaws.com/bucket/image2.jpg',
    ],
    creditsToUse: 2,
  }),
})

const data = await response.json()
// { jobId: "...", status: "pending", queuePosition: 3 }
```

#### Checking Job Status

```typescript
// GET /api/jobs/[id]
const response = await fetch(`/api/jobs/${jobId}`)
const job = await response.json()

console.log(job.status) // "pending" | "processing" | "completed" | "failed"
console.log(job.progress) // 0-100
console.log(job.currentStep) // "Processing image 2/5"
```

#### Canceling a Job

```typescript
// POST /api/jobs/[id]/cancel
const response = await fetch(`/api/jobs/${jobId}/cancel`, {
  method: 'POST',
})

const data = await response.json()
// { success: true, creditsRefunded: 3 }
```

---

## 🔌 API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### `POST /api/auth/signin`
Sign in with credentials (handled by NextAuth).

### Job Management Endpoints

#### `POST /api/jobs/create`
Create a new image processing job.

**Request:**
```json
{
  "backgroundPrompt": "Professional studio with gray backdrop",
  "modelType": "realistic",
  "sceneStyle": "photography",
  "inputImages": ["https://s3.../image1.jpg", "https://s3.../image2.jpg"],
  "creditsToUse": 2
}
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "pending",
  "queuePosition": 5,
  "estimatedTime": "2-5 minutes",
  "creditsReserved": 2
}
```

#### `GET /api/jobs`
List all jobs for the authenticated user.

**Query Parameters:**
- `status` - Filter by status (pending, processing, completed, failed)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response:**
```json
{
  "jobs": [
    {
      "id": "job_abc123",
      "status": "completed",
      "backgroundPrompt": "Beach sunset",
      "inputImages": [...],
      "outputImages": [...],
      "creditsConsumed": 5,
      "createdAt": "2025-01-20T10:00:00Z",
      "completedAt": "2025-01-20T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "pages": 5
  }
}
```

#### `GET /api/jobs/[id]`
Get details for a specific job.

**Response:**
```json
{
  "id": "job_abc123",
  "status": "processing",
  "progress": 65,
  "currentStep": "Processing image 3/5",
  "backgroundPrompt": "Luxury marble countertop",
  "modelType": "realistic",
  "inputImages": [...],
  "outputImages": [...],
  "creditsReserved": 5,
  "creditsConsumed": 3,
  "createdAt": "2025-01-20T10:00:00Z"
}
```

#### `POST /api/jobs/[id]/cancel`
Cancel a pending or processing job.

**Response:**
```json
{
  "success": true,
  "jobId": "job_abc123",
  "status": "cancelled",
  "creditsRefunded": 5
}
```

### User & Credit Endpoints

#### `GET /api/users/credits`
Get current credit balance and usage.

**Response:**
```json
{
  "credits": {
    "available": 245,
    "rollover": 50,
    "subscription": 200,
    "alaCarte": 95
  },
  "subscription": {
    "tier": "professional",
    "status": "active",
    "monthlyCredits": 400,
    "rolloverCap": 200,
    "renewsAt": "2025-02-01T00:00:00Z"
  }
}
```

#### `PATCH /api/users/profile`
Update user profile information.

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### `DELETE /api/users/account`
Delete user account and all associated data.

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Subscription & Billing Endpoints

#### `POST /api/subscriptions/checkout`
Create a Stripe checkout session for subscription.

**Request:**
```json
{
  "tier": "professional"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

#### `POST /api/subscriptions/cancel`
Cancel active subscription.

**Response:**
```json
{
  "success": true,
  "cancelAt": "2025-02-01T00:00:00Z"
}
```

#### `POST /api/billing/checkout`
Create checkout session for à la carte credits.

**Request:**
```json
{
  "credits": 100
}
```

### Webhook Endpoints

#### `POST /api/webhooks/stripe`
Handle Stripe webhook events (signature verified).

**Events Handled:**
- `payment_intent.succeeded` - Credit purchase
- `payment_intent.payment_failed` - Failed payment
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled

### Health Check Endpoints

#### `GET /api/health`
Basic application health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:00:00Z",
  "service": "PhotoForge AI",
  "environment": "production"
}
```

#### `GET /api/health/db`
Database connection health check.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-20T10:00:00Z"
}
```

#### `GET /api/health/redis`
Redis queue health check.

**Response:**
```json
{
  "status": "healthy",
  "redis": "connected",
  "queue": {
    "waiting": 5,
    "active": 2,
    "completed": 1247,
    "failed": 3,
    "delayed": 0
  },
  "timestamp": "2025-01-20T10:00:00Z"
}
```

---

## 🚀 Deployment

### Quick Deployment (30 minutes)

See [`QUICKSTART.md`](./QUICKSTART.md) for rapid deployment guide.

### Comprehensive Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for complete deployment documentation including:

- Infrastructure setup (PostgreSQL, Redis, S3, Stripe)
- Environment configuration for production
- Application deployment (Vercel recommended)
- Worker deployment (Railway recommended)
- Security best practices
- Monitoring and maintenance

### Deployment Checklist

```bash
# 1. Pre-deployment checks
./scripts/pre-deploy-check.sh

# 2. Set up production services
# - Create Neon PostgreSQL database
# - Create Upstash Redis instance
# - Set up AWS S3 bucket
# - Configure Stripe live mode
# - Get Google AI API key

# 3. Deploy application
vercel --prod

# 4. Deploy worker
# (Railway, or separate service)

# 5. Configure environment variables
# Add all variables to Vercel dashboard

# 6. Run database migrations
npx prisma migrate deploy

# 7. Verify deployment
./scripts/post-deploy-verify.sh https://your-domain.com

# 8. Set up monitoring
# - Configure Sentry
# - Set up UptimeRobot
# - Enable error alerts
```

### Recommended Hosting

**Application**: Vercel
- Automatic deployments from Git
- Edge functions for global performance
- Zero-config setup for Next.js
- Built-in analytics and monitoring

**Worker**: Railway
- Persistent background processes
- Simple deployment from Git
- Automatic restarts on failures
- Built-in metrics and logs

**Database**: Neon
- Serverless PostgreSQL
- Automatic scaling
- Branching for development
- Pay-per-use pricing

**Redis**: Upstash
- Serverless Redis
- Global edge caching
- REST API option
- Free tier available

**Storage**: AWS S3
- Reliable object storage
- CDN integration (CloudFront)
- Lifecycle policies
- Cost-effective

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

### Manual Testing Checklist

```bash
# Authentication
☐ Sign up with email/password
☐ Sign in with credentials
☐ Sign in with Google OAuth
☐ Sign out
☐ Password reset flow

# Image Processing
☐ Upload single image
☐ Upload multiple images (batch)
☐ Create job with custom prompt
☐ Monitor job progress
☐ Download processed images
☐ Cancel pending job
☐ View job history

# Credits & Billing
☐ Check credit balance
☐ Purchase à la carte credits
☐ Subscribe to plan
☐ Upgrade/downgrade subscription
☐ Cancel subscription
☐ Verify credit refunds for failures

# User Management
☐ Update profile information
☐ Change password
☐ Enable/disable notifications
☐ Delete account
☐ View transaction history

# Edge Cases
☐ Upload invalid file types
☐ Upload oversized files
☐ Process with insufficient credits
☐ Handle Gemini API failures
☐ Network interruption during upload
☐ Duplicate job submissions
```

### Load Testing

```bash
# Using k6 (install from https://k6.io/)
k6 run tests/load/upload-test.js

# Expected results:
# - 95th percentile < 500ms for API routes
# - No errors under 100 concurrent users
# - Queue processing 2+ jobs/second
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

```bash
# Fork and clone
git clone https://github.com/yourusername/photoforge-ai.git
cd photoforge-ai

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install

# Make your changes
# ...

# Run tests
npm test
npm run type-check

# Commit with conventional commits
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Process

1. **Update documentation** if adding features
2. **Add tests** for new functionality
3. **Run all checks** before submitting
4. **Write clear PR description** explaining changes
5. **Link related issues** if applicable

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

---

## ❓ FAQ

### General

**Q: What image formats are supported?**
A: JPG, JPEG, PNG, and WebP. Maximum file size is 10MB per image.

**Q: How long does processing take?**
A: Most images are processed in 2-5 seconds. Batch jobs depend on queue length and typically complete within 5-10 minutes.

**Q: What happens if processing fails?**
A: Credits are automatically refunded for any failed images. You only pay for successfully processed images.

**Q: Can I cancel a job?**
A: Yes! You can cancel pending or processing jobs. All reserved credits will be refunded immediately.

### Credits & Billing

**Q: Do credits expire?**
A: À la carte credits never expire. Subscription credits roll over month-to-month up to your plan's rollover cap.

**Q: What's the difference between subscription and à la carte?**
A: Subscriptions provide monthly credits at a discounted rate with rollover. À la carte lets you buy credits anytime without commitment.

**Q: Can I get a refund?**
A: Credits are automatically refunded for failed processing. For other refund requests, please contact support.

**Q: Do I get batch discounts?**
A: Yes! Discounts apply automatically: 10-19 images (5% off), 20-49 (10% off), 50-99 (20% off), 100+ (30% off).

### Technical

**Q: What AI model is used?**
A: Google Gemini 2.5 Flash, specifically designed for image generation with realistic backgrounds.

**Q: Where are my images stored?**
A: Images are securely stored in AWS S3. You can delete them anytime from your dashboard.

**Q: Is my data secure?**
A: Yes. We use industry-standard encryption, secure authentication, and follow GDPR/CCPA compliance guidelines.

**Q: Can I use the API programmatically?**
A: Yes! Full REST API is available. See [API Reference](#-api-reference) section.

### Pricing

**Q: What's included in the free tier?**
A: 5 free credits to test the service. Perfect for trying out the platform.

**Q: Can I upgrade/downgrade my plan?**
A: Yes, anytime. Changes take effect at the next billing cycle. Unused credits roll over (up to cap).

**Q: What payment methods are accepted?**
A: All major credit/debit cards via Stripe. We don't store your card information.

---

## 🗺️ Roadmap

### Q1 2025 - Current Phase ✅
- [x] Core image processing functionality
- [x] Credit system with rollover
- [x] Subscription & à la carte billing
- [x] Email notifications
- [x] Production deployment
- [x] Comprehensive documentation

### Q2 2025 - Enhancement Phase 🚧
- [ ] Batch processing API
- [ ] Custom model training
- [ ] Advanced editing tools (remove objects, recolor)
- [ ] Team collaboration features
- [ ] API rate limiting dashboard
- [ ] Webhook support for job completion

### Q3 2025 - Scale Phase 📋
- [ ] Mobile apps (iOS & Android)
- [ ] Photoshop/Figma plugins
- [ ] White-label solution
- [ ] Enterprise SSO integration
- [ ] Advanced analytics dashboard
- [ ] Multiple AI model options

### Q4 2025 - Enterprise Phase 💡
- [ ] On-premise deployment option
- [ ] Custom model training
- [ ] Priority processing queue
- [ ] Dedicated account managers
- [ ] SLA guarantees
- [ ] Advanced security features

**Vote on features:** [GitHub Discussions](https://github.com/yourusername/photoforge-ai/discussions)

---

## 📄 License

**Proprietary License** - All rights reserved.

This software and associated documentation files are proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

For licensing inquiries, contact: licensing@photoforge-ai.com

---

## 💬 Support

### Documentation

- **Deployment Guide**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Quick Start**: [`QUICKSTART.md`](./QUICKSTART.md)
- **Security Best Practices**: [`SECURITY.md`](./SECURITY.md)
- **Code Review Report**: [`CODE_REVIEW_REPORT.md`](./CODE_REVIEW_REPORT.md)

### Get Help

- **Email**: support@photoforge-ai.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/photoforge-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/photoforge-ai/discussions)
- **Twitter**: [@PhotoForgeAI](https://twitter.com/photoforgeai)

### Community

- **Discord**: [Join our community](https://discord.gg/photoforge-ai)
- **Twitter**: [@PhotoForgeAI](https://twitter.com/photoforgeai)
- **Blog**: [blog.photoforge-ai.com](https://blog.photoforge-ai.com)

---

## 🙏 Acknowledgments

Built with amazing open-source tools and services:

- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[Stripe](https://stripe.com/)** - Payment infrastructure
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component library
- **[Google AI](https://ai.google.dev/)** - Gemini AI model
- **[Bull](https://github.com/OptimalBits/bull)** - Premium queue package
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js
- **[Vercel](https://vercel.com/)** - Deployment platform

Special thanks to all contributors and the open-source community! ❤️

---

<div align="center">

**[⬆ Back to Top](#photoforge-ai)**

Made with ❤️ by the PhotoForge AI Team

© 2025 PhotoForge AI. All rights reserved.

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/photoforge-ai?style=social)](https://github.com/yourusername/photoforge-ai)
[![Follow on Twitter](https://img.shields.io/twitter/follow/photoforgeai?style=social)](https://twitter.com/photoforgeai)

</div>
