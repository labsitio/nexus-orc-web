/**
 * Testes do tratamento de erros do fluxo de upload — issue #42.
 *
 * Exercita os erros contra os handlers de mock do #38, e não contra objetos
 * `Response` fabricados aqui: é o mock derivado do contrato do backend que
 * define o formato, então testar contra ele é o que prova que o tratamento
 * cobre o erro real.
 *
 * Critério de `docs/quality.md`, seção 2 — o teste falha se a mudança for
 * revertida: cada caso assere o código estável específico. Se a escolha da
 * mensagem passar a usar o status HTTP ou o `detail`, ou se o mapa esvaziar,
 * os casos deixam de se distinguir e quebram.
 */

import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { uploadHandlers, confirmarUploadNaoConcluidoHandler } from '@/test/mocks';
import {
  capturarErro,
  interpretarFalhaDeRede,
  interpretarRespostaDeErro,
  type ErroUpload,
} from './erros-upload';

const server = setupServer(...uploadHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers(...uploadHandlers));
afterAll(() => server.close());

const ORCAMENTO_ID_FIXO = '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f';
const AUTH = { Authorization: 'Bearer token-de-teste' };
const CORPO_VALIDO = {
  canal: 'PORTAL_WEB',
  nomeArquivo: 'orcamento.pdf',
  tipoConteudo: 'application/pdf',
};

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

describe('erros previstos no contrato', () => {
  it('400 de validação vira mensagem de dados inválidos, sem nova tentativa', async () => {
    const erro = await capturarErro(() => pedirUploadUrl(AUTH, { canal: 'PORTAL_WEB' }));

    expect(erro?.codigo).toBe('validacao');
    expect(erro?.titulo).toBe('Dados do orçamento inválidos');
    expect(erro?.podeTentarNovamente).toBe(false);
  });

  it('401 vira mensagem de envio não autorizado', async () => {
    const erro = await capturarErro(() => pedirUploadUrl({}, CORPO_VALIDO));

    expect(erro?.codigo).toBe('nao-autenticado');
    expect(erro?.titulo).toBe('Envio não autorizado');
  });

  it('404 vira "não encontrado", sem sugerir que existe em outro lugar', async () => {
    const erro = await capturarErro(() =>
      confirmarUpload('018f2f6a-0000-7000-8000-000000000000'),
    );

    expect(erro?.codigo).toBe('nao-encontrado');
    expect(erro?.titulo).toBe('Orçamento não encontrado');
    // Nunca inferir existência em outro tenant — architecture.md 5.1,
    // quality.md seção 3 (Segurança).
    expect(erro?.mensagem).not.toMatch(/outro|tenant|permiss/i);
  });

  it('409 de upload não concluído oferece nova tentativa', async () => {
    server.use(confirmarUploadNaoConcluidoHandler);

    const erro = await capturarErro(() => confirmarUpload(ORCAMENTO_ID_FIXO));

    expect(erro?.codigo).toBe('upload-nao-concluido');
    expect(erro?.podeTentarNovamente).toBe(true);
    // O preenchimento do formulário não é citado como algo a refazer.
    expect(erro?.mensagem).toMatch(/preservados/i);
  });

  it('os quatro erros do contrato são distinguíveis entre si', async () => {
    const validacao = await capturarErro(() => pedirUploadUrl(AUTH, {}));
    const naoAutenticado = await capturarErro(() => pedirUploadUrl({}, CORPO_VALIDO));
    const naoEncontrado = await capturarErro(() =>
      confirmarUpload('018f2f6a-0000-7000-8000-000000000000'),
    );
    server.use(confirmarUploadNaoConcluidoHandler);
    const naoConcluido = await capturarErro(() => confirmarUpload(ORCAMENTO_ID_FIXO));

    const erros = [validacao, naoAutenticado, naoEncontrado, naoConcluido] as ErroUpload[];
    const titulos = new Set(erros.map((erro) => erro.titulo));
    const mensagens = new Set(erros.map((erro) => erro.mensagem));

    expect(titulos.size).toBe(4);
    expect(mensagens.size).toBe(4);
  });
});

describe('falhas fora do contrato', () => {
  it('falha de rede tem apresentação própria e permite nova tentativa', async () => {
    server.use(http.post('/v1/orcamentos/upload-url', () => HttpResponse.error()));

    const erro = await capturarErro(() => pedirUploadUrl(AUTH, CORPO_VALIDO));

    expect(erro?.codigo).toBe('indisponivel');
    expect(erro?.podeTentarNovamente).toBe(true);
  });

  it('interpretarFalhaDeRede não depende de resposta alguma', () => {
    expect(interpretarFalhaDeRede().codigo).toBe('indisponivel');
  });

  it('erro do servidor fora do formato do contrato cai em inesperado', async () => {
    server.use(
      http.post('/v1/orcamentos/upload-url', () =>
        HttpResponse.text('<html>502 Bad Gateway</html>', { status: 502 }),
      ),
    );

    const erro = await capturarErro(() => pedirUploadUrl(AUTH, CORPO_VALIDO));

    expect(erro?.codigo).toBe('inesperado');
    expect(erro?.mensagem).not.toMatch(/html|gateway|502/i);
  });

  it('type desconhecido, ainda que no formato do contrato, cai em inesperado', async () => {
    server.use(
      http.post('/v1/orcamentos/upload-url', () =>
        HttpResponse.json(
          {
            type: 'https://nexo.internal/problems/regra-que-ainda-nao-existe',
            title: 'Algo novo do backend',
            status: 422,
            detail: 'Regra criada depois deste código.',
            instance: '/v1/orcamentos/upload-url',
          },
          { status: 422 },
        ),
      ),
    );

    const erro = await capturarErro(() => pedirUploadUrl(AUTH, CORPO_VALIDO));

    expect(erro?.codigo).toBe('inesperado');
  });
});

describe('nenhuma mensagem técnica crua chega à tela', () => {
  it('o detail e a URL assinada do backend não entram na mensagem', async () => {
    const erro = await capturarErro(() => pedirUploadUrl(AUTH, { canal: 'PORTAL_WEB' }));

    // O mock responde com detail "Campo(s) obrigatório(s) ausente(s): ..."
    expect(erro?.mensagem).not.toMatch(/campo\(s\)|obrigat[óo]rio\(s\)/i);
    expect(erro?.mensagem).not.toMatch(/http|amazonaws|X-Amz|\/v1\//i);
    expect(erro?.titulo).not.toMatch(/http|amazonaws|\/v1\//i);
  });

  it('resposta com corpo ilegível não vaza a exceção de parsing', async () => {
    const respostaQuebrada = {
      json: () => Promise.reject(new Error('Unexpected token < in JSON at position 0')),
    } as unknown as Response;

    const erro = await interpretarRespostaDeErro(respostaQuebrada);

    expect(erro.codigo).toBe('inesperado');
    expect(erro.mensagem).not.toMatch(/token|JSON|position/i);
  });
});

describe('capturarErro', () => {
  it('devolve null quando a chamada tem sucesso', async () => {
    const erro = await capturarErro(() => pedirUploadUrl(AUTH, CORPO_VALIDO));

    expect(erro).toBeNull();
  });

  it('não engole a chamada: executa exatamente uma vez', async () => {
    const chamada = vi.fn(() => pedirUploadUrl(AUTH, CORPO_VALIDO));

    await capturarErro(chamada);

    expect(chamada).toHaveBeenCalledTimes(1);
  });
});
