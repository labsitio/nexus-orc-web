# Arquitetura do Projeto Nexo

> Documento vivo, de responsabilidade do agente **Frontend Architect** (André — ver [team-responsibilities.md](team-responsibilities.md)). Deve ser preenchido e mantido atualizado à medida que decisões de arquitetura são tomadas. Decisões estruturais registradas aqui **devem** ter um ADR correspondente em `docs/adr/`.

Este documento **não deve** conter escolhas de stack, bibliotecas ou convenções de código — isso pertence a [engineering-principles.md](engineering-principles.md). Aqui vive a arquitetura da solução: como os componentes se relacionam, como os dados fluem, quais fronteiras existem.

**Escopo:** a arquitetura da frente de **frontend** do Nexo. Backend e mobile são conduzidos por outras equipes; o que pertence a elas deve aparecer aqui apenas como **fronteira e premissa**, nunca como decisão nossa.

---

## 1. Visão Geral da Arquitetura

O frontend do Nexo compreende **duas aplicações web distintas**, não um único sistema com múltiplas telas:

1. **Portal de Upload** (Fase 01) — interface pela qual fornecedores enviam orçamentos manualmente quando não têm integração automatizada (API REST, SFTP, canal mobile). Público, sem autenticação. Formulário simples → upload de arquivo → confirmação. MVP esperado para 02/08.

2. **Painel do Gestor** (Fase 02/03) — interface interna (gestores e equipes de compras) para acompanhar o ciclo de vida de orçamentos: status em tempo real, filtros, busca semântica, exportação de relatórios, alertas de erro e pendência. Autenticado (Cognito + NextAuth). Complexidade maior em visualização de dados e sincronização com backend.

Ambas consomem a mesma **API REST do backend** (Gateway + Lambda), mas com **papéis e permissões distintos**. A separação física em aplicações permite evolução e deploy independentes — stack, roteamento, autenticação e UI podem divergir sem acoplamento.

---

## 2. Componentes / Módulos Principais

### Portal de Upload (Fornecedor)

| Componente | Responsabilidade |
|---|---|
| **Upload Form** | Captura de arquivo e dados do fornecedor (CNPJ/CPF, contato), validação client-side, envio para backend |
| **Confirmation Page** | Exibição do status após upload — sucesso, erro ou pendência |
| **Error Handler** | Apresentação amigável de erros de validação ou servidor |

### Painel do Gestor (Interno)

| Componente | Responsabilidade |
|---|---|
| **Auth Guard** | Integração NextAuth + Cognito, proteção de rotas, refresh de token |
| **Sidebar / Nav** | Navegação entre lista de orçamentos, busca, relatórios, configurações |
| **Orçamento List** | Tabela de orçamentos com filtros (período, fornecedor, status, faixa de preço), paginação, busca semântica |
| **Orçamento Detail** | Exibição completa de um orçamento — metadados, itens extraídos, histórico de processamento, status consolidado |
| **Real-time Status** | Sincronização de status via polling (REST com intervalos) — mostra etapa atual do pipeline |
| **Search / Filters** | Interface para busca semântica e filtros de negócio |
| **Export / Reports** | Geração e download de CSV/JSON de auditoria |

---

## 3. Fluxo de Dados

### Portal de Upload

```
Fornecedor (Browser)
    ↓
[Upload Form Component]
    ↓ (validação local)
[File + Metadata]
    ↓ (POST /upload via API Gateway)
Backend (Lambda: recebe, valida, dispara pipeline)
    ↓
[Sucesso / Erro / Pendência]
    ↓
[Confirmation Page]
```

### Painel do Gestor

```
Gestor (Browser)
    ↓ (NextAuth login → Cognito)
[Auth Guard] → Token JWT
    ↓
[Painel: lista de orçamentos]
    ↓ (GET /budgets?limit=50&offset=0 via React Query)
Backend (API Gateway + Lambda)
    ↓
[JSON paginado]
    ↓
[React Query cache + render]
    ↓
[Polling a cada 30s: GET /budgets/{id}/status]
    ↓
[Status atualizado em tempo real na tabela]
    ↓
[Detalhe de orçamento: click → GET /budgets/{id}]
    ↓
[Histórico, itens extraídos, decisões humanas]
```

