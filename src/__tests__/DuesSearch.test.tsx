import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DuesSearch } from '@/components/DuesSearch';

describe('DuesSearch component', () => {
  it('renders the search input', () => {
    const onChange = vi.fn();
    render(<DuesSearch value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search dues/i);
    expect(input).toBeInTheDocument();
  });

  it('displays the current value', () => {
    const onChange = vi.fn();
    render(<DuesSearch value="Rent" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search dues/i) as HTMLInputElement;
    expect(input.value).toBe('Rent');
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<DuesSearch value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search dues/i);
    fireEvent.change(input, { target: { value: 'Water' } });
    expect(onChange).toHaveBeenCalledWith('Water');
  });
});
