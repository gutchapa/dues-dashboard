import { describe, it, expect } from 'vitest';
import {
  getDues,
  getDuesById,
  getTotalPending,
  getDuesByStatus,
  addDues,
  markAsPaid,
  updateDues,
  deleteDues,
  resetToDefaults,
} from '@/lib/dues';

describe('dues data layer', () => {
  beforeEach(() => {
    resetToDefaults();
    localStorage.clear();
  });

  it('returns all dues entries', () => {
    const dues = getDues();
    expect(dues).toHaveLength(3);
  });

  it('finds a dues entry by id', () => {
    const entry = getDuesById('1');
    expect(entry).toBeDefined();
    expect(entry!.name).toBe('Rent');
  });

  it('returns undefined for unknown id', () => {
    expect(getDuesById('nonexistent')).toBeUndefined();
  });

  it('calculates total pending amount (pending + overdue)', () => {
    const total = getTotalPending();
    expect(total).toBe(1620); // 1500 (rent, pending) + 120 (electricity, overdue)
  });

  it('filters dues by status', () => {
    const paid = getDuesByStatus('paid');
    expect(paid).toHaveLength(1);
    expect(paid[0].name).toBe('Internet');
  });

  it('adds a new dues entry', () => {
    const newEntry = addDues({
      name: 'Water Bill',
      amount: 45,
      dueDate: '2026-07-15',
      status: 'pending',
      category: 'Utilities',
    });
    expect(newEntry.id).toBeTruthy();
    expect(newEntry.name).toBe('Water Bill');

    const allDues = getDues();
    expect(allDues).toHaveLength(4);
  });

  it('marks a pending entry as paid', () => {
    const result = markAsPaid('1');
    expect(result).toBe(true);

    const entry = getDuesById('1');
    expect(entry!.status).toBe('paid');
  });

  it('returns false when marking nonexistent entry as paid', () => {
    const result = markAsPaid('nonexistent');
    expect(result).toBe(false);
  });

  it('returns a copy of the dues store (immutable)', () => {
    const dues = getDues();
    dues.push({} as any);
    const duesAgain = getDues();
    expect(duesAgain.length).not.toBe(dues.length);
  });

  it('updates a dues entry fields', () => {
    const result = updateDues('1', { name: 'Apartment Rent', amount: 1600 });
    expect(result).toBe(true);
    const entry = getDuesById('1');
    expect(entry!.name).toBe('Apartment Rent');
    expect(entry!.amount).toBe(1600);
    // Unchanged fields preserved
    expect(entry!.status).toBeDefined();
  });

  it('returns false when updating nonexistent entry', () => {
    const result = updateDues('nonexistent', { name: 'Test' });
    expect(result).toBe(false);
  });

  it('deletes a dues entry', () => {
    const result = deleteDues('1');
    expect(result).toBe(true);
    const dues = getDues();
    expect(dues.find((d) => d.id === '1')).toBeUndefined();
  });

  it('returns false when deleting nonexistent entry', () => {
    const result = deleteDues('nonexistent');
    expect(result).toBe(false);
  });

  describe('persistence', () => {
    it('saves new entry to localStorage', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      addDues({ name: 'Persisted Bill', amount: 99, dueDate: '2026-09-01', status: 'pending' });

      expect(setItemSpy).toHaveBeenCalledWith(
        'dues-dashboard-data',
        expect.stringContaining('Persisted Bill')
      );

      setItemSpy.mockRestore();
    });

    it('persists after update', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      updateDues('1', { amount: 2000 });

      expect(setItemSpy).toHaveBeenCalledWith(
        'dues-dashboard-data',
        expect.stringContaining('"amount":2000')
      );

      setItemSpy.mockRestore();
    });

    it('persists after delete', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      deleteDues('1');

      expect(setItemSpy).toHaveBeenCalledWith('dues-dashboard-data', expect.any(String));

      setItemSpy.mockRestore();
    });

    it('exports resetToDefaults', () => {
      expect(typeof resetToDefaults).toBe('function');
    });
  });
});
