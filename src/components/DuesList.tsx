'use client';

import { useState, useMemo } from 'react';
import { DuesEntry } from '@/lib/dues';

interface DuesListProps {
  dues: DuesEntry[];
  onMarkPaid?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

type SortKey = 'name' | 'amount' | 'dueDate' | 'status';
type SortDir = 'asc' | 'desc';

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusOrder: Record<string, number> = { pending: 0, overdue: 1, paid: 2 };

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function compareValues(a: DuesEntry, b: DuesEntry, key: SortKey): number {
  switch (key) {
    case 'name': return a.name.localeCompare(b.name);
    case 'amount': return a.amount - b.amount;
    case 'dueDate': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    case 'status': return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
  }
}

const columns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
];

export function DuesList({ dues, onMarkPaid, onDelete, onEdit }: DuesListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sortedDues = useMemo(() => {
    const sorted = [...dues].sort((a, b) => {
      const cmp = compareValues(a, b, sortKey);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [dues, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  if (dues.length === 0) {
    return <p className="text-zinc-500 italic">No dues entries found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`py-2 pr-4 font-medium cursor-pointer select-none hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors ${
                  sortKey === col.key ? 'text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
            <th className="py-2 pr-4 font-medium">Category</th>
            {onMarkPaid && <th className="py-2 font-medium">Pay</th>}
            {onEdit && <th className="py-2 font-medium"></th>}
            {onDelete && <th className="py-2 font-medium"></th>}
          </tr>
        </thead>
        <tbody>
          {sortedDues.map((entry) => (
            <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4">{entry.name}</td>
              <td className="py-2 pr-4">${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="py-2 pr-4">{formatDate(entry.dueDate)}</td>
              <td className="py-2 pr-4">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[entry.status]}`}>
                  {entry.status}
                </span>
              </td>
              <td className="py-2">{entry.category ?? '—'}</td>
              {onMarkPaid && (
                <td className="py-2">
                  {entry.status !== 'paid' && (
                    <button
                      onClick={() => onMarkPaid(entry.id)}
                      className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 hover:bg-green-200 transition-colors dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              )}
              {onEdit && (
                <td className="py-2 pr-1">
                  <button
                    onClick={() => onEdit(entry.id)}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 transition-colors dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    Edit
                  </button>
                </td>
              )}
              {onDelete && (
                <td className="py-2">
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
