'use client';

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { v7 as uuidv7 } from 'uuid';
import {
  executeUploadFlow,
  GenerateUploadUrlRequest,
  UploadFlowResult,
} from '@/api/upload';
import { ApiError } from '@/lib/api-client';

interface UseFileUploadOptions {
  token: string;
  onSuccess?: (result: UploadFlowResult) => void;
  onError?: (error: ApiError | Error) => void;
}

export function useFileUpload(options: UseFileUploadOptions) {
  // A ref é a fonte da verdade dentro da chamada — precisa ser lida de forma
  // síncrona no retry, sem depender de re-render. O estado espelha o valor só
  // para quem consome o hook: mutar a ref não notifica o React, então sem o
  // espelho `idempotencyKey` continuaria exibindo a chave antiga após `reset()`.
  const idempotencyKeyRef = useRef<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: {
      file: File;
      uploadRequest: GenerateUploadUrlRequest;
    }) => {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = uuidv7();
        setIdempotencyKey(idempotencyKeyRef.current);
      }

      return executeUploadFlow(
        params.file,
        params.uploadRequest,
        options.token,
        idempotencyKeyRef.current,
      );
    },
    onSuccess: (data) => {
      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error instanceof ApiError ? error : new Error(String(error)));
    },
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    reset: () => {
      mutation.reset();
      idempotencyKeyRef.current = null;
      setIdempotencyKey(null);
    },
    idempotencyKey,
  };
}
