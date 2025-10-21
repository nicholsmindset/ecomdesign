import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for PhotoForge AI',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using PhotoForge AI (&quot;Service&quot;), you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to these terms, you should not use this Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            PhotoForge AI provides AI-powered image processing services, specifically for transforming product images
            with custom backgrounds and scenes. We reserve the right to modify, suspend, or discontinue the Service
            at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept
            responsibility for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Payment and Billing</h2>
          <p className="text-gray-700 mb-4">
            Some aspects of the Service may be provided for a fee. You agree to pay all fees associated with your
            account. All fees are non-refundable except as required by law. We use Stripe for payment processing
            and do not store credit card information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Credit System</h2>
          <p className="text-gray-700 mb-4">
            Our Service operates on a credit-based system. Credits are used to process images. Unused subscription
            credits may roll over month-to-month up to the specified rollover cap for your plan. À la carte credits
            do not expire. Credits are non-transferable and non-refundable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
          <p className="text-gray-700 mb-4">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Upload illegal, harmful, or offensive content</li>
            <li>Infringe on intellectual property rights</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Upload images containing personal information of others without consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            You retain all rights to the images you upload. By using our Service, you grant us a license to process
            your images for the purpose of providing the Service. We do not claim ownership of your content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Service Limitations</h2>
          <p className="text-gray-700 mb-4">
            We strive to provide high-quality service but do not guarantee that the Service will be uninterrupted or
            error-free. Image processing results may vary and are subject to AI limitations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to terminate or suspend your account at any time for violations of these Terms.
            You may cancel your account at any time through your account settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            To the maximum extent permitted by law, PhotoForge AI shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any material changes
            via email or through the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us through our contact page.
          </p>
        </section>
      </div>
    </div>
  )
}
