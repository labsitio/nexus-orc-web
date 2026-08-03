import type { ErroUpload as ErroUploadModel } from '@/lib/erros-upload';

interface ErroUploadProps {
  erro: ErroUploadModel;
  /**
   * Repete a última ação sem refazer o preenchimento do formulário. Só é
   * oferecida quando o erro admite nova tentativa.
   */
  onTentarNovamente?: () => void;
}

/**
 * Apresentação de um erro do fluxo de upload — issue #42.
 *
 * Renderiza apenas texto já traduzido em `lib/erros-upload`. Nenhum dado cru da
 * resposta (corpo, URL assinada, stack) chega até aqui, por construção.
 */
export function ErroUpload({ erro, onTentarNovamente }: ErroUploadProps) {
  const podeTentar = erro.podeTentarNovamente && onTentarNovamente !== undefined;

  return (
    <div
      role="alert"
      data-codigo-erro={erro.codigo}
      className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900"
    >
      <h2 className="font-semibold">{erro.titulo}</h2>
      <p className="mt-1 text-sm">{erro.mensagem}</p>
      {podeTentar && (
        <button
          type="button"
          onClick={onTentarNovamente}
          className="mt-3 rounded bg-red-700 px-3 py-1.5 text-sm font-medium text-white"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
