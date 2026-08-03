import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetalheOrcamento } from './DetalheOrcamento';
import { ORCAMENTOS_DEMO } from '@/demo-data/orcamentos';
import type { StatusIngestao } from '@/types/orcamento';

const orcamento: StatusIngestao = {
  orcamentoId: '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f',
  canal: 'PORTAL_WEB',
  status: 'CLASSIFICADO',
  resultadoAtual: {
    fornecedorIdentificado: 'Distribuidora ABC Ltda',
    formatoIdentificado: 'PDF_TABELA_PADRAO',
    nivelConfianca: 94,
    agenteOrigem: 'CLASSIFICADOR',
  },
  historico: [
    {
      agente: 'CLASSIFICADOR',
      ocorreuEm: '2026-08-03T17:00:30Z',
      resultado: {
        fornecedorIdentificado: 'Distribuidora ABC Ltda',
        formatoIdentificado: 'PDF_TABELA_PADRAO',
        nivelConfianca: 94,
        agenteOrigem: 'CLASSIFICADOR',
      },
      motivoInsucesso: null,
    },
  ],
};

describe('DetalheOrcamento', () => {
  it('exibe o identificador e o canal do orçamento', () => {
    render(<DetalheOrcamento orcamento={orcamento} />);

    expect(screen.getByTestId('orcamento-id')).toHaveTextContent(
      '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f',
    );
    expect(screen.getByText('Portal web')).toBeInTheDocument();
  });

  it('exibe o status atual', () => {
    render(<DetalheOrcamento orcamento={orcamento} />);

    const status = screen.getByTestId('status-orcamento');
    expect(status).toHaveTextContent('Classificado');
    expect(status).toHaveAttribute('data-status', 'CLASSIFICADO');
  });

  it('exibe os campos de resultadoAtual, incluindo o nível de confiança', () => {
    render(<DetalheOrcamento orcamento={orcamento} />);

    expect(screen.getByText('Distribuidora ABC Ltda')).toBeInTheDocument();
    expect(screen.getAllByText('PDF_TABELA_PADRAO').length).toBeGreaterThan(0);
    expect(screen.getByTestId('nivel-confianca')).toHaveTextContent('94%');
    expect(
      screen.getAllByText('Classificador de Fornecedor e Formato').length,
    ).toBeGreaterThan(0);
  });

  it('renderiza as etapas do pipeline a partir do histórico', () => {
    render(<DetalheOrcamento orcamento={orcamento} />);

    expect(screen.getByText('Etapas do pipeline')).toBeInTheDocument();
    expect(screen.getAllByTestId('etapa-pipeline')).toHaveLength(1);
  });

  it.each([
    ['VALIDADO_COM_RESSALVA', 'Validado com ressalva'],
    ['EXTRAIDO_COM_PENDENCIA_CONFIRMADA', 'Extraído com pendência confirmada'],
    ['FALHA_INDEXACAO', 'Falha na indexação'],
  ] as const)(
    'não apresenta %s como falha — é estado terminal válido',
    (status, rotulo) => {
      render(<DetalheOrcamento orcamento={{ ...orcamento, status }} />);

      const badge = screen.getByTestId('status-orcamento');
      expect(badge).toHaveTextContent(rotulo);
      expect(badge).toHaveAttribute('data-erro', 'false');
      expect(badge.className).not.toContain('red');
    },
  );

  it('apresenta FALHA_VALIDACAO como falha', () => {
    render(<DetalheOrcamento orcamento={{ ...orcamento, status: 'FALHA_VALIDACAO' }} />);

    const badge = screen.getByTestId('status-orcamento');
    expect(badge).toHaveTextContent('Falha na validação');
    expect(badge).toHaveAttribute('data-erro', 'true');
  });

  it('renderiza cada orçamento de demonstração sem alterar o dado de origem', () => {
    for (const demo of ORCAMENTOS_DEMO) {
      const { unmount } = render(<DetalheOrcamento orcamento={demo} />);
      expect(screen.getByTestId('orcamento-id')).toHaveTextContent(demo.orcamentoId);
      expect(screen.getAllByTestId('etapa-pipeline')).toHaveLength(
        demo.historico.length,
      );
      unmount();
    }
  });
});
