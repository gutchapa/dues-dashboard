import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CategoryFilter } from '@/components/CategoryFilter';

describe('CategoryFilter component', () => {
  const categories = ['Housing', 'Transport', 'Utilities'];

  it('renders dropdown with All Categories option', () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={categories} selected={null} onChange={onChange} />);

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Housing')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Utilities')).toBeInTheDocument();
  });

  it('shows selected category', () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={categories} selected="Utilities" onChange={onChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Utilities');
  });

  it('calls onChange with selected category', () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={categories} selected={null} onChange={onChange} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Housing' } });
    expect(onChange).toHaveBeenCalledWith('Housing');
  });

  it('calls onChange with null when All selected', () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={categories} selected="Housing" onChange={onChange} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('returns null when no categories', () => {
    const { container } = render(<CategoryFilter categories={[]} selected={null} onChange={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });
});
