'use client'

import { useState } from 'react'
import { Metadata } from 'next'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      // TODO: Implement contact form API endpoint
      // For now, just simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          Have a question or need help? We&apos;re here to assist you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Message sent successfully! We&apos;ll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {errorMessage || 'Failed to send message. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="billing">Billing Question</option>
                <option value="technical">Technical Support</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Other ways to reach us</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-gray-600">
                For general inquiries and support:
                <br />
                <a href="mailto:support@photoforge-ai.com" className="text-blue-600 hover:underline">
                  support@photoforge-ai.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Billing Questions</h3>
              <p className="text-gray-600">
                For payment and subscription issues:
                <br />
                <a href="mailto:billing@photoforge-ai.com" className="text-blue-600 hover:underline">
                  billing@photoforge-ai.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
              <p className="text-gray-600">
                For API and integration help:
                <br />
                <a href="mailto:tech@photoforge-ai.com" className="text-blue-600 hover:underline">
                  tech@photoforge-ai.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Response Time</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Documentation</h3>
              <p className="text-gray-600">
                Check our{' '}
                <a href="/pricing" className="text-blue-600 hover:underline">
                  Pricing Page
                </a>{' '}
                for common questions about plans and credits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">How long does image processing take?</h3>
            <p className="text-gray-600">
              Most images are processed within 1-5 minutes, depending on queue length and image complexity.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">What image formats are supported?</h3>
            <p className="text-gray-600">
              We support JPG, JPEG, PNG, and WebP formats. Maximum file size is 10MB per image.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription anytime?</h3>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time from your billing page. You&apos;ll retain access until
              the end of your billing period.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Do credits expire?</h3>
            <p className="text-gray-600">
              À la carte credits never expire. Subscription credits roll over month-to-month up to your plan&apos;s
              rollover cap.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
