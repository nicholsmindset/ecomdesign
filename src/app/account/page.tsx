'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Package, User, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        My Account
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Overview */}
        <div className="md:col-span-2 space-y-6">
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {session.user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {session.user?.email}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {(session.user as any)?.role || 'Customer'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                -
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <User className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Member
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account Status
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <Link
                href="/account/orders"
                className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Package className="h-5 w-5" />
                <span>Order History</span>
              </Link>

              <Link
                href="/account/settings"
                className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Settings className="h-5 w-5" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
