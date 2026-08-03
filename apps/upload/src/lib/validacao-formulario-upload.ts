/**
 * Validação client-side do formulário de envio de orçamento (issue #39).
 *
 * Escopo explícito: apenas formato (campo vazio, tipo de arquivo aceito,
 * quantidade de dígitos de CNPJ/CPF). Validação de CNPJ contra base
 * cadastral é responsabilidade do backend (fora de escopo aqui — ver
 * issue #39, "Fora de escopo").
 *
 * Funções puras e testáveis isoladamente, conforme
 * docs/engineering-principles.md, seção 6 ("prioridade: funções críticas
 * (cálculos, validação) > componentes de UI").
 */

/** Tipos de conteúdo aceitos para o arquivo de orçamento: PDF ou imagem. */
export const TIPOS_CONTEUDO_ACEITOS = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const;

export type TipoConteudoAceito = (typeof TIPOS_CONTEUDO_ACEITOS)[number];

function ehTipoAceito(tipo: string): tipo is TipoConteudoAceito {
  return (TIPOS_CONTEUDO_ACEITOS as readonly string[]).includes(tipo);
}

/** Remove tudo que não for dígito — usado para contar CNPJ/CPF sem máscara. */
export function normalizarDocumento(valor: string): string {
  return valor.replace(/\D/g, '');
}

/**
 * Valida CNPJ/CPF apenas por formato (quantidade de dígitos): 11 (CPF) ou
 * 14 (CNPJ). Não valida dígito verificador nem existência cadastral — isso
 * é do backend.
 */
export function validarCnpjCpf(valor: string): string | undefined {
  const digitos = normalizarDocumento(valor);
  if (!digitos) {
    return 'Informe o CNPJ ou CPF do fornecedor.';
  }
  if (digitos.length !== 11 && digitos.length !== 14) {
    return 'CNPJ deve ter 14 dígitos ou CPF deve ter 11 dígitos.';
  }
  return undefined;
}

/** Valida o nome do contato: apenas obrigatoriedade. */
export function validarNomeContato(valor: string): string | undefined {
  if (!valor.trim()) {
    return 'Informe o nome do contato.';
  }
  return undefined;
}

/** Valida o arquivo selecionado: obrigatório e tipo aceito (PDF ou imagem). */
export function validarArquivo(arquivo: File | null): string | undefined {
  if (!arquivo) {
    return 'Selecione o arquivo do orçamento.';
  }
  if (!ehTipoAceito(arquivo.type)) {
    return 'Formato não aceito. Envie um PDF ou uma imagem (PNG ou JPEG).';
  }
  return undefined;
}

/** Referência externa é opcional — sempre válida, sem checagem de formato. */
export function validarReferenciaExterna(_valor: string): string | undefined {
  return undefined;
}
