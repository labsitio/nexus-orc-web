/**
 * Testes da apresentação de erro do fluxo de upload — issue #42.
 *
 * Falha se a mudança for revertida (docs/quality.md, seção 2): assere que a
 * nova tentativa aparece só no caso que a admite e que o callback é chamado.
 */

import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { ErroUpload } from './ErroUpload';
import {
  uploadHandlers,
  confirmarUploadNaoConcluidoHandler,
  ORCAMENTO_ID_FIXO,
  ORCAMENTO_ID_INEXISTENTE,
  uploadUrlRequestValido as CORPO_VALIDO,
} from '@/test/mocks';
import { capturarErro, type ErroUpload as ErroUploadModel } from '@/lib/erros-upload';

const ERRO_SEM_NOVA_TENTATIVA: ErroUploadModel = {
  codigo: 'validacao',
  titulo: 'Dados do orçamento inválidos',
  mensagem: 'Revise os campos do formulário.',
  podeTentarNovamente: false,
};

const ERRO_COM_NOVA_TENTATIVA: ErroUploadModel = {
  codigo: 'upload-nao-concluido',
  titulo: 'O arquivo ainda não chegou por completo',
  mensagem: 'Seus dados foram preservados.',
  podeTentarNovamente: true,
};

describe('ErroUpload', () => {
  it('exibe título e mensagem do erro', () => {
    render(<ErroUpload erro={ERRO_SEM_NOVA_TENTATIVA} />);

    expect(screen.getByText('Dados do orçamento inválidos')).toBeInTheDocument();
    expect(screen.getByText('Revise os campos do formulário.')).toBeInTheDocument();
  });

  it('anuncia o erro para tecnologia assistiva', () => {
    render(<ErroUpload erro={ERRO_SEM_NOVA_TENTATIVA} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('não oferece nova tentativa em erro que não a admite', () => {
    render(<ErroUpload erro={ERRO_SEM_NOVA_TENTATIVA} onTentarNovamente={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument();
  });

  it('oferece nova tentativa no upload não concluído e chama o callback', async () => {
    const onTentarNovamente = vi.fn();
    render(<ErroUpload erro={ERRO_COM_NOVA_TENTATIVA} onTentarNovamente={onTentarNovamente} />);

    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(onTentarNovamente).toHaveBeenCalledTimes(1);
  });

  it('não mostra botão sem callback, mesmo em erro que admite nova tentativa', () => {
    render(<ErroUpload erro={ERRO_COM_NOVA_TENTATIVA} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

/**
 * Da resposta do mock até o texto na tela, sem modelo fabricado no meio — é o
 * critério de aceite da issue ("simulando cada um dos quatro erros no mock, a
 * tela exibe a mensagem correspondente, e as quatro são distinguíveis").
 */
describe('ErroUpload alimentado pelo erro real do mock (#38)', () => {
  const server = setupServer(...uploadHandlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers(...uploadHandlers));
  afterAll(() => server.close());

  const AUTH = { Authorization: 'Bearer token-de-teste' };

  function pedirUploadUrl(headers: HeadersInit, corpo: unknown): Promise<Response> {
    return fetch('/v1/orcamentos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(corpo),
    });
  }

  function confirmarUpload(orcamentoId: string): Promise<Response> {
    return fetch(`/v1/orcamentos/${orcamentoId}/confirmar-upload`, {
      method: 'POST',
      headers: { ...AUTH, 'Idempotency-Key': 'chave-de-teste' },
    });
  }

  async function renderizarErroDe(chamada: () => Promise<Response>): Promise<HTMLElement> {
    const erro = await capturarErro(chamada);
    if (erro === null) {
      throw new Error('A chamada não falhou — o cenário de erro não foi exercitado.');
    }
    cleanup(); // vários erros são renderizados dentro do mesmo teste
    render(<ErroUpload erro={erro} onTentarNovamente={vi.fn()} />);
    return screen.getByRole('alert');
  }

  it('exibe na tela um texto próprio para cada um dos quatro erros do contrato', async () => {
    const textos: string[] = [];

    textos.push((await renderizarErroDe(() => pedirUploadUrl(AUTH, {}))).textContent ?? '');
    textos.push((await renderizarErroDe(() => pedirUploadUrl({}, CORPO_VALIDO))).textContent ?? '');
    textos.push(
      (await renderizarErroDe(() => confirmarUpload(ORCAMENTO_ID_INEXISTENTE))).textContent ?? '',
    );
    server.use(confirmarUploadNaoConcluidoHandler);
    textos.push(
      (await renderizarErroDe(() => confirmarUpload(ORCAMENTO_ID_FIXO))).textContent ?? '',
    );

    expect(new Set(textos).size).toBe(4);
    textos.forEach((texto) => expect(texto.trim().length).toBeGreaterThan(0));
  });

  it('o 409 do mock chega à tela com o botão de nova tentativa', async () => {
    server.use(confirmarUploadNaoConcluidoHandler);

    await renderizarErroDe(() => confirmarUpload(ORCAMENTO_ID_FIXO));

    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('o 400 do mock chega à tela sem botão e sem o detail cru do backend', async () => {
    const alerta = await renderizarErroDe(() => pedirUploadUrl(AUTH, { canal: 'PORTAL_WEB' }));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(alerta.textContent).not.toMatch(/campo\(s\)|obrigat[óo]rio\(s\)|\/v1\//i);
  });
});
