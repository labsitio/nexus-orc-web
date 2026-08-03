import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EtapasPipeline } from './EtapasPipeline';
import type { EntradaHistorico } from '@/types/orcamento';

function entrada(
  agente: EntradaHistorico['agente'],
  ocorreuEm: string,
  motivoInsucesso: string | null,
  nivelConfianca = 90,
): EntradaHistorico {
  return {
    agente,
    ocorreuEm,
    resultado: {
      fornecedorIdentificado: 'Distribuidora ABC Ltda',
      formatoIdentificado: 'PDF_TABELA_PADRAO',
      nivelConfianca,
      agenteOrigem: agente,
    },
    motivoInsucesso,
  };
}

const historico: EntradaHistorico[] = [
  entrada('CLASSIFICADOR', '2026-08-03T17:00:30Z', null, 94),
  entrada('EXTRATOR', '2026-08-03T17:01:12Z', 'Coluna de preço ausente na primeira passagem.', 58),
  entrada('VALIDADOR', '2026-08-03T17:01:48Z', null, 97),
];

describe('EtapasPipeline', () => {
  it('renderiza uma entrada por item do histórico, na ordem recebida', () => {
    render(<EtapasPipeline historico={historico} />);

    const etapas = screen.getAllByTestId('etapa-pipeline');
    expect(etapas).toHaveLength(3);
    expect(etapas[0]).toHaveTextContent('1. Classificador de Fornecedor e Formato');
    expect(etapas[1]).toHaveTextContent('2. Extrator de Dados');
    expect(etapas[2]).toHaveTextContent('3. Validador de Consistência');
  });

  it('exibe o momento em horário local preservando o valor UTC do dado', () => {
    render(<EtapasPipeline historico={[historico[0]]} />);

    const momento = screen.getByText(
      new Date('2026-08-03T17:00:30Z').toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    );
    expect(momento).toBeInTheDocument();
    expect(momento).toHaveAttribute('datetime', '2026-08-03T17:00:30Z');
  });

  it('mostra o nível de confiança e o formato de cada etapa', () => {
    render(<EtapasPipeline historico={[historico[0]]} />);

    expect(screen.getByText(/Confiança: 94%/)).toBeInTheDocument();
    expect(screen.getByText('PDF_TABELA_PADRAO')).toBeInTheDocument();
  });

  it('distingue visualmente a entrada com motivoInsucesso da que tem null', () => {
    render(<EtapasPipeline historico={historico} />);

    const etapas = screen.getAllByTestId('etapa-pipeline');
    expect(etapas[0]).toHaveAttribute('data-insucesso', 'false');
    expect(etapas[1]).toHaveAttribute('data-insucesso', 'true');
    expect(etapas[2]).toHaveAttribute('data-insucesso', 'false');

    const motivos = screen.getAllByTestId('motivo-insucesso');
    expect(motivos).toHaveLength(1);
    expect(motivos[0]).toHaveTextContent('Coluna de preço ausente na primeira passagem.');

    expect(screen.getAllByText('Concluída com sucesso')).toHaveLength(2);
  });

  it('informa quando não há etapa registrada', () => {
    render(<EtapasPipeline historico={[]} />);

    expect(
      screen.getByText('Nenhuma etapa registrada para este orçamento.'),
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId('etapa-pipeline')).toHaveLength(0);
  });
});
