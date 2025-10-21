import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/session-provider'
import { OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema } from '@/components/schema-org'
import { DEFAULT_METADATA } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = DEFAULT_METADATA

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OrganizationSchema />
        <WebsiteSchema />
        <SoftwareApplicationSchema />
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} PhotoForge AI. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <a href="/terms" className="hover:underline">
                    Terms
                  </a>
                  <a href="/privacy" className="hover:underline">
                    Privacy
                  </a>
                  <a href="/contact" className="hover:underline">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
