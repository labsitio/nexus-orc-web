/**
 * Tipos do detalhe de um orçamento no Painel de Acompanhamento (issue #46).
 *
 * Espelham fielmente o shape já acordado com o backend para
 * `GET /orcamentos/{orcamentoId}/status`, materializado em
 * `apps/upload/src/test/mocks.ts` (`FIXTURES.statusIngestaoResponse`).
 * Nenhum campo é inventado aqui: nomes em camelCase português e valores de
 * enum em MAIUSCULA_SNAKE, conforme docs/architecture.md, seção 5.1.
 *
 * Não há endpoint de listagem no contrato do backend — por isso o painel
 * exibe o *detalhe* (Fase 02), e o dado desta tela é de demonstração
 * estática (`src/demo-data/orcamentos.ts`), sem chamada de rede.
 */

/** Canais de ingestão. O portal web é o único que esta equipe implementa. */
export type CanalIngestao = 'PORTAL_WEB' | 'API_REST' | 'SFTP' | 'APP_MOBILE';

/**
 * Status do ciclo de vida do orçamento (docs/architecture.md, seção 5.1).
 *
 * Atenção: `VALIDADO_COM_RESSALVA`, `EXTRAIDO_COM_PENDENCIA_CONFIRMADA` e
 * `FALHA_INDEXACAO` são estados **terminais válidos**, não erro
 * (docs/quality.md, seção 3) — `FALHA_INDEXACAO` em particular não bloqueia
 * nada de negócio. Ver `STATUS_TERMINAL_SEM_ERRO` abaixo.
 */
export type StatusOrcamento =
  | 'RECEBIDO'
  | 'FORNECEDOR_IDENTIFICADO'
  | 'CLASSIFICADO'
  | 'EXTRAIDO'
  | 'EXTRAIDO_COM_PENDENCIA_CONFIRMADA'
  | 'VALIDADO'
  | 'VALIDADO_COM_RESSALVA'
  | 'FALHA_VALIDACAO'
  | 'INDEXADO'
  | 'FALHA_INDEXACAO'
  | 'DISPONIVEL'
  | 'ARQUIVADO';

/** Agentes de IA do produto (backend) que atuam no pipeline. */
export type AgentePipeline =
  | 'CLASSIFICADOR'
  | 'EXTRATOR'
  | 'VALIDADOR'
  | 'INDEXADOR'
  | 'ORQUESTRADOR';

/** Resultado produzido por um agente do pipeline. */
export interface ResultadoAgente {
  fornecedorIdentificado: string;
  formatoIdentificado: string;
  /** Percentual inteiro, como no contrato (ex: 94). */
  nivelConfianca: number;
  agenteOrigem: AgentePipeline;
}

/** Uma entrada da linha do tempo do pipeline. */
export interface EntradaHistorico {
  agente: AgentePipeline;
  /** ISO 8601 em UTC — nunca alterar o valor; formatar apenas na exibição. */
  ocorreuEm: string;
  resultado: ResultadoAgente;
  /** `null` quando a etapa teve sucesso. */
  motivoInsucesso: string | null;
}

/** Resposta de `GET /orcamentos/{orcamentoId}/status`. */
export interface StatusIngestao {
  /** UUID v7. */
  orcamentoId: string;
  canal: CanalIngestao;
  status: StatusOrcamento;
  resultadoAtual: ResultadoAgente;
  historico: EntradaHistorico[];
}

/**
 * Estados terminais que **não** são falha, apesar do nome.
 * Usado para não pintar de vermelho o que é resultado válido.
 */
export const STATUS_TERMINAL_SEM_ERRO: readonly StatusOrcamento[] = [
  'VALIDADO_COM_RESSALVA',
  'EXTRAIDO_COM_PENDENCIA_CONFIRMADA',
  'FALHA_INDEXACAO',
];

/** Único status que representa falha de negócio de fato. */
const STATUS_DE_ERRO: readonly StatusOrcamento[] = ['FALHA_VALIDACAO'];

export function statusEhErro(status: StatusOrcamento): boolean {
  return STATUS_DE_ERRO.includes(status);
}

/**
 * Rótulos de exibição. O dado permanece em MAIUSCULA_SNAKE; isto é só
 * apresentação (docs/architecture.md, seção 5.1: não traduzir o enum).
 */
export const ROTULO_STATUS: Record<StatusOrcamento, string> = {
  RECEBIDO: 'Recebido',
  FORNECEDOR_IDENTIFICADO: 'Fornecedor identificado',
  CLASSIFICADO: 'Classificado',
  EXTRAIDO: 'Extraído',
  EXTRAIDO_COM_PENDENCIA_CONFIRMADA: 'Extraído com pendência confirmada',
  VALIDADO: 'Validado',
  VALIDADO_COM_RESSALVA: 'Validado com ressalva',
  FALHA_VALIDACAO: 'Falha na validação',
  INDEXADO: 'Indexado',
  FALHA_INDEXACAO: 'Falha na indexação',
  DISPONIVEL: 'Disponível',
  ARQUIVADO: 'Arquivado',
};

export const ROTULO_AGENTE: Record<AgentePipeline, string> = {
  CLASSIFICADOR: 'Classificador de Fornecedor e Formato',
  EXTRATOR: 'Extrator de Dados',
  VALIDADOR: 'Validador de Consistência',
  INDEXADOR: 'Indexação e Busca Semântica',
  ORQUESTRADOR: 'Orquestrador de Workflow',
};

export const ROTULO_CANAL: Record<CanalIngestao, string> = {
  PORTAL_WEB: 'Portal web',
  API_REST: 'API REST',
  SFTP: 'SFTP',
  APP_MOBILE: 'Aplicativo mobile',
};

/**
 * Formata um instante ISO 8601 UTC no horário local do usuário.
 * O dado de origem não é alterado — a conversão é só de apresentação.
 */
export function formatarMomentoLocal(ocorreuEm: string): string {
  return new Date(ocorreuEm).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
