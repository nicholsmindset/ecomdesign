'use client';

import Link from 'next/link';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
            <XCircle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Checkout Cancelled
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your order has not been placed. Your cart is still saved.
          </p>
        </div>

        {/* Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            What Happened?
          </h2>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              You've cancelled the checkout process. Don't worry - all items are still in your cart and ready when you're ready to complete your purchase.
            </p>
          </div>
        </div>

        {/* Reassurance */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Why Complete Your Order?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Free shipping on all orders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>30-day return policy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Secure checkout with Stripe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Fast 2-3 day shipping</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/cart"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Return to Cart
          </Link>

          <Link
            href="/products"
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Need help or have questions?
          </p>
          <p className="text-sm text-gray-900 dark:text-white">
            <strong>Support Email:</strong>{' '}
            <a
              href="mailto:support@ecomdesign.com"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              support@ecomdesign.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
