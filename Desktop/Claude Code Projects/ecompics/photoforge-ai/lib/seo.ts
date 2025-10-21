import { Metadata } from 'next'

const APP_NAME = 'PhotoForge AI'
const APP_DESCRIPTION = 'Transform your product images with AI-powered backgrounds. Upload photos and let our AI generate stunning, professional backgrounds in seconds. Perfect for e-commerce, marketing, and social media.'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://photoforge-ai.com'

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - AI-Powered Product Image Backgrounds`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: [
    'AI image processing',
    'product photography',
    'background removal',
    'AI backgrounds',
    'e-commerce images',
    'product images',
    'AI photo editing',
    'batch image processing',
    'professional product photos',
    'automated photography'
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - AI-Powered Product Image Backgrounds`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Transform your product images with AI`
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - AI-Powered Product Image Backgrounds`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: '@photoforgeai',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  noIndex = false,
}: {
  title: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}): Metadata {
  const pageUrl = url ? `${APP_URL}${url}` : APP_URL
  const ogImage = image || `${APP_URL}/og-image.png`
  const pageDescription = description || APP_DESCRIPTION

  return {
    title,
    description: pageDescription,
    openGraph: {
      title,
      description: pageDescription,
      url: pageUrl,
      siteName: APP_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pageDescription,
      images: [ogImage],
      creator: '@photoforgeai',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: {
      canonical: pageUrl,
    },
  }
}
