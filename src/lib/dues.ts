export type DuesStatus = 'paid' | 'pending' | 'overdue';

export interface DuesEntry {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO date string
  status: DuesStatus;
  category?: string;
  notes?: string;
}

let duesStore: DuesEntry[] = [
  {
    id: '1',
    name: 'Rent',
    amount: 1500,
    dueDate: '2026-07-01',
    status: 'pending',
    category: 'Housing',
  },
  {
    id: '2',
    name: 'Electricity Bill',
    amount: 120,
    dueDate: '2026-06-15',
    status: 'overdue',
    category: 'Utilities',
  },
  {
    id: '3',
    name: 'Internet',
    amount: 60,
    dueDate: '2026-06-28',
    status: 'paid',
    category: 'Utilities',
  },
];

export function getDues(): DuesEntry[] {
  return [...duesStore];
}

export function getDuesById(id: string): DuesEntry | undefined {
  return duesStore.find((d) => d.id === id);
}

export function getTotalPending(): number {
  return duesStore
    .filter((d) => d.status === 'pending' || d.status === 'overdue')
    .reduce((sum, d) => sum + d.amount, 0);
}

export function getDuesByStatus(status: DuesStatus): DuesEntry[] {
  return duesStore.filter((d) => d.status === status);
}

export function addDues(entry: Omit<DuesEntry, 'id'>): DuesEntry {
  const newEntry: DuesEntry = {
    ...entry,
    id: String(Date.now()),
  };
  duesStore = [...duesStore, newEntry];
  return newEntry;
}

export function markAsPaid(id: string): boolean {
  const entry = duesStore.find((d) => d.id === id);
  if (!entry) return false;
  entry.status = 'paid';
  return true;
}
