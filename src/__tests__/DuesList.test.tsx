import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DuesList } from '@/components/DuesList';
import { DuesEntry } from '@/lib/dues';

const sampleDues: DuesEntry[] = [
  { id: '1', name: 'Rent', amount: 1500, dueDate: '2026-07-01', status: 'pending', category: 'Housing' },
  { id: '2', name: 'Electricity', amount: 120, dueDate: '2026-06-15', status: 'overdue', category: 'Utilities' },
  { id: '3', name: 'Netflix', amount: 15.99, dueDate: '2026-06-28', status: 'paid' },
];

describe('DuesList component', () => {
  it('renders a table with all entries', () => {
    render(<DuesList dues={sampleDues} />);
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('displays formatted amounts', () => {
    render(<DuesList dues={sampleDues} />);
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  it('shows status badges', () => {
    render(<DuesList dues={sampleDues} />);
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('overdue')).toBeInTheDocument();
    expect(screen.getByText('paid')).toBeInTheDocument();
  });

  it('shows empty state when no dues', () => {
    render(<DuesList dues={[]} />);
    expect(screen.getByText(/no dues entries found/i)).toBeInTheDocument();
  });

  it('shows Mark Paid buttons when onMarkPaid is provided', () => {
    const onMarkPaid = vi.fn();
    render(<DuesList dues={sampleDues} onMarkPaid={onMarkPaid} />);

    // Pending and overdue entries should have the button
    const buttons = screen.getAllByText('Mark Paid');
    expect(buttons).toHaveLength(2); // Rent (pending) + Electricity (overdue)
  });

  it('does not show Mark Paid button for paid entries', () => {
    const onMarkPaid = vi.fn();
    render(<DuesList dues={sampleDues} onMarkPaid={onMarkPaid} />);

    const rows = screen.getAllByRole('row');
    // Default sort is dueDate asc: Electricity(6/15), Netflix(6/28), Rent(7/1)
    // Netflix row (index 2, 0-indexed: 0=header, 1=Electricity, 2=Netflix, 3=Rent)
    expect(rows[2].textContent).toContain('Netflix');
    expect(rows[2].textContent).not.toContain('Mark Paid');
  });

  it('calls onMarkPaid with entry id when clicked', () => {
    const onMarkPaid = vi.fn();
    render(<DuesList dues={sampleDues} onMarkPaid={onMarkPaid} />);

    // First Mark Paid button is for Electricity (id: 2) — sorted by dueDate asc
    fireEvent.click(screen.getAllByText('Mark Paid')[0]);
    expect(onMarkPaid).toHaveBeenCalledWith('2');
  });

  it('does not show Pay column when onMarkPaid is not provided', () => {
    render(<DuesList dues={sampleDues} />);
    expect(screen.queryByText('Pay')).not.toBeInTheDocument();
  });

  it('shows delete buttons when onDelete is provided', () => {
    const onDelete = vi.fn();
    render(<DuesList dues={sampleDues} onDelete={onDelete} />);

    const buttons = screen.getAllByText('Delete');
    expect(buttons).toHaveLength(3);
  });

  it('calls onDelete with entry id when clicked', () => {
    const onDelete = vi.fn();
    render(<DuesList dues={sampleDues} onDelete={onDelete} />);

    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(onDelete).toHaveBeenCalledWith('2'); // first entry sorted by dueDate asc
  });

  describe('sorting', () => {
    it('shows sort indicators on column headers', () => {
      render(<DuesList dues={sampleDues} />);
      const nameHeader = screen.getByText('Name');
      const amountHeader = screen.getByText('Amount');
      const dateHeader = screen.getByText('Due Date');
      const statusHeader = screen.getByText('Status');

      expect(nameHeader).toBeInTheDocument();
      expect(amountHeader).toBeInTheDocument();
      expect(dateHeader).toBeInTheDocument();
      expect(statusHeader).toBeInTheDocument();
    });

    it('sorts by amount ascending when clicking Amount header', () => {
      render(<DuesList dues={sampleDues} />);

      fireEvent.click(screen.getByText('Amount'));

      const rows = screen.getAllByRole('row');
      // After sort asc by amount: Netflix($15.99), Electricity($120), Rent($1500)
      expect(rows[1].textContent).toContain('Netflix');
      expect(rows[2].textContent).toContain('Electricity');
      expect(rows[3].textContent).toContain('Rent');
    });

    it('reverses sort order when clicking same header twice', () => {
      render(<DuesList dues={sampleDues} />);

      fireEvent.click(screen.getByText('Amount'));
      fireEvent.click(screen.getByText('Amount'));

      const rows = screen.getAllByRole('row');
      // After sort desc by amount: Rent($1500), Electricity($120), Netflix($15.99)
      expect(rows[1].textContent).toContain('Rent');
      expect(rows[3].textContent).toContain('Netflix');
    });

    it('sorts by name alphabetically', () => {
      render(<DuesList dues={sampleDues} />);

      fireEvent.click(screen.getByText('Name'));

      const rows = screen.getAllByRole('row');
      expect(rows[1].textContent).toContain('Electricity');
      expect(rows[2].textContent).toContain('Netflix');
      expect(rows[3].textContent).toContain('Rent');
    });

    it('shows sort arrow on active column (default: Due Date asc)', () => {
      render(<DuesList dues={sampleDues} />);
      expect(screen.getByText('▲')).toBeInTheDocument();
    });

    it('shows descending arrow after second click', () => {
      render(<DuesList dues={sampleDues} />);
      fireEvent.click(screen.getByText('Due Date'));
      expect(screen.getByText('▼')).toBeInTheDocument();
    });
  });
});
