'use client';

import { useState, useCallback } from 'react';
import { getDues, getDuesById, getTotalPending, getCategories, addDues, updateDues, markAsPaid, deleteDues, DuesStatus, DuesEntry } from '@/lib/dues';
import { DuesList } from '@/components/DuesList';
import { DuesFilter } from '@/components/DuesFilter';
import { DuesForm } from '@/components/DuesForm';
import { DuesSearch } from '@/components/DuesSearch';
import { DuesExport } from '@/components/DuesExport';
import { CategoryFilter } from '@/components/CategoryFilter';

function loadDues(): DuesEntry[] {
  try { return getDues(); } catch { return []; }
}

export default function Home() {
  const [filter, setFilter] = useState<DuesStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [allDues, setAllDues] = useState<DuesEntry[]>(loadDues);

  const statusFiltered = filter === 'all' ? allDues : allDues.filter((d) => d.status === filter);
  const categoryFiltered = categoryFilter
    ? statusFiltered.filter((d) => d.category === categoryFilter)
    : statusFiltered;
  const filteredDues = searchQuery
    ? categoryFiltered.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoryFiltered;

  const counts: Record<string, number> = {
    all: allDues.length,
    pending: allDues.filter((d) => d.status === 'pending').length,
    overdue: allDues.filter((d) => d.status === 'overdue').length,
    paid: allDues.filter((d) => d.status === 'paid').length,
  };

  const totalPending = getTotalPending();

  const handleAddDues = useCallback((data: { name: string; amount: number; dueDate: string; status: DuesStatus; category?: string; notes?: string }) => {
    const newEntry = addDues(data);
    setAllDues(getDues());
    setShowForm(false);
  }, []);

  const handleMarkPaid = useCallback((id: string) => {
    markAsPaid(id);
    setAllDues(getDues());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteDues(id);
    setAllDues(getDues());
  }, []);

  const editingEntry = editingId ? getDuesById(editingId) ?? undefined : undefined;

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
    setShowForm(false);
  }, []);

  const handleUpdate = useCallback((data: { name: string; amount: number; dueDate: string; status: DuesStatus; category?: string; notes?: string }) => {
    if (!editingId) return;
    updateDues(editingId, data);
    setAllDues(getDues());
    setEditingId(null);
  }, [editingId]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

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

        <div className="mb-4 flex items-center justify-between gap-4">
          <DuesFilter current={filter} counts={counts} onChange={setFilter} />
          <button
            onClick={() => setShowForm(!showForm)}
            className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Dues'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">New Dues Entry</h3>
            <DuesForm onSubmit={handleAddDues} />
          </div>
        )}

        {editingEntry && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Edit Dues Entry</h3>
              <button
                onClick={handleCancelEdit}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
            </div>
            <DuesForm onSubmit={handleUpdate} initialData={editingEntry} />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <DuesSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <CategoryFilter
            categories={getCategories()}
            selected={categoryFilter}
            onChange={setCategoryFilter}
          />
          <DuesExport dues={allDues} />
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {filter === 'all' ? 'All Dues' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Dues`}
            </h2>
          </div>
          <div className="p-4">
            <DuesList dues={filteredDues} onMarkPaid={handleMarkPaid} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}
