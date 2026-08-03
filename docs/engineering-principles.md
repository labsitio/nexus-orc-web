# Princípios de Engenharia — Projeto Nexo

> Documento vivo, de responsabilidade do agente **Frontend Developer** (André — ver [team-responsibilities.md](team-responsibilities.md)). Deve definir stack, bibliotecas e convenções de código. Decisões amplas e dificilmente reversíveis registradas aqui **devem** ter um ADR correspondente em `docs/adr/`.

Este documento **não deve** conter decisões de arquitetura de sistema (isso pertence a [architecture.md](architecture.md)) nem critérios de qualidade/aceite (isso pertence a [quality.md](quality.md)).

---

## 1. Stack Definida

| Camada | Escolha | ADR relacionado |
|---|---|---|
| Linguagem | TypeScript 5.x | [ADR-0004](adr/0004-stack-frontend.md) |
| Framework | Next.js 14 (App Router) + React 18 | [ADR-0004](adr/0004-stack-frontend.md) |
| Build & Dev | Next.js (Webpack/Turbopack) | [ADR-0004](adr/0004-stack-frontend.md) |
| Testes unitários | Vitest | [ADR-0004](adr/0004-stack-frontend.md) |
| Testes de componentes | React Testing Library | [ADR-0004](adr/0004-stack-frontend.md) |
| Integração com API | React Query (TanStack Query) | [ADR-0004](adr/0004-stack-frontend.md) |
| Estilos | Tailwind CSS | [ADR-0004](adr/0004-stack-frontend.md) |
| Autenticação | Cognito + NextAuth.js | [ADR-0004](adr/0004-stack-frontend.md) |
| Hospedagem | CloudFront + S3 (via CI/CD) | [ADR-0004](adr/0004-stack-frontend.md) |

---

## 2. Bibliotecas e Dependências

**Dependências principais:**

- `react` (18.x) — framework base
- `next` (14.x) — framework com App Router
- `typescript` (5.x) — tipagem estática
- `@tanstack/react-query` (v5.x) — cache, refetch, sincronização com backend
- `next-auth` — autenticação OAuth via Cognito
- `tailwindcss` — utilitários CSS
- `clsx` ou `classnames` — composição condicional de classes

**Dependências de desenvolvimento:**

- `vitest` — executor de testes ultrarrápido
- `@testing-library/react` — testes de componentes
- `@testing-library/user-event` — simulação de eventos do usuário
- `@testing-library/jest-dom` — matchers customizadas (ex: `toBeInTheDocument`)
- `msw` (Mock Service Worker) — mocking de requisições HTTP
- `eslint`, `prettier` — linting e formatação
- `@types/node`, `@types/react` — tipagem

**Critério de escolha:**
- Preferir bibliotecas com tipos TypeScript built-in
- Evitar dependências que duplicam funcionalidade do Next.js ou React
- Priorizar bibliotecas com comunidade ativa e low-churn
- Documentar a razão de cada dependência principal em issue/PR

---

## 3. Convenções de Código

**Nomenclatura:**

- Componentes React: PascalCase (`UserCard.tsx`, `UploadForm.tsx`)
- Funções e variáveis: camelCase (`fetchBudgets`, `isLoading`)
- Constantes: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- Arquivos: kebab-case exceto componentes (`auth.ts`, `UserCard.tsx`, `api-client.ts`)

**Organização de pastas:**

Estrutura de monorepo conforme ADR-0006: `/apps/upload`, `/apps/dashboard`, `shared/`.

```
apps/
├── upload/              # Portal de upload (Fase 01)
│   ├── src/
│   │   ├── app/         # App Router do Next.js (rotas e layouts)
│   │   ├── components/  # Componentes específicos do portal
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities e helpers
│   │   ├── types/       # Definições TypeScript
│   │   └── styles/      # Estilos globais, variáveis Tailwind
│   ├── package.json
│   └── next.config.mjs
│
├── dashboard/           # Painel do gestor (Fase 02+)
│   ├── src/
│   │   ├── app/         # App Router do Next.js (rotas e layouts)
│   │   ├── components/  # Componentes de dashboard
│   │   ├── hooks/       # Custom hooks (useQuery para polling, etc.)
│   │   ├── lib/         # Utilities e helpers
│   │   ├── types/       # Definições TypeScript
│   │   └── styles/      # Estilos globais, variáveis Tailwind
│   ├── package.json
│   └── next.config.mjs
│
shared/                 # Código compartilhado entre apps
├── src/
│   ├── components/      # Componentes de UI genéricos (Button, Card, etc.)
│   ├── hooks/           # Hooks reutilizáveis (useAuth, useFetch, etc.)
│   ├── types/           # Tipos e interfaces compartilhadas
│   └── lib/             # Utilitários compartilhados
└── package.json
```

**Convenção de imports:**
- Dentro de um app: `import { Button } from '@/components/ui/Button'`
- De shared: `import { Button } from '@shared/components/Button'`

**Estilos de código:**

