'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page or auth pages
  if (pathname === '/' || pathname.startsWith('/auth/')) {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)

  // Generate breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Skip dynamic segments like [id]
    if (segment.startsWith('[')) return

    // Format label - capitalize and replace hyphens
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Custom labels for specific routes
    if (segment === 'jobs' && index === 0) label = 'Jobs'
    if (segment === 'upload') label = 'Upload Images'
    if (segment === 'billing') label = 'Billing & Subscriptions'
    if (segment === 'settings') label = 'Account Settings'
    if (segment === 'dashboard') label = 'Dashboard'
    if (segment === 'pricing') label = 'Pricing Plans'

    breadcrumbs.push({
      label,
      href: currentPath
    })
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={item.href}>
              <li className="flex items-center">
                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                ) : isLast ? (
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
