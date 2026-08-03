'use client';

import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 10 },
    mutations: { retry: 1 },
  },
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <Provider client={queryClient}>{children}</Provider>;
}
