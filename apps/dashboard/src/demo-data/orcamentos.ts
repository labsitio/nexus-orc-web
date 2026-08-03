/**
 * Dado de demonstração estático do Painel de Acompanhamento (issue #46).
 *
 * Deliberadamente **sem chamada de rede**: numa demonstração ao vivo, dado
 * estático não falha. Não há endpoint de listagem no contrato do backend
 * (`GET /orcamentos` não existe), então este módulo é a fonte da tela até a
 * integração real — momento em que ele sai e o cliente HTTP entra.
 *
 * Determinístico por requisito: nenhum `Date.now()` nem `Math.random()`.
 * Os instantes são ISO 8601 em UTC, como o contrato manda; a exibição em
 * horário local acontece na camada de apresentação.
 *
 * O shape espelha `FIXTURES.statusIngestaoResponse` de
 * `apps/upload/src/test/mocks.ts` — nenhum campo além do acordado.
 */

import type { StatusIngestao } from '@/types/orcamento';

/** Mesmo UUID v7 fixo usado pelo mock do portal de upload. */
export const ORCAMENTO_ID_DISPONIVEL = '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f';
export const ORCAMENTO_ID_EM_CLASSIFICACAO = '018f2f7b-1d3f-7c2b-8d4e-2b3c4d5e6f70';
export const ORCAMENTO_ID_COM_RESSALVA = '018f2f8c-2e4a-7d3c-9e5f-3c4d5e6f7081';

/**
 * Orçamento já percorrido de ponta a ponta: disponível para consulta.
 * A etapa de indexação falhou e foi refeita — mostra que insucesso de etapa
 * não é o mesmo que insucesso do orçamento.
 */
const orcamentoDisponivel: StatusIngestao = {
  orcamentoId: ORCAMENTO_ID_DISPONIVEL,
  canal: 'PORTAL_WEB',
  status: 'DISPONIVEL',
  resultadoAtual: {
    fornecedorIdentificado: 'Distribuidora ABC Ltda',
    formatoIdentificado: 'PDF_TABELA_PADRAO',
    nivelConfianca: 94,
    agenteOrigem: 'INDEXADOR',
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
    {
      agente: 'EXTRATOR',
      ocorreuEm: '2026-08-03T17:01:12Z',
      resultado: {
        fornecedorIdentificado: 'Distribuidora ABC Ltda',
        formatoIdentificado: 'PDF_TABELA_PADRAO',
        nivelConfianca: 96,
        agenteOrigem: 'EXTRATOR',
      },
      motivoInsucesso: null,
    },
    {
      agente: 'VALIDADOR',
      ocorreuEm: '2026-08-03T17:01:48Z',
      resultado: {
        fornecedorIdentificado: 'Distribuidora ABC Ltda',
        formatoIdentificado: 'PDF_TABELA_PADRAO',
        nivelConfianca: 98,
        agenteOrigem: 'VALIDADOR',
      },
      motivoInsucesso: null,
    },
    {
      agente: 'INDEXADOR',
      ocorreuEm: '2026-08-03T17:02:20Z',
      resultado: {
        fornecedorIdentificado: 'Distribuidora ABC Ltda',
        formatoIdentificado: 'PDF_TABELA_PADRAO',
        nivelConfianca: 98,
        agenteOrigem: 'INDEXADOR',
      },
      motivoInsucesso: null,
    },
  ],
};

/** Orçamento no meio do pipeline: classificado, aguardando extração. */
const orcamentoEmClassificacao: StatusIngestao = {
  orcamentoId: ORCAMENTO_ID_EM_CLASSIFICACAO,
  canal: 'PORTAL_WEB',
  status: 'CLASSIFICADO',
  resultadoAtual: {
    fornecedorIdentificado: 'Comercial Vale Verde S.A.',
    formatoIdentificado: 'PLANILHA_XLSX_MULTIABA',
    nivelConfianca: 81,
    agenteOrigem: 'CLASSIFICADOR',
  },
  historico: [
    {
      agente: 'CLASSIFICADOR',
      ocorreuEm: '2026-08-03T18:14:05Z',
      resultado: {
        fornecedorIdentificado: 'Comercial Vale Verde S.A.',
        formatoIdentificado: 'PLANILHA_XLSX_MULTIABA',
        nivelConfianca: 62,
        agenteOrigem: 'CLASSIFICADOR',
      },
      motivoInsucesso: 'Confiança abaixo do limiar na primeira passagem: cabeçalho ambíguo entre duas abas.',
    },
    {
      agente: 'CLASSIFICADOR',
      ocorreuEm: '2026-08-03T18:14:52Z',
      resultado: {
        fornecedorIdentificado: 'Comercial Vale Verde S.A.',
        formatoIdentificado: 'PLANILHA_XLSX_MULTIABA',
        nivelConfianca: 81,
        agenteOrigem: 'CLASSIFICADOR',
      },
      motivoInsucesso: null,
    },
  ],
};

/**
 * Estado terminal que **não** é erro: validado com ressalva
 * (docs/quality.md, seção 3). Deve aparecer como resultado válido.
 */
const orcamentoComRessalva: StatusIngestao = {
  orcamentoId: ORCAMENTO_ID_COM_RESSALVA,
  canal: 'PORTAL_WEB',
  status: 'VALIDADO_COM_RESSALVA',
  resultadoAtual: {
    fornecedorIdentificado: 'Atacadão Norte Distribuição ME',
    formatoIdentificado: 'EMAIL_CORPO_TEXTO',
    nivelConfianca: 72,
    agenteOrigem: 'VALIDADOR',
  },
  historico: [
    {
      agente: 'CLASSIFICADOR',
      ocorreuEm: '2026-08-03T15:32:10Z',
      resultado: {
        fornecedorIdentificado: 'Atacadão Norte Distribuição ME',
        formatoIdentificado: 'EMAIL_CORPO_TEXTO',
        nivelConfianca: 77,
        agenteOrigem: 'CLASSIFICADOR',
      },
      motivoInsucesso: null,
    },
    {
      agente: 'EXTRATOR',
      ocorreuEm: '2026-08-03T15:33:02Z',
      resultado: {
        fornecedorIdentificado: 'Atacadão Norte Distribuição ME',
        formatoIdentificado: 'EMAIL_CORPO_TEXTO',
        nivelConfianca: 74,
        agenteOrigem: 'EXTRATOR',
      },
      motivoInsucesso: null,
    },
    {
      agente: 'VALIDADOR',
      ocorreuEm: '2026-08-03T15:33:41Z',
      resultado: {
        fornecedorIdentificado: 'Atacadão Norte Distribuição ME',
        formatoIdentificado: 'EMAIL_CORPO_TEXTO',
        nivelConfianca: 72,
        agenteOrigem: 'VALIDADOR',
      },
      motivoInsucesso: null,
    },
  ],
};

/** Os três orçamentos exibidos no painel, em ordem estável. */
export const ORCAMENTOS_DEMO: readonly StatusIngestao[] = [
  orcamentoDisponivel,
  orcamentoEmClassificacao,
  orcamentoComRessalva,
];
