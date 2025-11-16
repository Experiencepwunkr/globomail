// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAgent } from '@/lib/auth';

const services = [
  {
    id: 'nin',
    name: 'NIN Verification',
    icon: '/icons/nin.svg',
    path: '/services/nin',
  },
  {
    id: 'nin-with-phone',
    name: 'NIN With Phone',
    icon: '/icons/phone.svg',
    path: '/services/nin-with-phone',
  },
  {
    id: 'cac',
    name: 'CAC Services',
    icon: '/icons/cac.svg',
    path: '/services/cac',
  },
  {
    id: 'bvn-verification',
    name: 'BVN Verification',
    icon: '/icons/bvn.svg',
    path: '/services/bvn-verify',
  },
  {
    id: 'bvn-retrieval',
    name: 'BVN Retrieval',
    icon: '/icons/bvn.svg',
    path: '/services/bvn-retrieval',
  },
  {
    id: 'ipe-clearance',
    name: 'IPE Clearance (Instant)',
    icon: '/icons/ipe.svg',
    path: '/services/ipe-clearance',
  },
  {
    id: 'validation',
    name: 'Validation (Instant)',
    icon: '/icons/valid.svg',
    path: '/services/validation',
  },
  {
    id: 'personalization',
    name: 'Personalization',
    icon: '/icons/pers.svg',
    path: '/services/personalization',
  },
  {
    id: 'self-service-unlink',
    name: 'Self Service Unlink',
    icon: '/icons/unlink.svg',
    path: '/services/self-service-unlink',
  },
  {
    id: 'modifications',
    name: 'Modifications',
    icon: '/icons/mod.svg',
    path: '/services/modifications',
  },
  {
    id: 'birth-attestation',
    name: 'Birth Attestation',
    icon: '/icons/birth.svg',
    path: '/services/birth-attestation',
  },
  {
    id: 'tin',
    name: 'TIN Certificate',
    icon: '/icons/tin.svg',
    path: '/services/tin',
  },
  {
    id: 'newspaper-pub',
    name: 'Newspaper Pub.',
    icon: '/icons/news.svg',
    path: '/services/newspaper-pub',
  },
];

export default function DashboardPage() {
  const [agent, setAgent] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedAgent = getAgent();
    if (!storedAgent) {
      router.push('/login');
      return;
    }
    setAgent(storedAgent);

    // Fetch requests
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/agents/me/requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else if (res.status === 401) {
          clearAgent();
          router.push('/login');
        }
      } catch (err) {
        console.error('Fetch requests failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    // Optional: poll every 30s for status updates
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    // Clear session (for now, just redirect)
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

  // Status badge helper
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agent Dashboard</h1>
          <p className="text-gray-400">Welcome back, {agent.name}!</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-blue-600 px-3 py-1.5 rounded-full text-sm font-medium">
            Wallet: ₦{agent.walletBalance.toFixed(2)}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Requests Section */}
      {requests.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
          <div className="space-y-3">
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <span className="font-medium">{req.serviceType}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString()}{' '}
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                {req.result?.message && (
                  <p className="mt-2 text-sm text-gray-300">{req.result.message}</p>
                )}
                {req.result?.fileUrls?.length > 0 && (
                  <div className="mt-2">
                    {req.result.fileUrls.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-blue-400 hover:underline text-sm"
                      >
                        📄 Download Result {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {requests.length > 5 && (
              <button
                onClick={() => router.push('/dashboard/requests')}
                className="text-blue-400 hover:underline text-sm"
              >
                View all {requests.length} requests →
              </button>
            )}
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
              className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition group"
            >
              {/* Icon */}
              {service.icon.endsWith('.svg') ? (
                <Image
                  src={service.icon}
                  alt={service.name}
                  width={40}
                  height={40}
                  className="mb-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const span = document.createElement('span');
                    span.textContent = service.id === 'nin' ? '👤' :
                                     service.id === 'nin-with-phone' ? '📱+👤' :
                                     service.id === 'cac' ? '🏢' :
                                     service.id === 'bvn-verification' ? '🆔' :
                                     service.id === 'bvn-retrieval' ? '🔍' :
                                     service.id === 'ipe-clearance' ? '👮' :
                                     service.id === 'validation' ? '✅' :
                                     service.id === 'personalization' ? '🎨' :
                                     service.id === 'self-service-unlink' ? '🔗' :
                                     service.id === 'modifications' ? '✏️' :
                                     service.id === 'birth-attestation' ? '👶' :
                                     service.id === 'tin' ? '🧾' :
                                     service.id === 'newspaper-pub' ? '📰' : '❓';
                    span.className = 'text-2xl';
                    target.parentNode?.appendChild(span);
                  }}
                />
              ) : (
                <span className="text-2xl mb-2">
                  {service.id === 'nin' ? '👤' :
                   service.id === 'nin-with-phone' ? '📱+👤' :
                   service.id === 'cac' ? '🏢' :
                   service.id === 'bvn-verification' ? '🆔' :
                   service.id === 'bvn-retrieval' ? '🔍' :
                   service.id === 'ipe-clearance' ? '👮' :
                   service.id === 'validation' ? '✅' :
                   service.id === 'personalization' ? '🎨' :
                   service.id === 'self-service-unlink' ? '🔗' :
                   service.id === 'modifications' ? '✏️' :
                   service.id === 'birth-attestation' ? '👶' :
                   service.id === 'tin' ? '🧾' :
                   service.id === 'newspaper-pub' ? '📰' : '❓'}
                </span>
              )}

              {/* Name */}
              <span className="text-center text-sm text-gray-200 group-hover:text-white">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2025 Globomail. All rights reserved.
      </footer>
    </div>
  );
}