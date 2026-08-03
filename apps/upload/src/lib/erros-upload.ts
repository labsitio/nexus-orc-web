/**
 * Tradução dos erros do fluxo de upload para algo que o fornecedor entenda —
 * issue #42.
 *
 * O fornecedor é externo e não tem a quem recorrer quando a tela quebra. Cada
 * erro previsto no contrato vira uma mensagem em português que diz o que
 * aconteceu e o que ele pode fazer.
 *
 * A escolha da mensagem usa o `type` do Problem Details, que é o código
 * estável acordado com o backend (docs/architecture.md, seção 5.1) — nunca o
 * `detail`, que é texto livre, nem o status HTTP isolado, que não distingue
 * dois erros diferentes com o mesmo código.
 */

/** Prefixo das URIs de `type` acordado com o backend (RFC 7807). */
const PREFIXO_PROBLEMA = 'https://nexo.internal/problems/';

/** Códigos estáveis que o fluxo de upload pode receber, conforme o contrato. */
export type CodigoErroUpload =
  | 'validacao'
  | 'nao-autenticado'
  | 'nao-encontrado'
  | 'upload-nao-concluido'
  /** Falha de rede ou indisponibilidade — não vem do contrato. */
  | 'indisponivel'
  /** Resposta de erro que não segue o formato do contrato. */
  | 'inesperado';

export interface ErroUpload {
  /** Código estável usado para escolher a mensagem e para testar. */
  codigo: CodigoErroUpload;
  /** Título curto, exibido em destaque. */
  titulo: string;
  /** O que aconteceu e o que o fornecedor pode fazer. */
  mensagem: string;
  /**
   * Se o fornecedor pode tentar de novo sem refazer o preenchimento do
   * formulário. Verdadeiro apenas quando repetir a mesma ação tem chance real
   * de sucesso.
   */
  podeTentarNovamente: boolean;
}

const MENSAGENS: Record<CodigoErroUpload, Omit<ErroUpload, 'codigo'>> = {
  validacao: {
    titulo: 'Dados do orçamento inválidos',
    mensagem:
      'Algum dado do envio não foi aceito. Revise os campos do formulário e o ' +
      'arquivo selecionado, e envie novamente.',
    podeTentarNovamente: false,
  },
  'nao-autenticado': {
    titulo: 'Envio não autorizado',
    mensagem:
      'Não foi possível confirmar sua identidade para este envio. Recarregue a ' +
      'página e identifique-se novamente. Se o problema continuar, procure seu ' +
      'contato na rede varejista.',
    podeTentarNovamente: false,
  },
  'nao-encontrado': {
    titulo: 'Orçamento não encontrado',
    mensagem:
      'Este orçamento não está mais disponível para envio. Comece um novo envio ' +
      'a partir do formulário.',
    podeTentarNovamente: false,
  },
  'upload-nao-concluido': {
    titulo: 'O arquivo ainda não chegou por completo',
    mensagem:
      'O envio do arquivo não terminou antes da confirmação. Seus dados foram ' +
      'preservados — tente confirmar novamente em alguns instantes.',
    podeTentarNovamente: true,
  },
  indisponivel: {
    titulo: 'Não foi possível falar com o servidor',
    mensagem:
      'Verifique sua conexão com a internet e tente novamente. Se a conexão ' +
      'estiver funcionando, o serviço pode estar temporariamente indisponível.',
    podeTentarNovamente: true,
  },
  inesperado: {
    titulo: 'Não foi possível concluir o envio',
    mensagem:
      'Ocorreu um erro inesperado durante o envio. Tente novamente em alguns ' +
      'instantes. Se o problema continuar, procure seu contato na rede varejista.',
    podeTentarNovamente: true,
  },
};

function montar(codigo: CodigoErroUpload): ErroUpload {
  return { codigo, ...MENSAGENS[codigo] };
}

function ehCodigoConhecido(valor: string): valor is CodigoErroUpload {
  return valor in MENSAGENS;
}

/**
 * Extrai o código estável do campo `type`. O contrato define `type` como URI
 * com prefixo fixo; o último segmento é o código.
 */
function codigoDoType(type: unknown): CodigoErroUpload | null {
  if (typeof type !== 'string' || !type.startsWith(PREFIXO_PROBLEMA)) {
    return null;
  }
  const slug = type.slice(PREFIXO_PROBLEMA.length);
  return ehCodigoConhecido(slug) ? slug : null;
}

/**
 * Interpreta uma resposta de erro do backend. Só deve ser chamada quando
 * `resposta.ok` for falso.
 *
 * Resposta que não traz um `type` conhecido cai em `inesperado` — nada do
 * corpo bruto é aproveitado como texto de tela, porque o `detail` do contrato
 * é voltado a quem depura, não ao fornecedor.
 */
export async function interpretarRespostaDeErro(resposta: Response): Promise<ErroUpload> {
  let corpo: unknown;
  try {
    corpo = await resposta.json();
  } catch {
    return montar('inesperado');
  }

  const type = (corpo as { type?: unknown } | null)?.type;
  const codigo = codigoDoType(type);
  return montar(codigo ?? 'inesperado');
}

/**
 * Interpreta uma exceção lançada pela camada de rede — `fetch` rejeita em
 * falha de conexão, DNS ou indisponibilidade, sem produzir `Response`.
 */
export function interpretarFalhaDeRede(): ErroUpload {
  return montar('indisponivel');
}

/**
 * Converte um ApiError do contrato do backend em ErroUpload para apresentação.
 * Usa o `type` do Problem Details para identificar o erro.
 */
export function erroUploadDe(problema: { type: string }): ErroUpload {
  const codigo = codigoDoType(problema.type);
  return montar(codigo ?? 'inesperado');
}

/**
 * Ponto único de entrada para o fluxo de upload: executa a chamada e devolve
 * `null` em sucesso, ou o erro já traduzido. Concentra aqui os dois caminhos
 * de falha (resposta de erro e exceção de rede), para que nenhuma tela precise
 * lembrar de tratar os dois.
 */
export async function capturarErro(chamada: () => Promise<Response>): Promise<ErroUpload | null> {
  let resposta: Response;
  try {
    resposta = await chamada();
  } catch {
    return interpretarFalhaDeRede();
  }

  if (resposta.ok) {
    return null;
  }
  return interpretarRespostaDeErro(resposta);
}
