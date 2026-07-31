# ADR-0004: Stack Frontend — React/Next.js com API Gateway REST em vez de AppSync

## Status

Aceito (2026-07-30)

## Data

2026-07-30

## Autor(es)

André Luiz Ferreira (Frontend Architect & Stack)

---

## Contexto

O escopo sugere React/Next.js + AppSync/API Gateway + Cognito, hospedado em CloudFront + S3 — explicitamente como "ponto de partida para discussão do time" (apresentacao-time.html, seção 02).

Duas questões precisam ser resolvidas:
1. **Componentes da stack frontend** — linguagem, framework, ferramenta de teste
2. **Padrão de integração com o backend** — AppSync (GraphQL com subscription) vs. REST (HTTP padrão com polling)

A escolha é crítica porque:
- Define qual ferramenta de teste será adotada (impacta `docs/quality.md`)
- Determina o padrão de chamada ao backend
- Uma vez implementado, é dificilmente reversível

---

## Decisão

**Adotar React 18 + Next.js 14 (AppRouter) + TypeScript + Vitest + React Testing Library, hospedado em CloudFront + S3, com API Gateway REST (em vez de AppSync) como padrão de integração.**

Detalhamento:

| Componente | Escolha | Motivo |
|---|---|---|
| **Linguagem** | TypeScript | Tipagem estática em projeto frontend com 2+ telas complexas reduz bugs e facilita refactoring |
| **Framework** | Next.js 14 + App Router | SSR quando necessário, roteamento integrado, API Routes para BFF, suporte a tipos automático |
| **Testes** | Vitest + React Testing Library | Executado em milissegundos vs. segundos (Jest padrão); sintaxe familiar; integração nativa com Vite/Next.js |
| **Integração com backend** | API Gateway REST (não AppSync) | Polling é suficiente; AppSync traz overhead sem ganho de feature neste momento (backend não especificou WebSocket/SSE); testes são mais diretos com HTTP padrão |
| **Hospedagem** | CloudFront + S3 | Serverless, custo por uso, alinhado com o serverless-first da plataforma |
| **Autenticação** | Cognito + NextAuth.js | Cognito gerenciado pela AWS; NextAuth.js simplifica flow OAuth no frontend sem lidar com tokens manualmente |
| **Estado / Dados** | React Query (TanStack Query) + React hooks | Cache e refetch automático de API, reutilizável entre componentes, reduz boilerplate |
| **Componentes UI** | Componentes próprios + Tailwind CSS | Sem dependência de biblioteca pesada de UI; total controle de design e acessibilidade |

---

## Alternativas Consideradas

| Alternativa | Prós | Contras | Motivo da rejeição |
|---|---|---|---|
| **Adotar AppSync + React + AWS Amplify** | Realtime nativo; SDK AWS integrado; GraphQL | Backend não especificou realtime (não há WebSocket/SSE); AppSync é serviço dedicado = custo; testes de subscription mais complexos | Overhead sem feature correspondente. Polling com REST é suficiente e mais simples. |
| **Vue 3 + Vite** | Mais leve; SFC elegante; comunidade crescente | Menos mercado; fewer libs de integração AWS; comunidade menor para troubleshooting em projeto novo | React é padrão de mercado e tem 10x mais resources para learning. Equipe conhece React. |
| **Astro (SSG puro)** | Build-time rendering; performance extrema | Não é apropriado para aplicação interativa (painel do gestor tem estado/filtros); seria um mismatch | Painel não é site estático — é app interativa. |
| **SvelteKit** | Reatividade compilada; DX excelente; bundle menor | Comunidade pequena; menos libs; integração AWS menos comum | Projeto prático em empresa varejista — React é skill padrão de mercado. Astro não muda isso. |

---

## Consequências

### Positivas

- **Ferramenta de teste definida e familiar:** Vitest é padrão em projetos Next.js, testes rodam em segundos, não minutos. Bruno consegue escrever critérios de qualidade baseados em Vitest.
- **API rest familiar:** Toda equipe conhece HTTP + REST; integração com backend é via URL padrão; mocking é trivial (MockServiceWorker, node-fetch).
- **Tipagem estática:** TypeScript reduz bugs em componentes complexos (painel do gestor, filtros, paginação).
- **Polling é suficiente para Fase 01:** Não há WebSocket/SSE especificado no backend. Polling com React Query é feito em poucas linhas e é perfeitamente aceitável para MVP.
- **Total controle sobre componentes:** UI própria + Tailwind = sem dependência de biblioteca pesada; acessibilidade é controle nosso desde o início.
- **NextAuth.js simplifica Cognito:** Não precisa lidar com tokens manualmente; OAuth flow já é implementado.

### Negativas / Trade-offs aceitos

- **AppSync fica como future option:** Se realtime virar requisito, precisará de ADR de revisão e refactor. Trade-off: simplicidade inicial vs. possível refactor depois.
- **Menos "serverless-first" no backend do BFF:** Next.js API Routes são serverless, mas rodam como Lambda sob CloudFront + S3. Se a carga ficar muito pesada, será preciso considerar Lambda explícita ou Fargate. Por enquanto é acceptable.
- **State management é manual:** Não estamos usando Redux/Zustand/Jotai; React hooks + React Query são suficientes para MVP. Se estado crescer demais, considerar Redux.
- **Testing async / API mocking:** Vitest + MSW exigem conhecimento específico. Documentar padrão em `engineering-principles.md`.

---

## Impacto em Outros Documentos

- [x] `docs/engineering-principles.md` — preenchido com stack, convenções, padrões de teste
- [x] `docs/quality.md` — Vitest + React Testing Library declarado como ferramenta de teste obrigatória
- [x] `STATUS.md` — ADR-0004 registrado como aceito

---

## Referências

- [apresentacao-time.html](../../escopo/apresentacao-time.html), seção 02 — stack sugerida
- [CLAUDE.md](../../CLAUDE.md), seção 1.2 — liberdade de stack com justificativa em ADR
- [GitHub — Vitest](https://vitest.dev/)
- [GitHub — React Query (TanStack Query)](https://tanstack.com/query/)
- [NextAuth.js — Authentication for Next.js](https://next-auth.js.org/)
