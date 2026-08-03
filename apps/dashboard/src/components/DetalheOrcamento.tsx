/**
 * Detalhe de um orçamento no Painel de Acompanhamento (issue #46, Fase 02).
 *
 * Recebe o orçamento por prop — não busca dado. A origem (mock de
 * demonstração hoje, API real depois) é decisão de quem monta a página.
 *
 * Estados terminais que não são erro (`VALIDADO_COM_RESSALVA`,
 * `EXTRAIDO_COM_PENDENCIA_CONFIRMADA`, `FALHA_INDEXACAO`) são apresentados
 * como resultado válido, não como falha — docs/quality.md, seção 3.
 */

import { EtapasPipeline } from './EtapasPipeline';
import {
  ROTULO_CANAL,
  ROTULO_STATUS,
  ROTULO_AGENTE,
  statusEhErro,
  type StatusIngestao,
} from '@/types/orcamento';

interface DetalheOrcamentoProps {
  orcamento: StatusIngestao;
}

export function DetalheOrcamento({ orcamento }: DetalheOrcamentoProps) {
  const ehErro = statusEhErro(orcamento.status);
  const { resultadoAtual } = orcamento;

  return (
    <article className="space-y-6" data-testid="detalhe-orcamento">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold">Orçamento</h2>
          <span
            data-testid="status-orcamento"
            data-status={orcamento.status}
            data-erro={ehErro ? 'true' : 'false'}
            className={[
              'rounded-full px-3 py-1 text-sm font-medium',
              ehErro
                ? 'bg-red-100 text-red-800'
                : 'bg-emerald-100 text-emerald-800',
            ].join(' ')}
          >
            {ROTULO_STATUS[orcamento.status]}
          </span>
        </div>
        <dl className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
          <div>
            <dt className="inline text-gray-500">Identificador: </dt>
            <dd className="inline font-mono" data-testid="orcamento-id">
              {orcamento.orcamentoId}
            </dd>
          </div>
          <div>
            <dt className="inline text-gray-500">Canal de entrada: </dt>
            <dd className="inline">{ROTULO_CANAL[orcamento.canal]}</dd>
          </div>
        </dl>
      </header>

      <section
        aria-labelledby="titulo-resultado-atual"
        className="rounded border border-gray-200 bg-white p-4"
      >
        <h3 id="titulo-resultado-atual" className="text-lg font-semibold mb-3">
          Resultado atual
        </h3>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Fornecedor identificado
            </dt>
            <dd className="font-medium">{resultadoAtual.fornecedorIdentificado}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Formato identificado
            </dt>
            <dd className="font-mono">{resultadoAtual.formatoIdentificado}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Nível de confiança
            </dt>
            <dd className="font-medium" data-testid="nivel-confianca">
              {resultadoAtual.nivelConfianca}%
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Agente de origem
            </dt>
            <dd>{ROTULO_AGENTE[resultadoAtual.agenteOrigem]}</dd>
          </div>
        </dl>
      </section>

      <EtapasPipeline historico={orcamento.historico} />
    </article>
  );
}
