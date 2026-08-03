import type { Metadata } from 'next';
import { QueryClientProvider } from '@/components/QueryClientProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Portal de Upload — Nexo',
  description: 'Envie seus orçamentos para processamento automático',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
