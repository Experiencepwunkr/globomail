'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Globomail</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Digital Services</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { name: 'Dashboard', href: '/' },
              { name: 'NIN Verification', href: '/services/nin' },
              { name: 'NIN With Phone', href: '/services/nin-with-phone' },
              { name: 'CAC Services', href: '/services/cac' },
              { name: 'BVN Verification', href: '/services/bvn-verify' },
              { name: 'IPE Clearance (Instant)', href: '/services/ipe-clearance' },
              { name: 'Validation (Instant)', href: '/services/validation' },
              { name: 'Personalization', href: '/services/personalization' },
              { name: 'BVN Retrieval', href: '/services/bvn-retrieval' },
              { name: 'Self Service Unlink', href: '/services/self-service-unlink' },
              { name: 'Modifications', href: '/services/modifications' },
              { name: 'Birth Attestation', href: '/services/birth-attestation' },
              { name: 'TIN Certificate', href: '/services/tin' },
              { name: 'Newspaper Pub.', href: '/services/newspaper-pub' },
              { name: 'Slips History', href: '/history' },
              { name: 'Wallet Summary', href: '/wallet' },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center justify-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, Samuel 👋</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">₦511</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
              Add Funds
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}