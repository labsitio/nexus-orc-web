'use client';

import { useEffect, useState } from 'react';

/**
 * Liga o mock do navegador antes de liberar a aplicação (issue #15 — o mock
 * é ponte, não destino).
 *
 * **Ligado por padrão, desligado explicitamente** com
 * `NEXT_PUBLIC_USAR_MOCK=false`. A escolha é deliberada: enquanto não existe
 * API real (ver a limitação declarada no README), quem clona o repositório
 * precisa ter o fluxo navegável sem configurar nada — e arquivo `.env.local`
 * não é versionado, então depender dele quebraria a máquina limpa. Quando a
 * API real entrar, é a troca de uma variável, não de código.
 *
 * As chamadas ficam retidas até o worker estar de pé. Sem essa espera, o
 * primeiro envio escaparia da interceptação e voltaria 404 — que é exatamente
 * o defeito que este componente existe para resolver.
 */
const USAR_MOCK = process.env.NEXT_PUBLIC_USAR_MOCK !== 'false';

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [pronto, setPronto] = useState(!USAR_MOCK);

  useEffect(() => {
    if (!USAR_MOCK) {
      return;
    }

    let cancelado = false;

    import('@/test/browser')
      .then(({ worker }) =>
        worker.start({
          // Só as rotas do contrato são mockadas; o resto (assets, HMR do
          // Next) precisa seguir para a rede sem virar erro no console.
          onUnhandledRequest: 'bypass',
          quiet: true,
        }),
      )
      .finally(() => {
        if (!cancelado) {
          setPronto(true);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  if (!pronto) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Preparando ambiente de demonstração...
      </div>
    );
  }

  return <>{children}</>;
}
