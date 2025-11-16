// src/app/page.tsx
'use client';

import Link from 'next/link';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Hero */}
      <header className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Globomail — Agent Portal</h1>
        <p className="text-xl text-gray-300 mb-8">
          The fastest way to process NIN, BVN, CAC, IPE, TIN, and more for your clients.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
          >
            Register as Agent
          </Link>
        </div>
      </header>

      {/* Services Preview */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'NIN Verification', price: '₦160', icon: '👤' },
            { name: 'BVN Retrieval', price: '₦1,300', icon: '📱' },
            { name: 'CAC Registration', price: '₦64,000', icon: '🏢' },
            { name: 'IPE Clearance', price: '₦950', icon: '👮' },
            { name: 'TIN Certificate', price: '₦2,000', icon: '🧾' },
            { name: 'Newspaper Pub.', price: '₦10,000', icon: '📰' },
          ].map((service) => (
            <div key={service.name} className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-yellow-400 font-bold">{service.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 text-sm">
        © 2025 Globomail. All rights reserved.
      </footer>
    </div>
  );
}