/**
 * Dashboard Page
 * Integrates the DashboardStatsContainer with error handling
 */

'use client';

import { DashboardStatsContainer } from '@/components/dashboard/DashboardStatsContainer';
import { toast } from 'sonner';

export default function DashboardPage() {
  // Error handler callback - injected into the container
  const handleError = (error: Error) => {
    toast.error('Failed to load dashboard data', {
      description: error.message,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Overview of your key metrics and statistics
          </p>
        </div>

        {/* Stats Section */}
        <DashboardStatsContainer onError={handleError} />
      </div>
    </div>
  );
}
