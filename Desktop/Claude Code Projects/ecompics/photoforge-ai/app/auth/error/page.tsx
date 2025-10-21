'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          message: 'There is a problem with the server configuration. Please contact support.',
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in.',
        }
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification token has expired or has already been used.',
        }
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign In Error',
          message: 'Error in constructing an authorization URL.',
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          message: 'Error in handling the response from the OAuth provider.',
        }
      case 'OAuthCreateAccount':
        return {
          title: 'OAuth Account Creation Error',
          message: 'Could not create an account with the OAuth provider.',
        }
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Creation Error',
          message: 'Could not create an account with the email provided.',
        }
      case 'Callback':
        return {
          title: 'Callback Error',
          message: 'Error in the OAuth callback handler route.',
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          message:
            'This email is already associated with another account. Please sign in with your original sign-in method.',
        }
      case 'EmailSignin':
        return {
          title: 'Email Sign In Error',
          message: 'The email sign in link is no longer valid. Please request a new one.',
        }
      case 'CredentialsSignin':
        return {
          title: 'Sign In Error',
          message: 'Invalid email or password. Please check your credentials and try again.',
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          message: 'You must be signed in to access this page.',
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during authentication. Please try again.',
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{errorInfo.title}</h2>
          <p className="text-lg text-gray-600 mb-8">{errorInfo.message}</p>

          {error && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Error code: <span className="font-mono font-semibold">{error}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Try Signing In Again
          </Link>

          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Return to Home
          </Link>

          <Link
            href="/contact"
            className="w-full flex justify-center py-3 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Contact Support
          </Link>
        </div>

        {/* Common Solutions */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Common Solutions:</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Check that you&apos;re using the correct email address
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              If using OAuth, make sure you&apos;re signed into the correct account
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Clear your browser cookies and cache, then try again
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Try using a different browser or device
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
