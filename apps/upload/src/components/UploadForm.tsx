'use client';

import { useId, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  validarArquivo,
  validarCnpjCpf,
  validarNomeContato,
} from '@/lib/validacao-formulario-upload';
import { CANAL_PORTAL_WEB } from '@/types/upload';
import type { GerarUploadUrlRequest } from '@/types/upload';

export interface UploadFormProps {
  /**
   * Chamado com os dados prontos para `POST /orcamentos/upload-url` e o
   * arquivo selecionado. A chamada HTTP em si (e o PUT no S3) é escopo da
   * issue #40 — este componente só monta o payload e dispara o callback.
   */
  onSubmit?: (dados: GerarUploadUrlRequest, arquivo: File) => void;
}

type CampoTocado = 'cnpjCpf' | 'nomeContato' | 'arquivo';

/**
 * Formulário de envio de orçamento — primeira tela do Portal de Upload
 * (issue #39). Captura arquivo e dados do fornecedor, valida no navegador
 * e monta o payload de `GerarUploadUrlRequest` (docs/architecture.md,
 * seção 2 e seção 5.1).
 *
 * PREMISSA (docs/architecture.md, seção 4): o fornecedor se identifica por
 * campo no formulário (CNPJ/CPF + contato), sem autenticação — ainda não
 * confirmado com o backend. Se isso mudar, estes campos podem mudar junto.
 */
export function UploadForm({ onSubmit }: UploadFormProps) {
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [nomeContato, setNomeContato] = useState('');
  const [referenciaExterna, setReferenciaExterna] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tocados, setTocados] = useState<Record<CampoTocado, boolean>>({
    cnpjCpf: false,
    nomeContato: false,
    arquivo: false,
  });
  const [enviando, setEnviando] = useState(false);

  const cnpjCpfId = useId();
  const nomeContatoId = useId();
  const referenciaExternaId = useId();
  const arquivoId = useId();

  const erroCnpjCpf = validarCnpjCpf(cnpjCpf);
  const erroNomeContato = validarNomeContato(nomeContato);
  const erroArquivo = validarArquivo(arquivo);

  const formularioValido = !erroCnpjCpf && !erroNomeContato && !erroArquivo;
  const podeEnviar = formularioValido && !enviando;

  const marcarTocado = (campo: CampoTocado) => {
    setTocados((atual) => ({ ...atual, [campo]: true }));
  };

  const handleCnpjCpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCnpjCpf(event.target.value);
    marcarTocado('cnpjCpf');
  };

  const handleNomeContatoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNomeContato(event.target.value);
    marcarTocado('nomeContato');
  };

  const handleReferenciaExternaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReferenciaExterna(event.target.value);
  };

  const handleArquivoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArquivo(event.target.files?.[0] ?? null);
    marcarTocado('arquivo');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Trava dupla: além do botão desabilitado, o handler ignora disparos
    // repetidos do mesmo preenchimento (ex: Enter + clique quase simultâneos).
    if (!formularioValido || !arquivo || enviando) {
      return;
    }

    setEnviando(true);

    const dados: GerarUploadUrlRequest = {
      canal: CANAL_PORTAL_WEB,
      nomeArquivo: arquivo.name,
      tipoConteudo: arquivo.type,
      ...(referenciaExterna.trim()
        ? { referenciaExterna: referenciaExterna.trim() }
        : {}),
    };

    onSubmit?.(dados, arquivo);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor={cnpjCpfId} className="block text-sm font-medium text-gray-700">
          CNPJ ou CPF do fornecedor
        </label>
        <input
          id={cnpjCpfId}
          name="cnpjCpf"
          type="text"
          value={cnpjCpf}
          onChange={handleCnpjCpfChange}
          onBlur={() => marcarTocado('cnpjCpf')}
          aria-invalid={tocados.cnpjCpf && Boolean(erroCnpjCpf)}
          aria-describedby={erroCnpjCpf ? `${cnpjCpfId}-erro` : undefined}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
        {tocados.cnpjCpf && erroCnpjCpf && (
          <p id={`${cnpjCpfId}-erro`} role="alert" className="mt-1 text-sm text-red-600">
            {erroCnpjCpf}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={nomeContatoId} className="block text-sm font-medium text-gray-700">
          Nome do contato
        </label>
        <input
          id={nomeContatoId}
          name="nomeContato"
          type="text"
          value={nomeContato}
          onChange={handleNomeContatoChange}
          onBlur={() => marcarTocado('nomeContato')}
          aria-invalid={tocados.nomeContato && Boolean(erroNomeContato)}
          aria-describedby={erroNomeContato ? `${nomeContatoId}-erro` : undefined}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
        {tocados.nomeContato && erroNomeContato && (
          <p id={`${nomeContatoId}-erro`} role="alert" className="mt-1 text-sm text-red-600">
            {erroNomeContato}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={referenciaExternaId} className="block text-sm font-medium text-gray-700">
          Referência externa do orçamento (opcional)
        </label>
        <input
          id={referenciaExternaId}
          name="referenciaExterna"
          type="text"
          value={referenciaExterna}
          onChange={handleReferenciaExternaChange}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor={arquivoId} className="block text-sm font-medium text-gray-700">
          Arquivo do orçamento (PDF ou imagem)
        </label>
        <input
          id={arquivoId}
          name="arquivo"
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={handleArquivoChange}
          aria-invalid={tocados.arquivo && Boolean(erroArquivo)}
          aria-describedby={erroArquivo ? `${arquivoId}-erro` : undefined}
          className="mt-1 block w-full text-sm text-gray-700"
        />
        {tocados.arquivo && erroArquivo && (
          <p id={`${arquivoId}-erro`} role="alert" className="mt-1 text-sm text-red-600">
            {erroArquivo}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!podeEnviar}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {enviando ? 'Enviando...' : 'Enviar orçamento'}
      </button>
    </form>
  );
}
