import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders the portal title', () => {
    render(<Home />);
    expect(screen.getByText('Portal de Upload')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<Home />);
    expect(
      screen.getByText('Envie seus orçamentos para processamento.')
    ).toBeInTheDocument();
  });
});
