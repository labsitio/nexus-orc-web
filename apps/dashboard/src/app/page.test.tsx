import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';
import { ORCAMENTOS_DEMO } from '@/demo-data/orcamentos';

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

  it('mostra o detalhe do primeiro orçamento de demonstração', () => {
    render(<Home />);

    expect(screen.getByTestId('orcamento-id')).toHaveTextContent(
      ORCAMENTOS_DEMO[0].orcamentoId
    );
    expect(screen.getAllByTestId('etapa-pipeline')).toHaveLength(
      ORCAMENTOS_DEMO[0].historico.length
    );
  });

  it('troca o detalhe exibido ao selecionar outro orçamento', async () => {
    const usuario = userEvent.setup();
    render(<Home />);

    const outro = ORCAMENTOS_DEMO[1];
    await usuario.click(
      screen.getByRole('button', {
        name: new RegExp(outro.resultadoAtual.fornecedorIdentificado, 'i'),
      })
    );

    expect(screen.getByTestId('orcamento-id')).toHaveTextContent(
      outro.orcamentoId
    );
    expect(screen.getAllByTestId('etapa-pipeline')).toHaveLength(
      outro.historico.length
    );
  });
});
