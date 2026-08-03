import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useFileUpload } from './useFileUpload';
import { uploadHandlers, confirmarUploadNaoConcluidoHandler } from '@/test/mocks';
import { ApiError } from '@/lib/api-client';

const API_BASE = '/v1';
const ORCAMENTO_ID_FIXO = '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f';
const TEST_TOKEN = 'test-token';

const server = setupServer(...uploadHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useFileUpload', () => {
  it('executes complete upload flow: generate URL → upload file → confirm', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);
    let successResult: unknown;

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
          onSuccess: (data) => {
            successResult = data;
          },
        }),
      { wrapper },
    );

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const uploadRequest = {
      canal: 'PORTAL_WEB',
      nomeArquivo: 'test.pdf',
      tipoConteudo: 'application/pdf',
    };

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(successResult).toEqual({
      orcamentoId: ORCAMENTO_ID_FIXO,
      status: 'RECEBIDO',
    });
  });

  it('reuses same Idempotency-Key on retry after network failure in confirm step', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);
    let callCount = 0;
    let idempotencyKeys: string[] = [];

    server.use(
      http.post(`${API_BASE}/orcamentos/:orcamentoId/confirmar-upload`, ({ request }) => {
        callCount++;
        const idempotencyKey = request.headers.get('Idempotency-Key');
        if (idempotencyKey) {
          idempotencyKeys.push(idempotencyKey);
        }

        if (callCount === 1) {
          return HttpResponse.json(
            { type: 'https://nexo.internal/problems/network-error', title: 'Network error' },
            { status: 500 },
          );
        }

        return HttpResponse.json(
          {
            orcamentoId: ORCAMENTO_ID_FIXO,
            status: 'RECEBIDO',
            recebidoEm: '2026-08-03T17:00:00Z',
          },
          { status: 200 },
        );
      }),
    );

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
        }),
      { wrapper },
    );

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const uploadRequest = {
      canal: 'PORTAL_WEB',
      nomeArquivo: 'test.pdf',
      tipoConteudo: 'application/pdf',
    };

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    const firstIdempotencyKey = result.current.idempotencyKey;
    expect(firstIdempotencyKey).toBeDefined();

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(idempotencyKeys).toHaveLength(2);
    expect(idempotencyKeys[0]).toBe(idempotencyKeys[1]);
  });

  it('handles error when generating upload URL fails', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);
    let errorReceived: ApiError | Error | null = null;

    server.use(
      http.post(`${API_BASE}/orcamentos/upload-url`, () =>
        HttpResponse.json(
          {
            type: 'https://nexo.internal/problems/validacao',
            title: 'Validação falhou',
            status: 400,
            detail: 'Campo obrigatório ausente: canal',
            instance: '/v1/orcamentos/upload-url',
          },
          { status: 400 },
        ),
      ),
    );

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
          onError: (error) => {
            errorReceived = error;
          },
        }),
      { wrapper },
    );

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const uploadRequest = {
      canal: 'PORTAL_WEB',
      nomeArquivo: 'test.pdf',
      tipoConteudo: 'application/pdf',
    };

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(errorReceived).toBeInstanceOf(ApiError);
  });

  it('handles error when file upload to S3 fails', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    server.use(
      http.put('https://nexo-orcamentos-raw.s3.amazonaws.com/pending/*', () =>
        HttpResponse.json(
          { error: 'Access Denied' },
          { status: 403 },
        ),
      ),
    );

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
        }),
      { wrapper },
    );

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const uploadRequest = {
      canal: 'PORTAL_WEB',
      nomeArquivo: 'test.pdf',
      tipoConteudo: 'application/pdf',
    };

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('handles 409 (conflict) when confirm fails because file upload is incomplete', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    server.use(confirmarUploadNaoConcluidoHandler);

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
        }),
      { wrapper },
    );

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const uploadRequest = {
      canal: 'PORTAL_WEB',
      nomeArquivo: 'test.pdf',
      tipoConteudo: 'application/pdf',
    };

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    if (result.current.error instanceof ApiError) {
      expect(result.current.error.statusCode).toBe(409);
    }
  });

  it('resets state and generates new Idempotency-Key when reset is called', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
        }),
      { wrapper },
    );

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const uploadRequest = {
      canal: 'PORTAL_WEB',
      nomeArquivo: 'test.pdf',
      tipoConteudo: 'application/pdf',
    };

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    const firstKey = result.current.idempotencyKey;

    result.current.reset();

    expect(result.current.idempotencyKey).toBeNull();
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    result.current.upload({ file, uploadRequest });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    const secondKey = result.current.idempotencyKey;

    expect(secondKey).not.toBe(firstKey);
  });
});
