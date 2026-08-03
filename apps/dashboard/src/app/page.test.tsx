import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders the dashboard title', () => {
    render(<Home />);
    expect(screen.getByText('Painel de Acompanhamento')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<Home />);
    expect(
      screen.getByText(
        'Acompanhe o ciclo de vida completo de seus orçamentos.'
      )
    ).toBeInTheDocument();
  });
});
