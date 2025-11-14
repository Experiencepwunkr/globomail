// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ServiceTile } from '@/components/ServiceTile';

export default function HomePage() {
  const router = useRouter();

  // 🔐 TEMPORARY: Simulate "not logged in" state
  // Later: replace with real auth check (e.g., useSession(), cookies, etc.)
  const isLoggedIn = false; // ← Change to `true` to see dashboard

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  // ✅ Dashboard content (your existing UI)
  const services = [
    { icon: 'N', title: 'NIN Verification', desc: 'Verify National ID Number', href: '/services/nin' },
    { icon: 'P', title: 'NIN With Phone', desc: 'Verify NIN using phone number', href: '/services/nin-with-phone' },
    { icon: 'C', title: 'CAC Services', desc: 'Register or check business status', href: '/services/cac' },
    { icon: 'B', title: 'BVN Verification', desc: 'Verify Bank Verification Number', href: '/services/bvn-verify' },
    { icon: 'I', title: 'IPE Clearance (Instant)', desc: 'Instant IPE clearance service', href: '/services/ipe-clearance' },
    { icon: 'V', title: 'Validation (Instant)', desc: 'Instant document validation', href: '/services/validation' },
    { icon: 'R', title: 'Personalization', desc: 'Customize your profile details', href: '/services/personalization' },
    { icon: 'R', title: 'BVN Retrieval', desc: 'Retrieve lost BVN', href: '/services/bvn-retrieval' },
    { icon: 'U', title: 'Self Service Unlink', desc: 'Unlink accounts yourself', href: '/services/self-service-unlink' },
    { icon: 'M', title: 'Modifications', desc: 'Update existing records', href: '/services/modifications' },
    { icon: 'A', title: 'Birth Attestation', desc: 'Get birth certificate attestation', href: '/services/birth-attestation' },
    { icon: 'T', title: 'TIN Certificate', desc: 'Get Tax Identification Number', href: '/services/tin' },
    { icon: 'N', title: 'Newspaper Pub.', desc: 'Publish notice in newspaper', href: '/services/newspaper-pub' },
    { icon: 'S', title: 'Slips History', desc: 'View past transaction slips', href: '/history' },
    { icon: 'W', title: 'Wallet Summary', desc: 'View wallet balance & transactions', href: '/wallet' },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Access</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <ServiceTile
              key={idx}
              icon={service.icon}
              title={service.title}
              description={service.desc}
              href={service.href}
            />
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-gray-500 dark:text-gray-400">No recent transactions.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}