**Cache e refetch:** React Query gerencia cache de `budgets` e `budgets/{id}` — refetch manual em click, automático via polling em intervalo.

---

## 4. Fronteiras com Backend e Mobile

O que **não** é decisão do frontend — cada linha nomeia responsável e premissa enquanto não está acordado.

| Assunto | Equipe responsável | Premissa adotada pelo frontend | Status |
|---|---|---|---|
| **Autenticação do Portal de Upload** | Backend | Fornecedor identificado via campo no formulário (sem autenticação). Backend extrai identidade do JWT ou do contexto da requisição. | Premissa (aguardando confirma em #1) |
| **Autenticação do Painel** | Backend | Cognito + NextAuth.js (OAuth2 / OIDC). Gestor faz login, recebe JWT, inclui em Authorization header | Acordado (ADR-0004) |
| **Status em tempo real** | Backend | REST com polling cliente-side a cada 30s (não há WebSocket ou SSE especificado). Frontend compara timestamp e atualiza UI. | Premissa (REST+polling registrado) |
| **Busca semântica** | Backend | Backend expõe endpoint `GET /budgets/search?q=termo` que retorna IDs + score de relevância. Frontend chama ao digitar (debounce 300ms). | Premissa (aguardando spec) |
| **Listagem de orçamentos** | Backend | REST com paginação cursor ou offset. Padrão: `GET /budgets?limit=50&offset=0` retorna `{ total, offset, budgets[] }`. | Premissa (spec provisória no [contrato deles](https://github.com/labsitio/nexus-orc-back/docs/openapi.yaml)) |
| **Notificações push** | Mobile + Backend | Fora do escopo do frontend web. Mobile envia push; web pode atualizar via polling. | N/A (mobile) |
| **Exportação de relatórios** | Frontend | Backend entrega JSON paginado (decisão ADR-006 deles). CSV/PDF são gerados no frontend (ex: biblioteca PapaParse para CSV, html2pdf para PDF). | Acordado (frontend gera arquivo) |

---

## 5. Contrato de Integração e Estratégia de Mock

### 5.1 Proposta de Contrato (Pauta para #1)

| Item | Definição Proposta | Status |
|---|---|---|
| **Nomes e casing dos campos** | camelCase (ex: `orçamentoId`, `fornecedorCnpj`, `statusAtual`). Consistente com JavaScript conventions. | Premissa (backend usa snake_case; conversor na camada API) |
| **Formato de data e timezone** | ISO 8601 com timezone (`2026-07-31T14:30:00Z`). Sempre UTC. JavaScript Date desserializa nativamente. | Premissa (servidor em UTC) |
| **Enums (tipo e valores)** | Status: `RECEBIDO`, `FORNECEDOR_IDENTIFICADO`, `EXTRAIDO`, `VALIDADO_COM_RESSALVA`, `FALHA_VALIDACAO`, `INDEXADO`, `DISPONIVEL`, `ARQUIVADO`, `FALHA_INDEXACAO`. Maiúsculas, snake_case, sem "status" no nome. | Premissa (lido do spec provisória do backend) |
| **Paginação** | Offset-based: `?limit=50&offset=0`. Resposta: `{ total: 1234, offset: 0, limit: 50, items: [] }`. | Premissa (padrão REST) |
| **Envelope da resposta** | Sucesso: `{ data: {...} }` ou `{ data: [...] }`. Erro: `{ error: { code: "...", message: "..." } }`. Sem aninhamento extra. | Premissa (simples, sem wrapper genérico) |
| **Formato de erro** | HTTP status + JSON: `{ error: { code: "INVALID_FILE", message: "Arquivo inválido" } }`. Códigos em UPPER_SNAKE_CASE. | Premissa (RFC 7807 simplificado) |
| **Autenticação** | `Authorization: Bearer <JWT>`. Header em requisições autenticadas. Refresh via POST `/auth/refresh` com refresh token em cookie HttpOnly. | Acordado (NextAuth + Cognito) |
| **Nulabilidade** | Campos opcionais explícitos no schema (JSON Schema / OpenAPI). Nunca null se não declarado. Ausência = null. | Premissa (precisão em OpenAPI) |
| **Tipo de ID** | UUID v4 (ex: `550e8400-e29b-41d4-a716-446655440000`). Ou string numérica de banco de dados? Será confirmado em #1. | Premissa (UUID, mais seguro) |

### 5.2 Estratégia de Mock

**Decisão:** Mock é **derivado do contrato OpenAPI do backend**, não suposição privada. Enquanto o backend não tiver implementação, o frontend:

1. Lê o [openapi.yaml](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml) do backend (spec 0.1.0-provisional)
2. Gera dados fake a partir dos schemas definidos lá (ex: gerador de UUIDs, datas ISO, arrays com N itens)
3. Usa **Mock Service Worker (MSW)** para interceptar requisições HTTP em desenvolvimento e testes
4. Handlers MSW vivem em `src/test/mocks.ts`, organizados por endpoint
5. Dados fake são gerados com bibliotecas como `faker.js` ou `@faker-js/faker` — consistentes, reproduzíveis
6. O mock **muda quando o backend muda o OpenAPI** — backend não implementa, frontend atualiza o mock

**ADR-0005** registra essa decisão como estrutural.

---

## 6. Decisões de Arquitetura Relevantes

- [ADR-0004](adr/0004-stack-frontend.md) — Stack: Next.js 14, React 18, TypeScript, Vitest, React Query, Cognito, REST + polling
- [ADR-0005](adr/0005-estrategia-mock.md) — Estratégia de Mock: derivado do OpenAPI do backend, MSW para interceptação

---

## 7. Restrições e Premissas

- **Fase 01 (Portal Upload) entrega até 02/08** — escopo reduzido, sem Painel. Permite paralelização com arquitetura do Painel.
- **Backend sem implementação** — frontend depende integralmente de mock até ~15/08 (estimativa do backend). Isolamento de dados fake em `src/test/mocks.ts` facilita troca posterior.
- **Autenticação do Portal Upload indefinida** — premissa de "acesso público, fornecedor identificado via campo" pode mudar se Cognito pool separado for decisão de segurança.
- **Realtime = polling** — não há WebSocket, e backend declara "p95 ≤ 5min por etapa" — polling a cada 30s satisfaz o requisito de "tempo real" pragmático.
- **Busca semântica do backend provisória** — endpoint ainda não existe. Frontend assume que existirá e deixa a chamada isolada (hook `useSemanticSearch`) para fácil integração.
- **Multi-tenant (Fase 03) não vai existir no MVP** — arquitetura assume tenant único (gestor de uma rede); isolamento por token de Cognito.

---

## 8. Riscos Arquiteturais Conhecidos

1. **Autenticação do fornecedor ambígua** — "acesso público" pode não passar em auditoria de compliance. Mitigação: registrar como premissa e confirmar em #1 com backend/legal.
2. **Listagem de orçamentos sem limite de escala** — backend não especificou se há limite de paginação ou filtering. Risco: 50 mil orçamentos em uma página mata o frontend. Mitigação: documentar limite cliente-side (ex: max 100 orçamentos por requisição), e avisar backend se a lista ficar grande.
3. **Polling 30s pode gerar ruído de rede** — Fase 01 não tem painel, então o risco é Fase 02+. Mitigação: usar polling adaptativo (aumentar intervalo se nada mudar por 5 min) e avocar do usuário antes de implementar.
4. **Exportação de relatórios (CSV/PDF) não especificada no backend** — podem querer um formato específico. Mitigação: deixar função de formatação isolada em `src/lib/export.ts` para fácil customização.
5. **Autenticação com Cognito depende de pool existente** — se o AWS account do projeto não tiver pool configurado, o login falha no dev. Mitigação: documentar setup em README; mock de auth para testes locais sem Cognito.
6. **Estado crescente sem Redux** — React + React Query suficiente para MVP, mas se estado local crescer exponencialmente (muitos orçamentos abertos simultaneamente com estado local), considerar Redux depois (não agora).
