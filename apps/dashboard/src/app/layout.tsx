import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel de Acompanhamento — Nexo',
  description: 'Acompanhe o ciclo de vida dos seus orçamentos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
