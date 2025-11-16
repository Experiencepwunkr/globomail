// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // 🔐 Simple: check if agent is "logged in" (e.g., via localStorage or API)
    // For now: just show content
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Agent Dashboard</h1>
      <p className="mt-2">Welcome! You’re logged in. 🎉</p>
      <button
        onClick={() => {
          // logout: clear session, redirect
          router.push('/login');
        }}
        className="mt-4 px-4 py-2 bg-gray-200 rounded"
      >
        Logout
      </button>
    </div>
  );
}