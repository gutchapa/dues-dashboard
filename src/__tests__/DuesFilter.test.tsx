import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DuesFilter } from '@/components/DuesFilter';

describe('DuesFilter component', () => {
  const counts = { all: 3, pending: 1, overdue: 1, paid: 1 };

  it('renders all filter tabs', () => {
    const onChange = vi.fn();
    render(<DuesFilter current="all" counts={counts} onChange={onChange} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<DuesFilter current="all" counts={counts} onChange={onChange} />);

    fireEvent.click(screen.getByText('Pending'));
    expect(onChange).toHaveBeenCalledWith('pending');
  });

  it('shows counts as badges', () => {
    const onChange = vi.fn();
    render(<DuesFilter current="all" counts={counts} onChange={onChange} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    const ones = screen.getAllByText('1');
    expect(ones.length).toBe(3); // pending, overdue, paid each have count 1
  });

  it('highlights the active tab', () => {
    const onChange = vi.fn();
    const { container } = render(<DuesFilter current="overdue" counts={counts} onChange={onChange} />);

    const activeTab = screen.getByText('Overdue');
    expect(activeTab.className).toContain('shadow-sm');
  });
});
