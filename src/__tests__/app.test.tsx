import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props;
    return <img src={src as string} alt={alt as string} {...rest} />;
  },
}));

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
    className: 'geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
    className: 'geist-mono',
  }),
}));

describe('App Pages', () => {
  it('home page renders without crashing', async () => {
    const Home = (await import('../app/page')).default;
    const { container } = render(<Home />);
    expect(container).toBeTruthy();
    // Should render the dashboard heading
    expect(screen.getByText('Dues Dashboard')).toBeInTheDocument();
    // Should render the dues table
    expect(screen.getByText('Rent')).toBeInTheDocument();
  });

  it('root layout exports metadata', async () => {
    const mod = await import('../app/layout');
    expect(mod.metadata).toBeDefined();
    expect(mod.metadata.title).toBe('Create Next App');
  });
});
