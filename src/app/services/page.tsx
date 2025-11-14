// src/app/services/page.tsx
import { DashboardLayout } from '@/components/DashboardLayout';

export default function ServicesIndexPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Select a service from the sidebar to get started.
        </p>
      </div>
    </DashboardLayout>
  );
}