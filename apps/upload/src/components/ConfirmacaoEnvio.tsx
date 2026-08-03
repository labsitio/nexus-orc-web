'use client';

import { useState } from 'react';
import type { ConfirmarUploadResponse } from '@/types/upload';

export interface ConfirmacaoEnvioProps {
  /**
   * Resposta de `POST /orcamentos/{orcamentoId}/confirmar-upload`, já obtida
   * por quem chama — este componente só apresenta, não busca dado sozinho.
   */
  resposta: ConfirmarUploadResponse;
  /**
   * Começa um novo envio. A geração de uma nova chave de idempotência e o
   * reset do formulário são responsabilidade de quem chama (issue #40/#62) —
   * aqui só garantimos que o callback é disparado, sem carregar nenhum
   * estado do envio anterior.
   */
  onNovoEnvio: () => void;
}

/**
 * Formata um instante ISO 8601 UTC em horário local, para exibição
 * (docs/architecture.md, seção 5.1: o contrato trafega em UTC; a conversão é
 * só de apresentação).
 */
function formatarDataLocal(iso: string): string {
  return new Date(iso).toLocaleString();
}

/**
 * Tela de confirmação de envio — fecha o fluxo demonstrável da Fase 01
 * (issue #41). Mostra o identificador e o momento de recebimento devolvidos
 * pelo backend, exatamente como vieram (sem reformatar o identificador), e
 * oferece copiar o identificador e começar um novo envio.
 */
export function ConfirmacaoEnvio({ resposta, onNovoEnvio }: ConfirmacaoEnvioProps) {
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = async () => {
    await navigator.clipboard.writeText(resposta.orcamentoId);
    setCopiado(true);
  };

  return (
    <div
      role="status"
      className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-900"
    >
      <h2 className="font-semibold">Orçamento recebido</h2>
      <p className="mt-1 text-sm">
        Recebido em {formatarDataLocal(resposta.recebidoEm)}.
      </p>

      <dl className="mt-3 text-sm">
        <dt className="font-medium">Identificador do orçamento</dt>
        <dd className="mt-1 break-all font-mono">{resposta.orcamentoId}</dd>
      </dl>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleCopiar}
          className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white"
        >
          {copiado ? 'Copiado!' : 'Copiar'}
        </button>
        <button
          type="button"
          onClick={onNovoEnvio}
          className="rounded border border-green-700 px-3 py-1.5 text-sm font-medium text-green-900"
        >
          Enviar outro orçamento
        </button>
      </div>
    </div>
  );
}
