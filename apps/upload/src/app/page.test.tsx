import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { QueryClientProvider } from '@/components/QueryClientProvider';

/**
 * A página passou a renderizar `UploadPage`, que usa React Query — em produção
 * o provider vem do `layout.tsx`, que não participa deste render isolado.
 */
function renderizarHome() {
  return render(
    <QueryClientProvider>
      <Home />
    </QueryClientProvider>,
  );
}

describe('Home', () => {
  it('renders the portal title', () => {
    renderizarHome();
    expect(screen.getByText('Portal de Upload')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    renderizarHome();
    expect(
      screen.getByText('Envie seus orçamentos para processamento.')
    ).toBeInTheDocument();
  });
});
