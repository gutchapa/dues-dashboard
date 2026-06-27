'use client';

import { useState } from 'react';
import { DuesStatus } from '@/lib/dues';

interface DuesFormData {
  name: string;
  amount: string;
  dueDate: string;
  category: string;
  notes: string;
}

interface DuesFormProps {
  onSubmit: (data: {
    name: string;
    amount: number;
    dueDate: string;
    status: DuesStatus;
    category?: string;
    notes?: string;
  }) => void;
}

interface FormErrors {
  name?: string;
  amount?: string;
  dueDate?: string;
}

export function DuesForm({ onSubmit }: DuesFormProps) {
  const [formData, setFormData] = useState<DuesFormData>({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount > 0';
    if (!formData.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      status: 'pending',
      category: formData.category.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    });

    setFormData({ name: '', amount: '', dueDate: '', category: '', notes: '' });
  }

  function setField(field: keyof DuesFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setField('name', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 ${
            errors.name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
          }`}
          placeholder="e.g. Rent"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Amount ($)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(e) => setField('amount', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 ${
            errors.amount ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
          }`}
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setField('dueDate', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 ${
            errors.dueDate ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
          }`}
        />
        {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Category (optional)
        </label>
        <input
          id="category"
          type="text"
          value={formData.category}
          onChange={(e) => setField('category', e.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="e.g. Utilities"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Add Dues Entry
      </button>
    </form>
  );
}
