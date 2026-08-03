/**
 * Tipos do formulário de envio de orçamento (issue #39).
 *
 * `GerarUploadUrlRequest` espelha exatamente o shape PROVISÓRIO assumido em
 * `src/test/mocks.ts` (issue #38) para `POST /orcamentos/upload-url`:
 * `canal`, `nomeArquivo`, `tipoConteudo`, `referenciaExterna` (opcional).
 * Casing e nomes em português conforme docs/architecture.md, seção 5.1.
 *
 * A chamada HTTP em si (e o PUT no S3) é escopo da issue #40 — aqui só o
 * shape dos dados que o formulário produz.
 */

/**
 * Canal fixo do Portal de Upload — não é escolhido pelo fornecedor, vem do
 * contrato (docs/architecture.md, seção 5.1: enums em MAIUSCULA_SNAKE).
 */
export const CANAL_PORTAL_WEB = 'PORTAL_WEB' as const;

export interface GerarUploadUrlRequest {
  canal: typeof CANAL_PORTAL_WEB;
  nomeArquivo: string;
  tipoConteudo: string;
  referenciaExterna?: string;
}

/**
 * Dados de identificação do fornecedor capturados no formulário.
 *
 * PREMISSA (docs/architecture.md, seção 4): "Fornecedor identificado via
 * campo no formulário, sem autenticação" — ainda não confirmada com o
 * backend (issue de referência #1). Se a premissa mudar para autenticação
 * real, estes campos podem deixar de ser digitados manualmente.
 */
export interface IdentificacaoFornecedor {
  cnpjCpf: string;
  nomeContato: string;
}

/**
 * Resposta de `POST /orcamentos/{orcamentoId}/confirmar-upload` (issue #41).
 * Espelha exatamente `FIXTURES.confirmarUploadResponse` em `src/test/mocks.ts`
 * — `recebidoEm` é ISO 8601 UTC (docs/architecture.md, seção 5.1); a
 * conversão para horário local acontece só na apresentação, nunca aqui.
 */
export interface ConfirmarUploadResponse {
  orcamentoId: string;
  status: 'RECEBIDO';
  recebidoEm: string;
}
