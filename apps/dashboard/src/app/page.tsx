'use client';

import { useState } from 'react';
import { DetalheOrcamento } from '@/components/DetalheOrcamento';
import { ORCAMENTOS_DEMO } from '@/demo-data/orcamentos';
import { ROTULO_STATUS } from '@/types/orcamento';

/**
 * Painel de Acompanhamento (issue #46, Fase 02).
 *
 * Exibe o **detalhe** de um orçamento e as etapas do pipeline. A seleção
 * entre os orçamentos de demonstração é local (`useState`), sem rota nova:
 * não existe endpoint de listagem no contrato do backend, então esta não é
 * a lista de orçamentos da Fase 03.
 */
export default function Home() {
  const [indiceSelecionado, setIndiceSelecionado] = useState(0);
  const orcamentoSelecionado = ORCAMENTOS_DEMO[indiceSelecionado];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-4">Painel de Acompanhamento</h1>
          <p className="text-gray-600">
            Acompanhe o ciclo de vida completo de seus orçamentos.
          </p>
        </header>

        <nav aria-label="Orçamentos de demonstração">
          <ul className="flex flex-wrap gap-2">
            {ORCAMENTOS_DEMO.map((orcamento, indice) => {
              const selecionado = indice === indiceSelecionado;
              return (
                <li key={orcamento.orcamentoId}>
                  <button
                    type="button"
                    aria-current={selecionado ? 'true' : undefined}
                    onClick={() => setIndiceSelecionado(indice)}
                    className={[
                      'rounded border px-3 py-2 text-sm',
                      selecionado
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white text-gray-700',
                    ].join(' ')}
                  >
                    {orcamento.resultadoAtual.fornecedorIdentificado}
                    <span className="ml-2 opacity-75">
                      ({ROTULO_STATUS[orcamento.status]})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="rounded-lg bg-white p-6 shadow">
          <DetalheOrcamento orcamento={orcamentoSelecionado} />
        </div>

        <p className="text-xs text-gray-500">
          Dado de demonstração estático — sem integração com a API do backend.
        </p>
      </div>
    </main>
  );
}
