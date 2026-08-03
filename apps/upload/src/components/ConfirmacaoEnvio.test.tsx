/**
 * Testes da tela de confirmação de envio — issue #41.
 *
 * Falha se a mudança for revertida (docs/quality.md, seção 2): assere que o
 * identificador e o horário local aparecem exatamente com o valor vindo da
 * resposta, que copiar usa a Clipboard API, e que o callback de novo envio é
 * chamado.
 */

import { describe, it, expect, vi, beforeAll, afterEach, afterAll, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { ConfirmacaoEnvio } from './ConfirmacaoEnvio';
import { uploadHandlers, ORCAMENTO_ID_FIXO } from '@/test/mocks';
import type { ConfirmarUploadResponse } from '@/types/upload';

const RESPOSTA: ConfirmarUploadResponse = {
  orcamentoId: ORCAMENTO_ID_FIXO,
  status: 'RECEBIDO',
  recebidoEm: '2026-08-03T17:00:00Z',
};

function horarioLocalEsperado(iso: string): string {
  return new Date(iso).toLocaleString();
}

describe('ConfirmacaoEnvio', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('exibe o identificador exatamente como veio da resposta, sem transformação', () => {
    render(<ConfirmacaoEnvio resposta={RESPOSTA} onNovoEnvio={vi.fn()} />);

    expect(screen.getByText(RESPOSTA.orcamentoId)).toBeInTheDocument();
  });

  it('exibe o momento de recebimento convertido para horário local', () => {
    render(<ConfirmacaoEnvio resposta={RESPOSTA} onNovoEnvio={vi.fn()} />);

    const esperado = horarioLocalEsperado(RESPOSTA.recebidoEm);
    expect(screen.getByText((texto) => texto.includes(esperado))).toBeInTheDocument();
  });

  it('copia o identificador usando a Clipboard API ao clicar em Copiar', async () => {
    render(<ConfirmacaoEnvio resposta={RESPOSTA} onNovoEnvio={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /copiar/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(RESPOSTA.orcamentoId);
  });

  it('chama o callback de novo envio ao clicar no botão correspondente', async () => {
    const onNovoEnvio = vi.fn();
    render(<ConfirmacaoEnvio resposta={RESPOSTA} onNovoEnvio={onNovoEnvio} />);

    await userEvent.click(screen.getByRole('button', { name: /enviar outro orçamento/i }));

    expect(onNovoEnvio).toHaveBeenCalledTimes(1);
  });
});

/**
 * Da resposta real do mock (#38) até a tela, sem modelo fabricado no meio —
 * mesmo padrão usado em ErroUpload.test.tsx.
 */
describe('ConfirmacaoEnvio alimentada pela resposta real do mock (#38)', () => {
  const server = setupServer(...uploadHandlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers(...uploadHandlers));
  afterAll(() => server.close());

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('exibe identificador e horário local a partir da resposta do handler de confirmar-upload', async () => {
    const respostaHttp = await fetch(
      `/v1/orcamentos/${ORCAMENTO_ID_FIXO}/confirmar-upload`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer token-de-teste', 'Idempotency-Key': 'chave-de-teste' },
      },
    );
    const resposta = (await respostaHttp.json()) as ConfirmarUploadResponse;

    render(<ConfirmacaoEnvio resposta={resposta} onNovoEnvio={vi.fn()} />);

    expect(screen.getByText(resposta.orcamentoId)).toBeInTheDocument();
    const esperado = horarioLocalEsperado(resposta.recebidoEm);
    expect(screen.getByText((texto) => texto.includes(esperado))).toBeInTheDocument();
  });
});
