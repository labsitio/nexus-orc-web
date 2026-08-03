/**
 * Handlers de mock para o fluxo de upload (Fase 01) — issue #38.
 *
 * Preparado ANTES do #35 (andaime) mergear, para não conflitar com o branch
 * ativo do André. Destino final provável: apps/upload/src/test/mocks.ts
 * (ou onde o setup de MSW do andaime esperar — ajustar o caminho do import
 * de tipos/fixtures ao encaixar, o conteúdo abaixo é independente de path).
 *
 * Deriva de docs/openapi.yaml do backend (nexus-orc-back), lido em 03/08/2026.
 * Fonte de cada endpoint linkada no comentário correspondente.
 *
 * Campos marcados PROVISÓRIO pelo backend (corpo de POST /orcamentos/upload-url
 * e RevisaoHumanaExtracaoRequest) ficam isolados no bloco FIXTURES abaixo —
 * é o único ponto que precisa mudar se o contrato deles mudar de forma.
 */

import { http, HttpResponse } from 'msw';

// ---------------------------------------------------------------------------
// Base da API — mesma usada pelo cliente real, injetada por variável de
// ambiente (NEXT_PUBLIC_API_BASE_URL ou equivalente definido pelo #35).
// ---------------------------------------------------------------------------
const API_BASE = '/v1';

// ---------------------------------------------------------------------------
// Fixtures determinísticas — mesma chamada produz a mesma resposta entre
// execuções (critério de aceite da #38). Nenhum Date.now()/random aqui.
// ---------------------------------------------------------------------------

/** UUID v7 fixo, formato correto (spec 001) — não é aleatório de propósito. */
const ORCAMENTO_ID_FIXO = '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f';

const FIXTURES = {
  /**
   * PROVISÓRIO (backend): shape de POST /orcamentos/upload-url não tem spec
   * própria — assumido pelo arquiteto deles. Ver docs/openapi.yaml,
   * GerarUploadUrlRequest. Isolado aqui: se o shape mudar, só este objeto
   * muda.
   */
  uploadUrlResponse: {
    orcamentoId: ORCAMENTO_ID_FIXO,
    uploadUrl:
      'https://nexo-orcamentos-raw.s3.amazonaws.com/pending/018f2f6a-mock.pdf?X-Amz-Signature=mock',
    metodo: 'PUT',
    expiraEm: '2026-08-03T18:00:00Z',
  },

  confirmarUploadResponse: {
    orcamentoId: ORCAMENTO_ID_FIXO,
    status: 'RECEBIDO',
    recebidoEm: '2026-08-03T17:00:00Z',
  },

  statusIngestaoResponse: {
    orcamentoId: ORCAMENTO_ID_FIXO,
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
  },
};

// ---------------------------------------------------------------------------
// Problem Details (RFC 7807) — formato de erro acordado, docs/architecture.md
// seção 5.1. `type` é o código estável — nunca inventar campo `code`.
// ---------------------------------------------------------------------------

function problemDetails(
  type: string,
  title: string,
  status: number,
  detail: string,
  instance: string,
) {
  return HttpResponse.json(
    { type: `https://nexo.internal/problems/${type}`, title, status, detail, instance },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  );
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export const uploadHandlers = [
  // POST /v1/orcamentos/upload-url
  http.post(`${API_BASE}/orcamentos/upload-url`, async ({ request }) => {
    const auth = request.headers.get('authorization');
    if (!auth) {
      return problemDetails(
        'nao-autenticado',
        'Token ausente ou inválido',
        401,
        'Requisição sem header Authorization.',
        '/v1/orcamentos/upload-url',
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const camposObrigatorios = ['canal', 'nomeArquivo', 'tipoConteudo'];
    const faltando = camposObrigatorios.filter((campo) => !body?.[campo]);
    if (faltando.length > 0) {
      return problemDetails(
        'validacao',
        'Corpo da requisição inválido',
        400,
        `Campo(s) obrigatório(s) ausente(s): ${faltando.join(', ')}.`,
        '/v1/orcamentos/upload-url',
      );
    }

    return HttpResponse.json(FIXTURES.uploadUrlResponse, { status: 201 });
  }),

  // PUT direto no S3 (URL presigned) — simula sucesso do upload do arquivo.
  // A URL de mock não é um domínio real; interceptar por padrão de path.
  http.put('https://nexo-orcamentos-raw.s3.amazonaws.com/pending/*', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // POST /v1/orcamentos/{orcamentoId}/confirmar-upload
  http.post(`${API_BASE}/orcamentos/:orcamentoId/confirmar-upload`, ({ params, request }) => {
    const auth = request.headers.get('authorization');
    if (!auth) {
      return problemDetails(
        'nao-autenticado',
        'Token ausente ou inválido',
        401,
        'Requisição sem header Authorization.',
        `/v1/orcamentos/${params.orcamentoId}/confirmar-upload`,
      );
    }

    if (params.orcamentoId !== ORCAMENTO_ID_FIXO) {
      return problemDetails(
        'nao-encontrado',
        'Orçamento não encontrado',
        404,
        'Nenhum orçamento com este id.',
        `/v1/orcamentos/${params.orcamentoId}/confirmar-upload`,
      );
    }

    // Idempotência: mesma resposta sempre, independente de Idempotency-Key —
    // é o comportamento correto (spec 001).
    return HttpResponse.json(FIXTURES.confirmarUploadResponse, { status: 200 });
  }),

  // GET /v1/orcamentos/{orcamentoId}/status
  http.get(`${API_BASE}/orcamentos/:orcamentoId/status`, ({ params, request }) => {
    const auth = request.headers.get('authorization');
    if (!auth) {
      return problemDetails(
        'nao-autenticado',
        'Token ausente ou inválido',
        401,
        'Requisição sem header Authorization.',
        `/v1/orcamentos/${params.orcamentoId}/status`,
      );
    }

    if (params.orcamentoId !== ORCAMENTO_ID_FIXO) {
      // 404 é deliberadamente o mesmo para "não existe" e "existe em outro
      // tenant" (spec 007) — nunca inferir existência.
      return problemDetails(
        'nao-encontrado',
        'Orçamento não encontrado',
        404,
        'Nenhum orçamento com este id.',
        `/v1/orcamentos/${params.orcamentoId}/status`,
      );
    }

    return HttpResponse.json(FIXTURES.statusIngestaoResponse, { status: 200 });
  }),
];

/**
 * Cenário de conflito (409) para o confirmar-upload, exercitado em teste
 * dedicado — sobrepõe o handler padrão para o mesmo orçamentoId.
 * "Upload ainda não concluído" (spec 001) — o PUT no S3 não aconteceu.
 */
export const confirmarUploadNaoConcluidoHandler = http.post(
  `${API_BASE}/orcamentos/:orcamentoId/confirmar-upload`,
  ({ params }) =>
    problemDetails(
      'upload-nao-concluido',
      'Upload ainda não concluído',
      409,
      'Nenhum objeto encontrado no prefixo temporário para este orcamentoId.',
      `/v1/orcamentos/${params.orcamentoId}/confirmar-upload`,
    ),
);
