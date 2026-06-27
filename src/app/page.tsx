'use client';

import { useState } from 'react';
import { getDues, getTotalPending, DuesStatus } from '@/lib/dues';
import { DuesList } from '@/components/DuesList';
import { DuesFilter } from '@/components/DuesFilter';

const allDues = getDues();

export default function Home() {
  const [filter, setFilter] = useState<DuesStatus | 'all'>('all');

  const filteredDues = filter === 'all' ? allDues : allDues.filter((d) => d.status === filter);

  const counts: Record<string, number> = {
    all: allDues.length,
    pending: allDues.filter((d) => d.status === 'pending').length,
    overdue: allDues.filter((d) => d.status === 'overdue').length,
    paid: allDues.filter((d) => d.status === 'paid').length,
  };

  const totalPending = getTotalPending();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Dues Dashboard
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Track and manage your payments
          </p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Dues</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {allDues.length}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-600">
              ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Paid</p>
            <p className="text-2xl font-bold text-green-600">
              {allDues.filter((d) => d.status === 'paid').length}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <DuesFilter current={filter} counts={counts} onChange={setFilter} />
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {filter === 'all' ? 'All Dues' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Dues`}
            </h2>
          </div>
          <div className="p-4">
            <DuesList dues={filteredDues} />
          </div>
        </div>
      </div>
    </div>
  );
}
