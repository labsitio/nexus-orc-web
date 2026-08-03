const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/v1';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public problem: ProblemDetails,
  ) {
    super(problem.detail);
    this.name = 'ApiError';
  }
}

async function parseErrorResponse(response: Response): Promise<ProblemDetails> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/problem+json')) {
    return response.json();
  }
  return {
    type: `https://nexo.internal/problems/erro-desconhecido`,
    title: 'Erro desconhecido',
    status: response.status,
    detail: `Erro ${response.status} do servidor.`,
    instance: new URL(response.url).pathname,
  };
}

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * A URL temporária do S3 chega absoluta, do próprio backend — prefixá-la com
 * `API_BASE` produziria `/v1https://...`, que o `fetch` rejeita. Só o que é
 * caminho relativo da nossa API recebe o prefixo.
 */
function urlDe(endpoint: string): string {
  return /^https?:\/\//.test(endpoint) ? endpoint : `${API_BASE}${endpoint}`;
}

async function apiRequest(
  endpoint: string,
  options: RequestOptions = {},
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(urlDe(endpoint), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const problem = await parseErrorResponse(response);
    throw new ApiError(response.status, problem);
  }

  return response;
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await apiRequest(endpoint, { ...options, method: 'GET' });
    return response.json();
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const response = await apiRequest(endpoint, {
      ...options,
      method: 'POST',
      headers: { ...(options?.headers || {}), 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  },

  async put(endpoint: string, body?: unknown, options?: RequestOptions): Promise<void> {
    await apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      headers: { ...(options?.headers || {}), 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async putBinary(
    endpoint: string,
    file: File,
    options?: RequestOptions,
  ): Promise<void> {
    await apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: file,
    });
  },
};
