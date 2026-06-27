'use client';

import { DuesEntry } from '@/lib/dues';

interface DuesListProps {
  dues: DuesEntry[];
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DuesList({ dues }: DuesListProps) {
  if (dues.length === 0) {
    return <p className="text-zinc-500 italic">No dues entries found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Amount</th>
            <th className="py-2 pr-4 font-medium">Due Date</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 font-medium">Category</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((entry) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
