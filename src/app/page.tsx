export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="flex flex-col gap-8 items-center max-w-4xl">
        <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          E-Commerce Design Platform
        </h1>

        <p className="text-xl text-center text-gray-600 dark:text-gray-400">
          Modern e-commerce platform with AI-powered design tools
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">🛍️ Products</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse our curated collection of products
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">🎨 AI Design</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create custom designs with AI assistance
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">💳 Checkout</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Secure payment processing with Stripe
            </p>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>✨ Status: Development Mode</p>
          <p>🔧 Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL</p>
        </div>
      </main>
    </div>
  );
}
