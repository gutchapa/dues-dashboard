import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DuesForm } from '@/components/DuesForm';

describe('DuesForm component', () => {
  it('renders all form fields', () => {
    const onSubmit = vi.fn();
    render(<DuesForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount ($)')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Category (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Dues Entry' })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', () => {
    const onSubmit = vi.fn();
    render(<DuesForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Dues Entry' }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid amount > 0')).toBeInTheDocument();
    expect(screen.getByText('Due date is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', () => {
    const onSubmit = vi.fn();
    render(<DuesForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Water Bill' } });
    fireEvent.change(screen.getByLabelText('Amount ($)'), { target: { value: '45.50' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-07-15' } });
    fireEvent.change(screen.getByLabelText('Category (optional)'), { target: { value: 'Utilities' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add Dues Entry' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Water Bill',
      amount: 45.5,
      dueDate: '2026-07-15',
      status: 'pending',
      category: 'Utilities',
      notes: undefined,
    });
  });

  it('clears form after successful submission', () => {
    const onSubmit = vi.fn();
    render(<DuesForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Amount ($)'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-08-01' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add Dues Entry' }));

    expect(nameInput.value).toBe('');
  });

  it('clears individual field errors on input change', () => {
    const onSubmit = vi.fn();
    render(<DuesForm onSubmit={onSubmit} />);

    // Submit empty to trigger errors
    fireEvent.click(screen.getByRole('button', { name: 'Add Dues Entry' }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    // Start typing — error should disappear
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Rent' } });
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  describe('edit mode', () => {
    const editData = {
      id: '5',
      name: 'Existing Bill',
      amount: 200,
      dueDate: '2026-08-01',
      status: 'pending' as const,
      category: 'Utilities',
    };

    it('pre-fills form with initial data', () => {
      const onSubmit = vi.fn();
      render(<DuesForm onSubmit={onSubmit} initialData={editData} />);

      const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const amountInput = screen.getByLabelText('Amount ($)') as HTMLInputElement;

      expect(nameInput.value).toBe('Existing Bill');
      expect(amountInput.value).toBe('200');
    });

    it('shows Save Changes button in edit mode', () => {
      const onSubmit = vi.fn();
      render(<DuesForm onSubmit={onSubmit} initialData={editData} />);

      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.queryByText('Add Dues Entry')).not.toBeInTheDocument();
    });

    it('submits with edited values', () => {
      const onSubmit = vi.fn();
      render(<DuesForm onSubmit={onSubmit} initialData={editData} />);

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'Updated Bill' } });
      fireEvent.click(screen.getByText('Save Changes'));

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated Bill',
        amount: 200,
      }));
    });

    it('preserves original status on edit submit', () => {
      const onSubmit = vi.fn();
      render(<DuesForm onSubmit={onSubmit} initialData={editData} />);

      fireEvent.click(screen.getByText('Save Changes'));

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        status: 'pending',
      }));
    });
  });
});
