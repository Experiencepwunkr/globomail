// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Transaction = {
  id: string;
  serviceType: string;
  status: string;
  createdAt: string;
  agent: { name: string; email: string };
  metadata: any;
  result: any | null;
};

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string, result?: any) => {
    await fetch(`/api/admin/transactions/${id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, result }),
    });
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status, result: result || t.result } : t
    ));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Review and process agent submissions</p>
      </header>

      <div className="space-y-6">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{tx.serviceType}</h3>
                <p className="text-gray-400">Agent: {tx.agent.name} ({tx.agent.email})</p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                tx.status === 'completed' ? 'bg-green-800 text-green-300' :
                tx.status === 'failed' ? 'bg-red-800 text-red-300' :
                'bg-yellow-800 text-yellow-300'
              }`}>
                {tx.status}
              </span>
            </div>

            <details className="mb-4">
              <summary className="cursor-pointer text-blue-400">▶ Client Data</summary>
              <pre className="mt-2 text-xs bg-gray-700 p-3 rounded overflow-auto">
                {JSON.stringify(tx.metadata, null, 2)}
              </pre>
            </details>

            {tx.result && (
              <details className="mb-4">
                <summary className="cursor-pointer text-green-400">▶ Result / Deliverables</summary>
                <pre className="mt-2 text-xs bg-gray-700 p-3 rounded overflow-auto">
                  {JSON.stringify(tx.result, null, 2)}
                </pre>
              </details>
            )}

            {tx.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(tx.id, 'processing')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Start Processing
                </button>
                <button
                  onClick={() => updateStatus(tx.id, 'failed', { 
                    success: false, 
                    message: "Could not verify. Invalid data." 
                  })}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  Mark Failed
                </button>
              </div>
            )}

            {tx.status === 'processing' && (
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(tx.id, 'completed', {
                    success: true,
                    message: "NIN verified successfully.",
                    fileUrls: ["/uploads/nin_12345.pdf"],
                  })}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  Mark Completed & Upload
                </button>
                <button
                  onClick={() => updateStatus(tx.id, 'failed', { 
                    success: false, 
                    message: "System timeout. Try again later." 
                  })}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  Mark Failed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}