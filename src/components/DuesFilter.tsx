'use client';

import { DuesStatus } from '@/lib/dues';

interface DuesFilterProps {
  current: DuesStatus | 'all';
  counts: Record<string, number>;
  onChange: (status: DuesStatus | 'all') => void;
}

const tabs: { key: DuesStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'paid', label: 'Paid' },
];

export function DuesFilter({ current, counts, onChange }: DuesFilterProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            current === tab.key
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
          }`}
        >
          {tab.label}
          {counts[tab.key] > 0 && (
            <span className="ml-1.5 rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-600">
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
