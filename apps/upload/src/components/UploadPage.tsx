'use client';

import { useState } from 'react';
import { UploadForm } from './UploadForm';
import { ErroUpload } from './ErroUpload';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { GerarUploadUrlRequest } from '@/types/upload';

export interface UploadPageProps {
  token: string;
}

export function UploadPage({ token }: UploadPageProps) {
  const [orcamentoId, setOrcamentoId] = useState<string | null>(null);
  const [erro, setErro] = useState<{ tipo: string; mensagem: string } | null>(null);

  const { upload, isPending, reset } = useFileUpload({
    token,
    onSuccess: (data) => {
      setOrcamentoId(data.orcamentoId);
      setErro(null);
    },
    onError: (error) => {
      setErro({
        tipo: 'upload-error',
        mensagem: error.message || 'Erro ao enviar orçamento. Tente novamente.',
      });
      setOrcamentoId(null);
    },
  });

  const handleFormSubmit = (dados: GerarUploadUrlRequest, arquivo: File) => {
    setErro(null);
    upload({ file: arquivo, uploadRequest: dados });
  };

  const handleNovoEnvio = () => {
    reset();
    setOrcamentoId(null);
    setErro(null);
  };

  if (orcamentoId) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h2 className="text-lg font-semibold text-green-900">Orçamento enviado com sucesso!</h2>
          <p className="mt-2 text-sm text-green-700">ID do orçamento: {orcamentoId}</p>
          <p className="mt-1 text-sm text-green-700">
            Seu orçamento foi recebido e está sendo processado.
          </p>
        </div>
        <button
          onClick={handleNovoEnvio}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Enviar outro orçamento
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {erro && <ErroUpload tipo={erro.tipo} mensagem={erro.mensagem} />}
      <UploadForm onSubmit={handleFormSubmit} />
      {isPending && (
        <div className="rounded bg-blue-50 p-3 text-center text-sm text-blue-700">
          Enviando arquivo... aguarde.
        </div>
      )}
    </div>
  );
}
