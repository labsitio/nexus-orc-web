/**
 * Testes dos handlers de mock do fluxo de upload — issue #38.
 *
 * Preparado antes do #35 mergear. Destino final provável ao lado de
 * mock-handlers-upload.ts (ajustar imports de setup do MSW ao encaixar).
 *
 * Prova o critério de aceite: "existe teste automatizado que exercita o mock
 * nos caminhos de sucesso e nos quatro erros, e que falha se o mock for
 * revertido" (docs/quality.md, seção 2).
 */

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import {
  uploadHandlers,
  confirmarUploadNaoConcluidoHandler,
  ORCAMENTO_ID_FIXO,
  uploadUrlRequestValido,
} from './mocks';

const server = setupServer(...uploadHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers(...uploadHandlers));
afterAll(() => server.close());

const AUTH_HEADER = { Authorization: 'Bearer token-de-teste' };

describe('POST /v1/orcamentos/upload-url', () => {
  it('sucesso: retorna 201 com orcamentoId, uploadUrl, metodo e expiraEm', async () => {
    const resposta = await fetch('/v1/orcamentos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify(uploadUrlRequestValido),
    });

    expect(resposta.status).toBe(201);
    const corpo = await resposta.json();
    expect(corpo).toMatchObject({
      orcamentoId: ORCAMENTO_ID_FIXO,
      metodo: 'PUT',
    });
    expect(corpo.uploadUrl).toEqual(expect.stringContaining('https://'));
    expect(corpo.expiraEm).toBeTruthy();
  });

  it('400: campo obrigatório ausente retorna Problem Details com detail explicando qual campo falta', async () => {
    const resposta = await fetch('/v1/orcamentos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({ canal: 'PORTAL_WEB' }), // faltam nomeArquivo, tipoConteudo
    });

    expect(resposta.status).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.type).toEqual(expect.stringContaining('/problems/validacao'));
    expect(corpo.detail).toEqual(expect.stringContaining('nomeArquivo'));
  });

  it('401: sem Authorization retorna Problem Details de não autenticado', async () => {
    const resposta = await fetch('/v1/orcamentos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadUrlRequestValido),
    });

    expect(resposta.status).toBe(401);
    const corpo = await resposta.json();
    expect(corpo.type).toEqual(expect.stringContaining('/problems/nao-autenticado'));
  });
});

describe('POST /v1/orcamentos/{orcamentoId}/confirmar-upload', () => {
  it('sucesso: retorna 200 com status RECEBIDO', async () => {
    const resposta = await fetch(
      `/v1/orcamentos/${ORCAMENTO_ID_FIXO}/confirmar-upload`,
      { method: 'POST', headers: AUTH_HEADER },
    );

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo).toMatchObject({ orcamentoId: ORCAMENTO_ID_FIXO, status: 'RECEBIDO' });
  });

  it('404: orcamentoId desconhecido retorna Problem Details de não encontrado', async () => {
    const resposta = await fetch(
      '/v1/orcamentos/00000000-0000-0000-0000-000000000000/confirmar-upload',
      { method: 'POST', headers: AUTH_HEADER },
    );

    expect(resposta.status).toBe(404);
    const corpo = await resposta.json();
    expect(corpo.type).toEqual(expect.stringContaining('/problems/nao-encontrado'));
  });

  it('409: upload ainda não concluído no S3', async () => {
    server.use(confirmarUploadNaoConcluidoHandler);

    const resposta = await fetch(
      `/v1/orcamentos/${ORCAMENTO_ID_FIXO}/confirmar-upload`,
      { method: 'POST', headers: AUTH_HEADER },
    );

    expect(resposta.status).toBe(409);
    const corpo = await resposta.json();
    expect(corpo.type).toEqual(expect.stringContaining('/problems/upload-nao-concluido'));
  });
});

describe('GET /v1/orcamentos/{orcamentoId}/status', () => {
  it('sucesso: retorna status e histórico de classificação', async () => {
    const resposta = await fetch(`/v1/orcamentos/${ORCAMENTO_ID_FIXO}/status`, {
      headers: AUTH_HEADER,
    });

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.orcamentoId).toBe(ORCAMENTO_ID_FIXO);
    expect(corpo.historico.length).toBeGreaterThan(0);
  });

  it('404: orcamento em outro tenant é indistinguível de inexistente', async () => {
    const resposta = await fetch(
      '/v1/orcamentos/00000000-0000-0000-0000-000000000000/status',
      { headers: AUTH_HEADER },
    );

    expect(resposta.status).toBe(404);
  });
});

describe('determinismo', () => {
  it('a mesma chamada produz a mesma resposta em execuções diferentes', async () => {
    const r1 = await fetch(`/v1/orcamentos/${ORCAMENTO_ID_FIXO}/status`, {
      headers: AUTH_HEADER,
    });
    const r2 = await fetch(`/v1/orcamentos/${ORCAMENTO_ID_FIXO}/status`, {
      headers: AUTH_HEADER,
    });

    expect(await r1.json()).toEqual(await r2.json());
  });
});