- Usar `const` sempre que possível, `let` raramente, nunca `var`
- Arrow functions para callbacks, nomeadas para exports
- Quebra de linha máxima: 100 caracteres (configurado em `.prettierrc`)
- Trailing semicolons obrigatórios
- Espaçamento de 2 espaços (configurado em `.prettierrc`)

**TypeScript:**

- Sempre tipificar parâmetros e retorno de funções
- Evitar `any` — usar `unknown` se necessário, depois refinar o tipo
- Tipo explícito para props de componentes (interface `ComponentProps`)
- Tipo de retorno explícito para funções que retornam promise

---

## 4. Padrões de Componentização / Estrutura

**Componentes React:**

- Um arquivo por componente (ex: `Button.tsx`)
- Componente funcional com hooks, sem class components
- Props tipificadas: `interface ComponentProps { ... }` ou `type ComponentProps = { ... }`
- Exports nomeados, não default export (permite refactoring seguro)

**Exemplo de componente:**

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const classes = `btn btn-${variant} ${disabled ? 'opacity-50' : ''}`;
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

**Custom Hooks:**

- Prefixar com `use` (ex: `useFetchBudgets`)
- Isolam lógica reutilizável (dados, estado, efeitos)
- Testáveis via `@testing-library/react` hook `renderHook`

**Integração com API:**

- Usar React Query para refetch, cache e sincronização
- Funções API em `src/api/` retornam promises
- Exemplo: `useFetchBudgets()` usa `useQuery` internamente, não a função bruta

---

## 5. Gerenciamento de Estado

**Estado local:**
- React `useState` para estado de componente simples
- Context API apenas se múltiplos componentes profundos precisarem do mesmo estado

**Estado remoto (dados do servidor):**
- React Query (`useQuery`, `useMutation`) — **obrigatório** para requisições HTTP
- Não duplicar estado de servidor em estado local (React Query já cacheado)

**Exemplo:**

```typescript
// ❌ Errado: duplicação
const [budgets, setBudgets] = useState([]);
useEffect(() => {
  fetch('/api/budgets').then(setBudgets);
}, []);

// ✅ Certo: React Query
const { data: budgets } = useQuery({
  queryKey: ['budgets'],
  queryFn: () => fetch('/api/budgets').then(r => r.json()),
});
```

---

## 6. Testes (do ponto de vista de convenção, não de critério de aceite)

**Estrutura de testes:**

- Um arquivo de teste por componente ou função: `ComponentName.test.tsx` ou `helper.test.ts`
- Localizado no mesmo diretório do código testado (colocation)
- Usar `describe` para agrupar testes relacionados

**Comando de teste:**

```bash
npm run test
```

Configurado em `vitest.config.ts` com `globals: true` para permitir `describe`, `it`, `expect` sem imports. Testes rodam em modo watch por padrão.

**Padrão de teste de componente:**

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

**Mocking de API:**

- Usar Mock Service Worker (MSW) para interceptar requisições HTTP
- Configurar handlers em `src/test/mocks.ts` ou `vitest.setup.ts`
- Não mockar React Query diretamente — mockar a API subjacente

**Cobertura:**

- Prioridade: funções críticas (cálculos, validação) > componentes de UI
- Critérios de cobertura definidos em `quality.md`

---

## 7. Diretrizes de Performance e Acessibilidade

**Performance:**

- Bundle size monitorado: rodar `npm run build` e revisar tamanho final em `next.js` analytics
- Lazy load componentes pesados via `React.lazy` e `Suspense`
- Evitar re-renders desnecessários: usar `React.memo` e `useCallback` apenas onde mensurável
- Imagens otimizadas: usar `<Image>` do Next.js, não `<img>`

**Acessibilidade (WCAG 2.1 AA):**

- Todos os formulários devem ter `<label>` associado a `<input>`
- Estrutura semântica: usar `<main>`, `<nav>`, `<section>` apropriadamente
- Contraste de cor mínimo: 4.5:1 para texto, 3:1 para ícones
- Teclado navegável: `Tab` deve percorrer todos os elementos interativos
- ARIA labels onde texto visível não seja suficiente
- Revisar com ferramentas: axe DevTools, Lighthouse audit

---

## 8. Débitos Técnicos Conhecidos

1. **Sem realtime nativo (polling apenas)** — backend não especificou WebSocket/SSE; polling com React Query é suficiente para MVP. Se realtime virar requisito, considerar AppSync (ver ADR-0004).

2. **Componentes UI sem biblioteca externa** — temos total controle, mas significa mais CSS a manter. Trade-off: zero dependency bloat vs. mais código. Reavaliado se crescer demais.

3. **State management sem Redux** — React hooks + React Query são suficientes para Fase 01. Se estado crescer exponencialmente, considerar Redux.

---

## Referências

- [ADR-0004](adr/0004-stack-frontend.md) — Decisão de stack
- [docs/architecture.md](architecture.md) — Arquitetura de interfaces
- [docs/quality.md](quality.md) — Critérios de teste e cobertura
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vitest docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Tailwind CSS](https://tailwindcss.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
