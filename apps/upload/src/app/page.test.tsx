import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@/components/QueryClientProvider';
import Home from './page';

describe('Home', () => {
  it('renders the portal title', () => {
    render(
      <QueryClientProvider>
        <Home />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Portal de Upload')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(
      <QueryClientProvider>
        <Home />
      </QueryClientProvider>,
    );
    expect(
      screen.getByText('Envie seus orçamentos para processamento.')
    ).toBeInTheDocument();
  });
});
