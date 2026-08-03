import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useFileUpload } from './useFileUpload';
import { uploadHandlers } from '@/test/mocks';
import { ApiError } from '@/lib/api-client';

const API_BASE = '/v1';
const ORCAMENTO_ID_FIXO = '018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f';
const TEST_TOKEN = 'test-token';

const server = setupServer(...uploadHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 0 },
      mutations: { retry: 0 },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useFileUpload', () => {
  it('executes complete upload flow and calls onSuccess', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useFileUpload({
          token: TEST_TOKEN,
          onSuccess,
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

    await waitFor(() => expect(result.current.isPending).toBe(false), { timeout: 5000 });

    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith({
      orcamentoId: ORCAMENTO_ID_FIXO,
      status: 'RECEBIDO',
    });
  });

  it('generates Idempotency-Key on first upload and reuses on retry', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);
    let callCount = 0;
    const idempotencyKeys: string[] = [];

    server.use(
      http.post(`${API_BASE}/orcamentos/:orcamentoId/confirmar-upload`, ({ request }) => {
        const key = request.headers.get('Idempotency-Key');
        if (key) idempotencyKeys.push(key);

        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { type: 'https://nexo.internal/problems/network', title: 'Error', status: 500 },
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

    await waitFor(() => expect(result.current.error).toBeTruthy(), { timeout: 5000 });

    const firstKey = result.current.idempotencyKey;
    expect(firstKey).toBeDefined();

    result.current.upload({ file, uploadRequest });

    await waitFor(() => expect(result.current.isPending).toBe(false), { timeout: 5000 });

    expect(result.current.data).toBeDefined();
    expect(idempotencyKeys).toHaveLength(2);
    expect(idempotencyKeys[0]).toBe(idempotencyKeys[1]);
    expect(result.current.idempotencyKey).toBe(firstKey);
  });

  it('handles error when upload fails', async () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);
    const onError = vi.fn();

    server.use(
      http.post(`${API_BASE}/orcamentos/upload-url`, () =>
        HttpResponse.json(
          {
            type: 'https://nexo.internal/problems/validacao',
            title: 'Validation failed',
            status: 400,
            detail: 'Missing required field',
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
          onError,
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

    await waitFor(() => expect(result.current.error).toBeTruthy(), { timeout: 5000 });

    expect(onError).toHaveBeenCalled();
    expect(result.current.error).toBeInstanceOf(ApiError);
  });

  it('resets state and idempotency key', async () => {
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

    await waitFor(() => expect(result.current.isPending).toBe(false), { timeout: 5000 });

    const firstKey = result.current.idempotencyKey;
    expect(firstKey).toBeDefined();

    // `reset()` limpa estado do React fora de um evento — sem `act`, a
    // atualização não é aplicada antes da asserção.
    act(() => result.current.reset());

    expect(result.current.idempotencyKey).toBeNull();
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    result.current.upload({ file, uploadRequest });

    await waitFor(() => expect(result.current.isPending).toBe(false), { timeout: 5000 });

    expect(result.current.idempotencyKey).not.toBe(firstKey);
  });
});
