/**
 * Linha do tempo das etapas do pipeline de um orçamento (issue #46).
 *
 * Renderiza uma entrada por item de `historico`, na ordem em que o backend
 * entregou — não reordena, porque a ordem é informação do pipeline.
 * `ocorreuEm` chega em UTC e é exibido em horário local; o valor original
 * fica preservado no atributo `dateTime` do `<time>`.
 */

import {
  formatarMomentoLocal,
  ROTULO_AGENTE,
  type EntradaHistorico,
} from '@/types/orcamento';

interface EtapasPipelineProps {
  historico: readonly EntradaHistorico[];
}

export function EtapasPipeline({ historico }: EtapasPipelineProps) {
  if (historico.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhuma etapa registrada para este orçamento.
      </p>
    );
  }

  return (
    <section aria-labelledby="titulo-etapas">
      <h3 id="titulo-etapas" className="text-lg font-semibold mb-3">
        Etapas do pipeline
      </h3>
      <ol className="space-y-3" data-testid="etapas-pipeline">
        {historico.map((entrada, indice) => {
          const houveInsucesso = entrada.motivoInsucesso !== null;
          return (
            <li
              key={`${entrada.agente}-${entrada.ocorreuEm}`}
              data-testid="etapa-pipeline"
              data-insucesso={houveInsucesso ? 'true' : 'false'}
              className={[
                'rounded border-l-4 bg-white p-3 shadow-sm',
                houveInsucesso
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-emerald-500',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">
                  {indice + 1}. {ROTULO_AGENTE[entrada.agente]}
                </span>
                <time
                  dateTime={entrada.ocorreuEm}
                  className="text-sm text-gray-600"
                >
                  {formatarMomentoLocal(entrada.ocorreuEm)}
                </time>
              </div>

              <p className="mt-1 text-sm text-gray-700">
                Confiança: {entrada.resultado.nivelConfianca}% — formato{' '}
                <code className="font-mono">
                  {entrada.resultado.formatoIdentificado}
                </code>
              </p>

              {houveInsucesso ? (
                <p
                  data-testid="motivo-insucesso"
                  className="mt-1 text-sm font-medium text-amber-800"
                >
                  Etapa repetida: {entrada.motivoInsucesso}
                </p>
              ) : (
                <p className="mt-1 text-sm text-emerald-700">Concluída com sucesso</p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
