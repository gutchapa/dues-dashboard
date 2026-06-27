'use client';

import { DuesEntry } from '@/lib/dues';

interface DuesExportProps {
  dues: DuesEntry[];
}

function duesToCSV(dues: DuesEntry[]): string {
  const headers = ['Name', 'Amount', 'Due Date', 'Status', 'Category', 'Notes'];
  const rows = dues.map((d) =>
    [
      `"${d.name.replace(/"/g, '""')}"`,
      d.amount.toFixed(2),
      d.dueDate,
      d.status,
      d.category ? `"${d.category.replace(/"/g, '""')}"` : '',
      d.notes ? `"${d.notes.replace(/"/g, '""')}"` : '',
    ].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

function download(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DuesExport({ dues }: DuesExportProps) {
  function handleExportJSON() {
    download(JSON.stringify(dues, null, 2), 'dues-export.json', 'application/json');
  }

  function handleExportCSV() {
    download(duesToCSV(dues), 'dues-export.csv', 'text/csv');
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportJSON}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        Export JSON
      </button>
      <button
        onClick={handleExportCSV}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        Export CSV
      </button>
    </div>
  );
}
