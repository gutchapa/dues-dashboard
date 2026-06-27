import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
