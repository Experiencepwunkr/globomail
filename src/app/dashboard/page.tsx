// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
  const [agent, setAgent] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get agent from localStorage (your auth system)
    const agentStr = typeof window !== 'undefined' ? localStorage.getItem('agent') : null;
    if (!agentStr) {
      router.push('/login');
      return;
    }
    const agentData = JSON.parse(agentStr);
    setAgent(agentData);

    // Fetch requests
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/agents/me/requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else if (res.status === 401) {
          localStorage.removeItem('agent');
          router.push('/login');
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('agent');
    router.push('/login');
  };

  if (!agent || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const classes = {
      pending: 'bg-yellow-800 text-yellow-300',
      processing: 'bg-blue-800 text-blue-300',
      completed: 'bg-green-800 text-green-300',
      failed: 'bg-red-800 text-red-300',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${classes[status as keyof typeof classes] || 'bg-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const services = [
    { id: 'nin', name: 'NIN Verification', icon: '👤', path: '/services/nin' },
    { id: 'nin-with-phone', name: 'NIN With Phone', icon: '📱+👤', path: '/services/nin-with-phone' },
    { id: 'cac', name: 'CAC Services', icon: '🏢', path: '/services/cac' },
    { id: 'bvn-retrieval', name: 'BVN Retrieval', icon: '🔍', path: '/services/bvn-retrieval' },
    { id: 'ipe-clearance', name: 'IPE Clearance', icon: '👮', path: '/services/ipe-clearance' },
    { id: 'validation', name: 'Validation', icon: '✅', path: '/services/validation' },
    { id: 'personalization', name: 'Personalization', icon: '🎨', path: '/services/personalization' },
    { id: 'self-service-unlink', name: 'Unlink', icon: '🔗', path: '/services/self-service-unlink' },
    { id: 'modifications', name: 'Modifications', icon: '✏️', path: '/services/modifications' },
    { id: 'birth-attestation', name: 'Birth Attest.', icon: '👶', path: '/services/birth-attestation' },
    { id: 'tin', name: 'TIN Certificate', icon: '🧾', path: '/services/tin' },
    { id: 'newspaper-pub', name: 'News Pub.', icon: '📰', path: '/services/newspaper-pub' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agent Dashboard</h1>
          <p className="text-gray-400">Welcome back, {agent.name}!</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-blue-600 px-3 py-1.5 rounded-full text-sm font-medium">
            Wallet: ₦{(agent.walletBalance || 0).toFixed(2)}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Requests */}
      {requests.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
          <div className="space-y-3">
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="font-medium">{req.serviceType}</span>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
                {req.result?.message && (
                  <p className="mt-2 text-sm">{req.result.message}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.path}
              className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition"
            >
              <span className="text-2xl mb-2">{service.icon}</span>
              <span className="text-center text-sm">{service.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-12 pt-6 text-center text-gray-500 text-sm border-t border-gray-800">
        © 2025 Globomail
      </footer>
    </div>
  );
}