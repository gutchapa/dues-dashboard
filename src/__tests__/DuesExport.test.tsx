import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DuesExport } from '@/components/DuesExport';
import { DuesEntry } from '@/lib/dues';

const sampleDues: DuesEntry[] = [
  { id: '1', name: 'Rent', amount: 1500, dueDate: '2026-07-01', status: 'pending', category: 'Housing' },
  { id: '2', name: 'Netflix', amount: 15.99, dueDate: '2026-06-28', status: 'paid' },
];

describe('DuesExport component', () => {
  it('renders export buttons', () => {
    render(<DuesExport dues={sampleDues} />);
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('triggers JSON download on click', () => {
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    const anchorProto = Object.getPrototypeOf(document.createElement('a'));
    vi.spyOn(anchorProto, 'click').mockImplementation(clickSpy);

    render(<DuesExport dues={sampleDues} />);
    fireEvent.click(screen.getByText('Export JSON'));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');

    vi.restoreAllMocks();
  });

  it('triggers CSV download on click', () => {
    const createObjectURL = vi.fn(() => 'blob:csv');
    URL.createObjectURL = createObjectURL;
    const revokeObjectURL = vi.fn();
    URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    const anchorProto = Object.getPrototypeOf(document.createElement('a'));
    vi.spyOn(anchorProto, 'click').mockImplementation(clickSpy);

    render(<DuesExport dues={sampleDues} />);
    fireEvent.click(screen.getByText('Export CSV'));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
