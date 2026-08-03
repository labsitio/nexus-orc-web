# STATUS.md — Projeto Nexo

> Este arquivo reflete o **estado atual** do projeto. Não é um histórico — histórico detalhado vive no GitHub (issues, PRs, commits). Deve ser atualizado ao final de qualquer sessão de trabalho relevante, conforme regras definidas em [CLAUDE.md](CLAUDE.md#8-atualização-de-status).

---

## Última atualização

- **Data:** 2026-08-03, 17:45 — dia da entrega, após a hora da apresentação
- **Atualizado por:** Bruno Martins — escritor único do STATUS.md, [ADR-0002](docs/adr/0002-execucao-centralizada-e-escritor-unico.md)

---

## Feature atual

**A aplicação roda e o fluxo principal é navegável de ponta a ponta.** Verificado ao vivo no navegador, a partir da `main` (`7791b52`), não por relato:

| App | Estado |
|---|---|
| **Portal de Upload** (`apps/upload`, porta 3000) | Formulário valida, o clique em "Enviar" executa os **três passos** do contrato (201 no `upload-url` → 200 no PUT do S3 → 200 com `RECEBIDO` na confirmação), tela de confirmação e tratamento de erro traduzido funcionando |
| **Painel de Acompanhamento** (`apps/dashboard`, porta 3001) | Detalhe do orçamento com etapas do pipeline, 3 orçamentos de demonstração em estágios diferentes, incluindo estado terminal que não é erro |

**87 testes automatizados passando** (69 em `apps/upload`, 18 em `apps/dashboard`), build gerando export estático nos dois apps, `check-docs` sem erro.

### Limitação declarada, e é uma só

**Roda contra mock, não contra API real.** O mock deriva do `openapi.yaml` do backend (ADR-0005) e agora vale **também no navegador**, não só nos testes. A troca pela API real é mudança de variável de ambiente (`NEXT_PUBLIC_USAR_MOCK=false`), não de código — issue [#15](https://github.com/labsitio/nexus-orc-web/issues/15). **Não há deploy em ambiente público:** falta conta AWS confirmada, declarado no README com o que falta e de quem depende ([#14](https://github.com/labsitio/nexus-orc-web/issues/14)).

- **Escopo do produto:** em [`escopo/`](escopo/). Resumo da fatia de frontend no [CLAUDE.md](CLAUDE.md), seções 1, 1.1 e 1.2.
- **Aprendizados do exercício:** [RETROSPECTIVA.md](RETROSPECTIVA.md) — agentes, MCP, execução distribuída e a disciplina de verificação que evitou reverter trabalho entregue.

---

## Task atual

### Entregue hoje (03/08)

| PR | O quê | Autor |
|---|---|---|
| [#57](https://github.com/labsitio/nexus-orc-web/pull/57) | #35 — andaime do monorepo, dois apps Next.js, Vitest | André |
| [#60](https://github.com/labsitio/nexus-orc-web/pull/60) | #38 — mock dos endpoints do fluxo de upload, derivado do contrato | Bruno |
| [#61](https://github.com/labsitio/nexus-orc-web/pull/61) | #39 — formulário de envio com validação | Kássio |
| [#66](https://github.com/labsitio/nexus-orc-web/pull/66) | #42 — tratamento dos erros no formato do backend | Kássio |
| [#67](https://github.com/labsitio/nexus-orc-web/pull/67) | #50 — dado de demonstração | Bruno |
| [#68](https://github.com/labsitio/nexus-orc-web/pull/68) | #65 — mock exporta fixtures, sem redeclaração espalhada | Bruno |
| [#70](https://github.com/labsitio/nexus-orc-web/pull/70) | #41 — tela de confirmação do envio | Bruno, via `frontend-developer` |
| [#62](https://github.com/labsitio/nexus-orc-web/pull/62) | #40 e #64 — envio em duas chamadas com idempotência, **mais 4 correções** (ver abaixo) | André + Bruno |
| [#71](https://github.com/labsitio/nexus-orc-web/pull/71) | #51 — README que funciona em máquina limpa, limitação declarada | Kássio |
| [#74](https://github.com/labsitio/nexus-orc-web/pull/74) | #46 — painel com detalhe do orçamento e etapas do pipeline | Bruno, via `frontend-developer` |
| [#75](https://github.com/labsitio/nexus-orc-web/pull/75) | Mock passa a valer no navegador, não só nos testes | Bruno |

### Dois defeitos que só apareceram por verificação independente

Registrado porque é o aprendizado mais caro do dia, não para atribuir culpa:

1. **#62 alegava suíte e build verdes; nenhum dos dois estava.** Rodando de verdade: 5 testes vermelhos e `next build` falhando por erro de tipo. Causa raiz encontrada lendo o código — `apiRequest` prefixava `API_BASE` em toda URL, inclusive na URL **absoluta** do S3, gerando `/v1https://...`. O fluxo abortava no 2º passo, então `onSuccess`/`data` nunca chegavam. Corrigido junto com: `idempotencyKey` lido de `ref` sem re-render após `reset()`; `UploadPage` passando props inexistentes ao `ErroUpload`; e `error.message` (o `detail` cru do backend) sendo exibido ao fornecedor, contra `docs/quality.md` seção 3 — agora traduzido pelo código estável, o que **resolveu a #64**.
2. **O mock existia só nos testes.** O fluxo passava em 69 testes e dava **404 na tela**, porque `msw/node` não intercepta nada no navegador. Corrigido no #75, reaproveitando os mesmos handlers via `msw/browser`. **Suíte verde não prova aplicação funcionando** — os testes estavam certos; faltava o mock existir onde o usuário clica.

**Três PRs chegaram com branch desatualizado** (#62, #69, #71), e `mergeable_state: clean` do GitHub **não** indica branch atualizado, só ausência de conflito textual. Mergear qualquer um deles como estava teria revertido issues já entregues.

### Agentes: 5 de 5 publicados e executados

| Agente | Estado |
|---|---|
| `qa-reviewer` | Executado em praticamente toda revisão de PR — maior retorno por token do dia |
| `frontend-developer` | Executado várias vezes, inclusive para o #41 (#70) e o #46 (#74) |
| `frontend-architect` | Executado pelo autor |
| `tech-lead` | Executado uma vez (auditoria de contradição + consolidação) |
| `product-planner` | Executado; o achado do `Agent type not found` segue sem investigação sistemática |
| `integracao` | Não existe — vinha do time de backend, não foi entregue |

---

## Prazo e plano até a entrega

**Entrega: segunda-feira, 03/08/2026, 17:30 (Brasília).** Restam o fim da tarde de hoje, o fim de semana (disponibilidade incerta) e a manhã de segunda. A prorrogação foi pedida em 30/07 e **não houve resposta** — o prazo segue valendo como está.

### Escopo: implementar o máximo possível, em ordem de entregabilidade

**Decisão da equipe (30/07): tentar as três fases, acompanhando o avanço.**

Ordem, por dependência real e não por preferência:

| Ordem | O quê | Viabilidade |
|---|---|---|
| 1º | **Portal de upload (Fase 01)** | Alta. Depende de 2 endpoints **firmes** no contrato do backend |
| 2º | **Painel do gestor — detalhe de um orçamento** | Média. Os 5 endpoints de status por BC são firmes; dá para montar a tela de um orçamento por id |
| 3º | **Painel do gestor — lista** | **Bloqueada por fora.** Não existe endpoint de listagem no contrato do backend, e eles declaram não ter BC de Acompanhamento especificado |
| 4º | **Multi-tenant (Fase 03)** | Improvável no prazo, e depende do isolamento do lado deles |

**O gargalo do item 3 não é nosso e não é de prazo:** é ausência de endpoint. Ou o backend especifica e implementa a listagem, ou essa tela sai da entrega — decisão a acompanhar, não a assumir.

### Governança aplicada com proporção

- **Mantém:** os agentes (é o objetivo do treinamento), testes automatizados (critério de avaliação), PR com revisão, STATUS atualizado.
- **Reduz:** ADR apenas para decisões estruturais de fato (stack, execução, mock). A partir de agora, correção de precisão em documento aceito só entra se orientar código — o que aparecer depois fica registrado como issue e não disputa tempo com implementação.
- **Adia:** #6 (metas numéricas), #11 (datas intermediárias — o prazo é único).

### Plano por dia — revisado à noite de 31/07

**Mudança de cenário:** a disponibilidade de sábado (01/08) está incerta — pode ser um dia sem ninguém trabalhando. Isso muda a janela real de implementação: em vez de "todo o fim de semana", pode sobrar só domingo e a manhã de segunda. Consequência direta: **a implementação começa hoje à noite**, não amanhã.

| Quando | Quem | O quê |
|---|---|---|
| **Sex 31, noite** | André | [#35](https://github.com/labsitio/nexus-orc-web/issues/35) — **antecipado.** Andaime dos dois projetos Next.js (monorepo, conforme ADR-0006), Vitest configurado e rodando. Não depende da #12 terminar |
| **Sex 31, noite** | Kássio | #12 — backlog de implementação, começando pela Fase 01 |
| **Sex 31, noite** | Bruno | Acompanhar #35/#12, revisar PRs que saírem |
| **Sáb 01 (se houver)** | André | Formulário de upload contra mock, a partir das tasks da #12. **Se o dia cair, sem problema** — o andaime já ficou pronto na sexta |
| **Dom 02** | Todos | Implementação com testes, #14 (deploy real), o que sobrar do fim de semana |
| **Seg 03, manhã** | Bruno + André | Dado de demonstração, README que funciona em máquina limpa, fechamento do que estiver pela metade |
| **Seg 03, até 17:30** | Bruno | Verificar a Definition of Done de projeto (CLAUDE.md, 1.2.1) e entregar |

**Ponto de corte a respeitar:** se no domingo à noite não houver build passando e aplicação publicada, o que falta vira limitação declarada no README, não trabalho de segunda-feira. A DoD de projeto aceita limitação declarada; não aceita software que não roda. **Com o risco de sábado sem trabalho, este ponto de corte fica mais apertado — vale reavaliar no sábado à noite, não só no domingo.**

### O que está travado e por quem

| O quê | Depende de |
|---|---|
| Mock ou integração real | resposta do backend sobre quando existe API consumível (Blocos 2/3/4 do #1) |
| Painel do gestor — lista | backend especificar e implementar endpoint de listagem |
| Escopo entregável e prorrogação | organizadores ([#13](https://github.com/labsitio/nexus-orc-web/issues/13)) |
| Metas numéricas de qualidade | organizadores ([#6](https://github.com/labsitio/nexus-orc-web/issues/6)) |
| Project da organização | um owner da `labsitio` — pós-entrega |

---

## Próximas tasks

Todas as tasks existem como issue no [backlog do GitHub](https://github.com/labsitio/nexus-orc-web/issues), conforme a seção 9 do CLAUDE.md. A ordem abaixo é por dependência, não por importância.

| Issue | Task | Responsável |
|---|---|---|
| [#14](https://github.com/labsitio/nexus-orc-web/issues/14) | **Build, deploy e hospedagem — prioridade.** Não deixar para segunda | André |
| [#12](https://github.com/labsitio/nexus-orc-web/issues/12) | Backlog de implementação — **portão da fase de código**, em andamento | Kássio |
| [#15](https://github.com/labsitio/nexus-orc-web/issues/15) | Plano de troca do mock pela API real, com data | André |
| [#31](https://github.com/labsitio/nexus-orc-web/issues/31) | Remover `NextAuth`/`React Query` de `architecture.md` | André |
| [#13](https://github.com/labsitio/nexus-orc-web/issues/13) | **Confirmar com os organizadores o escopo entregável até 03/08 17:30** | Bruno |
| [#22](https://github.com/labsitio/nexus-orc-web/issues/22) | Correções de precisão no ADR-0004 — despriorizada | André |
| [#6](https://github.com/labsitio/nexus-orc-web/issues/6) | Metas numéricas dos critérios de sucesso — adiada | Bruno |
| [#9](https://github.com/labsitio/nexus-orc-web/issues/9) | GitHub MCP nas máquinas de André e Kássio — provavelmente já resolvido, confirmar e fechar | André, Kássio |
| [#11](https://github.com/labsitio/nexus-orc-web/issues/11) | Datas de referência de cada entrega — adiada, o prazo é único | Bruno |

---

## Bloqueios

1. **Nenhum projeto de aplicação existe ainda.** A stack, arquitetura e contrato estão decididos, mas não há `package.json`, andaime Next.js nem suíte de testes de aplicação no repositório. **É o bloqueio de maior impacto para a entrega** — tudo que é avaliável como código depende dele, e é o próximo passo real.
2. **Critérios de sucesso sem números** ([#6](https://github.com/labsitio/nexus-orc-web/issues/6)). Contornado: `docs/quality.md` adotou um critério objetivo que não depende de número — o teste deve falhar se a mudança for revertida.
3. **O agente de Integração não existe.** Vem do time de backend; cobrado hoje, sem entrega ainda. Pode não existir na entrega final (não é o entregável desta equipe).
4. **Contrato com o backend — Bloco 1 confirmado, Blocos 2/3/4 em aberto.** As três lacunas estruturais (sem endpoint de listagem, sem BC de Acompanhamento, sem fila de revisão humana) seguem sem resposta do backend — verificado por leitura direta em 31/07, sem mudança desde 30/07. Exigem reunião real, sem data marcada.
5. **GitHub MCP pendente de confirmação para André e Kássio** ([#9](https://github.com/labsitio/nexus-orc-web/issues/9)). Ambos abriram PR normalmente hoje, então provavelmente já está funcionando — falta só fechar a issue.

---

## Riscos

- **O entregável final é software rodando, e o backend, apesar de ter começado a codar hoje, ainda não resolveu as lacunas que nos afetam.** Descoberta de 31/07: o backend mergeou 10 PRs de código de domínio (BCs de Validação, Indexação, Orquestração) nas últimas horas — a premissa "zero código do lado deles" caiu. Mas as três lacunas estruturais (listagem, Acompanhamento, fila de revisão) e o `openapi.yaml` **não mudaram**: `GET /orcamentos/{id}` segue PROVISÓRIO, sem endpoint de listagem. Continuamos dependendo de mock. **Ainda é o risco de maior impacto do projeto**, só que por um motivo mais restrito agora — não falta código neles, falta a spec certa. Mitigações: plano de troca do mock com data (#15), pergunta sobre o que "rodando" significa aos organizadores (#13).
- **Cerca de metade da janela consumida sem uma linha de código de aplicação**, mas com a base de especificação inteira fechada hoje (stack, arquitetura, contrato, mock, planejamento). Restam o fim de semana e a manhã de segunda para andaime, feature, teste e deploy. **Sem prorrogação — pedida em 30/07 e sem resposta.** Mitigação: o ponto de corte de domingo à noite.
- **Sábado (01/08) pode ser um dia sem ninguém trabalhando — risco novo, registrado à noite de 31/07.** Se isso se confirmar, a janela real de implementação encolhe para hoje à noite + domingo + a manhã de segunda, não o fim de semana inteiro. Mitigação: antecipar o andaime do projeto Next.js ([#35](https://github.com/labsitio/nexus-orc-web/issues/35)) para esta noite, para que o sábado — se cair — não custe trabalho que dependia dele ser o primeiro dia de código.
- **Disponibilidade no fim de semana é incerta.** Execução concentrada em Bruno, com duas exceções (André executa `frontend-architect` e `frontend-developer`). **Risco residual:** se Bruno não estiver disponível sábado e domingo, resta a manhã de segunda.
- **Limite de sessão da ferramenta é recurso compartilhado**, e já interrompeu uma revisão hoje. Motivou a segunda exceção de execução (`frontend-architect` com André). Vale monitorar no fim de semana, quando o volume de execução aumenta.
- **Um agente pode não carregar mesmo com frontmatter válido** — achado no `product-planner` (`Agent type not found`), possivelmente sistemático. Não investigado ainda; adiado por decisão explícita para depois do fim de semana, mas é risco real se se repetir com o `frontend-developer` durante a implementação.
- **As travas mecânicas só valem para quem as ativou.** Hook `pre-push` ativo só na máquina de Bruno. André e Kássio, sem o hook, dependem só do `check-docs` no CI.
- **O painel do gestor não tem backend especificado** — ver Bloqueio 4. Risco de **escopo**, não de integração.
- **Status em tempo real vs. polling.** ADR-0004 decidiu REST + polling; risco residual é de expectativa, se "tempo real" for avaliado ao pé da letra.
- **Autenticação do portal do fornecedor** — `architecture.md` precisa endereçar isso antes de o `frontend-developer` escrever a tela de upload; conferir se o #26 resolveu ou se ficou como premissa.
- **Exportação de auditoria em JSON** — CSV/PDF são responsabilidade nossa, precisa entrar no backlog da #12.
- **Integração tardia entre as 3 equipes** — mitigado por contrato base acordado (#1, Bloco 1) e mock derivado dele (ADR-0005).
- **Divergência entre frentes já ocorreu três vezes:** colisão de numeração de ADR em 0003, ADR-0004 afirmando impacto que não existia em `quality.md`, e `architecture.md` inicial com valores de contrato invertidos (corrigido no #26). Mitigação: auditoria de contradição a cada consolidação.
- **Disponibilidade desigual entre as frentes** — a de Kássio é reduzida, mas a frente de planejamento é autocontida.
- **Colisão de vocabulário em "agente"** — mitigada por tabela de desambiguação no CLAUDE.md, seção 1.3.

---

## ADRs recentes

- [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md) — Modelo de governança documental — **Aceito** (30/07).
- [ADR-0002](docs/adr/0002-execucao-centralizada-e-escritor-unico.md) — Execução centralizada e escritor único do STATUS.md — **Aceito** (30/07), emendado pelo ADR-0003.
- [ADR-0003](docs/adr/0003-execucao-distribuida-na-janela-de-entrega.md) — Execução distribuída até a entrega — **Aceito** (30/07), **emendado duas vezes em 31/07**: execução concentrada em Bruno, com exceções para `frontend-architect` e `frontend-developer` (André). Expira em 03/08.
- [ADR-0004](docs/adr/0004-stack-frontend.md) — Stack frontend: TypeScript, Next.js 14 + React 18, Vitest + RTL, API Gateway REST com polling, Tailwind, Cognito + NextAuth, CloudFront + S3 — **Aceito**. Correções de precisão pendentes em [#22](https://github.com/labsitio/nexus-orc-web/issues/22), despriorizadas.
- [ADR-0005](docs/adr/0005-estrategia-mock.md) — Estratégia de mock, derivado do `openapi.yaml` do backend — **Aceito** (31/07), aprovado com ressalva pequena no [#31](https://github.com/labsitio/nexus-orc-web/issues/31).

**Próximo número livre: 0006.** Nenhum ADR em aberto em branch ou PR não mergeado.

Template para novos ADRs: [docs/adr/TEMPLATE.md](docs/adr/TEMPLATE.md).

---

## Infraestrutura de trabalho em vigor

- **Proteção da branch `main` ativa** ([#10](https://github.com/labsitio/nexus-orc-web/issues/10), fechada): PR obrigatório, **0 aprovações**, `check-docs` como status check obrigatório, bloqueio de force push, bypass list vazia.
- **`check-docs` é a única trava que ninguém contorna sem querer.** Valida links, seções do CLAUDE.md, termos legados, segredos, e — desde o #20 — frontmatter de definição de agente. O veredito do `qa-reviewer` **não** é trava técnica: é acordo da equipe (`docs/quality.md`, seção 5).
- **17 testes automatizados** em `node:test` para o `check-docs` (primeiro teste do repositório) — rodam no mesmo job do CI.
- **Hook `pre-push`** ativo na máquina de Bruno; pendente nas de André e Kássio.
- **Os três integrantes são collaborators `admin`**, `.github/CODEOWNERS` com handles reais.
- **3 milestones criados**, mapeados às fases do roadmap (Fase 01, 02, 03).

---

## Observações

- **Criação de Project da organização segue bloqueada** por configuração da org — pós-entrega, coberto por labels e assignees.
- **Backend começou a implementar código em 31/07** — 10 PRs mergeados em poucas horas, cobrindo domínio de Validação/Indexação/Orquestração. Não afeta as três lacunas estruturais que nos bloqueiam (ver Riscos).
- **`docs/quality.md` não fixa a ferramenta de teste da aplicação** por decisão própria — aponta para `engineering-principles.md` (Vitest). Scripts de governança usam `node:test`.
- A sequência recomendada de trabalho entre as frentes está no final de [docs/team-responsibilities.md](docs/team-responsibilities.md).
