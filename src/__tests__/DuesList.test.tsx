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

    // Go through rows — paid entry row shouldn't have the button
    const rows = screen.getAllByRole('row');
    // The table has 4 rows: header + 3 data rows
    // Netflix (paid) row shouldn't contain 'Mark Paid'
    const netflixRow = rows[3];
    expect(netflixRow.textContent).not.toContain('Mark Paid');
  });

  it('calls onMarkPaid with entry id when clicked', () => {
    const onMarkPaid = vi.fn();
    render(<DuesList dues={sampleDues} onMarkPaid={onMarkPaid} />);

    fireEvent.click(screen.getAllByText('Mark Paid')[0]);
    expect(onMarkPaid).toHaveBeenCalledWith('1');
  });

  it('does not show Action column when onMarkPaid is not provided', () => {
    render(<DuesList dues={sampleDues} />);
    expect(screen.queryByText('Action')).not.toBeInTheDocument();
  });
});
