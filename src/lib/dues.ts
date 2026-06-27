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

const STORAGE_KEY = 'dues-dashboard-data';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function loadFromStorage(): DuesEntry[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DuesEntry[]) : null;
  } catch {
    return null;
  }
}

function saveToStorage(store: DuesEntry[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage might be full or disabled
  }
}

const DEFAULT_DUES: DuesEntry[] = [
  { id: '1', name: 'Rent', amount: 1500, dueDate: '2026-07-01', status: 'pending', category: 'Housing' },
  { id: '2', name: 'Electricity Bill', amount: 120, dueDate: '2026-06-15', status: 'overdue', category: 'Utilities' },
  { id: '3', name: 'Internet', amount: 60, dueDate: '2026-06-28', status: 'paid', category: 'Utilities' },
];

let duesStore: DuesEntry[] = loadFromStorage() ?? [...DEFAULT_DUES];

function persist(): void {
  saveToStorage(duesStore);
}

export function resetToDefaults(): void {
  duesStore = [...DEFAULT_DUES];
  persist();
}

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

export function getCategories(): string[] {
  const cats = new Set(duesStore.map((d) => d.category).filter((c): c is string => !!c));
  return [...cats].sort();
}

export function addDues(entry: Omit<DuesEntry, 'id'>): DuesEntry {
  const newEntry: DuesEntry = { ...entry, id: String(Date.now()) };
  duesStore = [...duesStore, newEntry];
  persist();
  return newEntry;
}

export function updateDues(id: string, updates: Partial<Omit<DuesEntry, 'id'>>): boolean {
  const entry = duesStore.find((d) => d.id === id);
  if (!entry) return false;
  Object.assign(entry, updates);
  persist();
  return true;
}

export function markAsPaid(id: string): boolean {
  return updateDues(id, { status: 'paid' });
}

export function deleteDues(id: string): boolean {
  const idx = duesStore.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  duesStore = [...duesStore.slice(0, idx), ...duesStore.slice(idx + 1)];
  persist();
  return true;
}

export function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = due.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export interface DueDateLabel {
  text: string;
  variant: 'overdue' | 'due-soon' | 'due-today' | 'future' | 'paid';
}

export function getDueDateLabel(entry: DuesEntry): DueDateLabel {
  if (entry.status === 'paid') {
    return { text: 'Paid', variant: 'paid' };
  }
  const days = daysUntilDue(entry.dueDate);
  if (days < 0) return { text: `Overdue by ${Math.abs(days)}d`, variant: 'overdue' };
  if (days === 0) return { text: 'Due today', variant: 'due-today' };
  if (days <= 3) return { text: `Due in ${days}d`, variant: 'due-soon' };
  return { text: `${days}d left`, variant: 'future' };
}
