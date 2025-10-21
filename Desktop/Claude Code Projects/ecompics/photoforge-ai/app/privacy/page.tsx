import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for PhotoForge AI',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            PhotoForge AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your
            personal data. This privacy policy explains how we collect, use, and protect your information when you
            use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">2.1 Account Information</h3>
          <p className="text-gray-700 mb-4">
            When you create an account, we collect:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Name and email address</li>
            <li>Password (encrypted)</li>
            <li>Profile information you choose to provide</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Payment Information</h3>
          <p className="text-gray-700 mb-4">
            Payment information is processed securely through Stripe. We do not store your credit card details on
            our servers. We only store transaction IDs and billing history.
          </p>

          <h3 className="text-xl font-semibold mb-3">2.3 Images and Content</h3>
          <p className="text-gray-700 mb-4">
            We temporarily store the images you upload for processing. Processed images are stored for retrieval
            and download. You can delete your images at any time.
          </p>

          <h3 className="text-xl font-semibold mb-3">2.4 Usage Data</h3>
          <p className="text-gray-700 mb-4">
            We collect information about how you use our Service, including:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Pages visited and features used</li>
            <li>Processing job history and statistics</li>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use your information to:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Provide and improve our image processing services</li>
            <li>Process your payments and manage subscriptions</li>
            <li>Communicate with you about your account and our services</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
            <li>Improve our AI models and service quality</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We use the following third-party services:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>AWS S3:</strong> Image storage</li>
            <li><strong>Google Gemini AI:</strong> Image processing</li>
            <li><strong>Sentry:</strong> Error tracking and monitoring</li>
            <li><strong>Google OAuth:</strong> Optional authentication</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Each service has its own privacy policy governing the use of your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>All data transmitted over HTTPS/SSL</li>
            <li>Passwords encrypted using bcrypt</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure cloud infrastructure (AWS, Vercel)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your data as follows:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li><strong>Account data:</strong> Until you delete your account</li>
            <li><strong>Images:</strong> Until you delete them or close your account</li>
            <li><strong>Transaction records:</strong> 7 years for legal compliance</li>
            <li><strong>Usage logs:</strong> 90 days</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Object to automated decision-making</li>
          </ul>
          <p className="text-gray-700 mb-4">
            You can exercise these rights through your account settings or by contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use essential cookies for authentication and session management. We also use analytics cookies to
            understand how you use our Service. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal
            information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Your data may be transferred to and processed in countries other than your country of residence. We
            ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this privacy policy from time to time. We will notify you of any material changes via
            email or through a notice on our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this privacy policy or how we handle your data, please contact us through
            our contact page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. GDPR Compliance (EU Users)</h2>
          <p className="text-gray-700 mb-4">
            If you are located in the European Union, you have additional rights under GDPR, including the right
            to lodge a complaint with a supervisory authority.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. CCPA Compliance (California Residents)</h2>
          <p className="text-gray-700 mb-4">
            California residents have additional rights under the CCPA, including the right to know what personal
            information we collect and the right to opt-out of the sale of personal information. We do not sell
            your personal information.
          </p>
        </section>
      </div>
    </div>
  )
}
