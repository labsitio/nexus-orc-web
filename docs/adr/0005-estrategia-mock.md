# ADR-0005: Estratégia de Mock — Derivada do Contrato do Backend

**Status:** Aceito  
**Decisão:** 31/07/2026  
**Responsável:** André Luiz Ferreira (Frontend Architect)

---

## Problema

O backend do Nexo está em fase de **especificação**, não de implementação. Endpoints estão declarados em OpenAPI 3.1 (versão 0.1.0-provisional), mas o código ainda não existe.

O frontend não pode esperar implementação para começar — as fases 01 e 02 caem na janela de entrega (até 03/08). Precisamos de dados para testar, demonstrar e integrar.

**Opções:**
1. Frontend cria dados fake arbitrários, sem correlação com o backend
2. Frontend **deriva o mock do contrato OpenAPI que o backend já publicou**

A opção 1 gera divergência — "mock passou, mas produção falha" quando o backend implementa diferente.  
A opção 2 garante que mock ≈ realidade: ambos vêm da mesma fonte.

---

## Decisão

**Mock é derivado do contrato OpenAPI do backend.** Enquanto não há implementação:

1. Frontend lê [openapi.yaml](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml) do repositório deles
2. Gera dados fake a partir dos **schemas definidos lá** — tipos, enums, constraints, examples
3. Intercepta requisições HTTP em dev/test com **Mock Service Worker (MSW)**
4. Handlers MSW vivem em `src/test/mocks.ts`, organizados por operação
5. Dados fake são gerados com **@faker-js/faker** — UUIDs, datas ISO, nomes, arrays com tamanho variável
6. O mock **muda automaticamente quando o backend atualiza o OpenAPI**

---

## Justificativa

### Por que não dados arbitrários?

- **Risco alto de divergência:** mock com tipos errados passa localmente, falha em produção
- **Sem cobertura real:** testes passam contra dados fake genéricos, mas falham contra respostas reais
- **Retrabalho:** quando backend implementa, frontend precisa reescrever testes

### Por que MSW?

- **Interceptação HTTP nativa:** funciona com qualquer cliente HTTP (fetch, axios, React Query)
- **Sem mudança em código de app:** mock é transparente — `fetch('/api/budgets')` funciona igual em dev e produção
- **Fácil troca:** remove handlers MSW, aponta para URL real — tudo continua funcionando
- **Testável:** suíte de testes roda contra MSW, não contra servidor real

### Por que @faker-js/faker?

- **Realista:** gera dados que parecem reais — nomes, CPFs, datas, UUIDs válidos
- **Determinístico:** seed permite reproduzir dados — testes não são flaky
- **Customizável:** constrains (ex: "data entre 01/01/2026 e 31/07/2026") mapeiam para tipo de dado

---

## Impacto

### Escopo desta equipe

- [ ] Instalar MSW e @faker-js/faker em `package.json`
- [ ] Ler [openapi.yaml](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml) e mapear schemas para fake generators
- [ ] Criar `src/test/mocks.ts` com handlers MSW para endpoints de `/upload`, `/budgets`, `/budgets/{id}`, `/budgets/{id}/status`
- [ ] Integrar MSW em `vitest.setup.ts` — start server antes de testes
- [ ] Documentar em README como ativar/desativar mock (flag de ambiente ou hook)

### Escopo do backend (informativo, não ação nossa)

- [ ] Backend implementa endpoints de acordo com o OpenAPI que já publicaram
- [ ] Se mudança necessária no schema → atualiza OpenAPI → frontend recompila mock de forma automática (regeneração de dados)

---

## Trade-offs

| Aspecto | Escolha | Alternativa | Por quê |
|---|---|---|---|
| **Fonte de mock** | OpenAPI do backend | Dados inventados | Garante sincronização. Risco menor. |
| **Biblioteca de fake** | @faker-js/faker | Dados hardcoded | Faker é realista e determinístico. Hardcoded é frágil. |
| **Interceptação** | MSW | Proxy local / mock-backend | MSW é transparente, sem mudança em código. |
| **Quando trocar** | Manual: remover handlers MSW | Auto-detectar backend | Manual é previsível. Auto-detectar é complexo e gera comportamento surpresa. |

---

## Próximos Passos

1. Issue #12 (backlog de implementação) quebra work de mock em tasks específicas
2. Frontend Developer integra MSW + handlers em primeira sprint (Fase 01)
3. Testes rode contra MSW até ~15/08 (data estimada de primeira implementação do backend)
4. Quando backend implementa: remove-se MSW, testes passam contra URL real (sem mudança em código)

---

## Referências

- [docs/architecture.md](../architecture.md) — Seção 5 (contrato e mock)
- [openapi.yaml do backend](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml)
- [Mock Service Worker docs](https://mswjs.io/)
- [ADR-0004](0004-stack-frontend.md) — Stack: REST + polling, React Query
