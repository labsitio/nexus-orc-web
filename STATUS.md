# STATUS.md — Projeto Nexo

> Este arquivo reflete o **estado atual** do projeto. Não é um histórico — histórico detalhado vive no GitHub (issues, PRs, commits). Deve ser atualizado ao final de qualquer sessão de trabalho relevante, conforme regras definidas em [CLAUDE.md](CLAUDE.md#8-atualização-de-status).

---

## Última atualização

- **Data:** 2026-08-03, manhã — dia da entrega
- **Atualizado por:** Bruno Martins — escritor único do STATUS.md, [ADR-0002](docs/adr/0002-execucao-centralizada-e-escritor-unico.md)

---

## Feature atual

**Hoje é o dia da entrega, 17:30.** A fase de especificação está concluída e o backlog de implementação da Fase 01 está pronto (#37-42) desde o fim de semana. **Ainda não existe código de aplicação** — nem `package.json`, nem projeto Next.js, nem suíte de testes. O andaime ([#35](https://github.com/labsitio/nexus-orc-web/issues/35)) é o próximo passo, e ainda não foi iniciado.

- **Backlog:** 22 issues abertas. Ver "André — ordem de execução de hoje" abaixo para a Fase 01.
- **Escopo do produto:** em [`escopo/`](escopo/) (5 arquivos HTML). Resumo e delimitação da fatia de frontend no [CLAUDE.md](CLAUDE.md), seções 1, 1.1 e 1.2.
- **Portão da fase de código, cumprido:** [#12](https://github.com/labsitio/nexus-orc-web/issues/12) entregou o backlog fatiado da Fase 01 no fim de semana.

---

## Task atual

**Sexta 31/07, fim de tarde.** Cinco Pull Requests de conteúdo mergeados hoje (#18, #20, #24, #26, #27, #28 — seis, na verdade). A base de especificação está pronta; a próxima fase é código.

### Fechado hoje

| PR | O quê | Autor |
|---|---|---|
| [#18](https://github.com/labsitio/nexus-orc-web/pull/18) | Stack ([ADR-0004](docs/adr/0004-stack-frontend.md)), `engineering-principles.md`, agente `frontend-developer` | André |
| [#20](https://github.com/labsitio/nexus-orc-web/pull/20) | Travas mecânicas: `check-docs` valida frontmatter de agente, `pre-push` roda `check-docs`, `/revisar`, 17 testes (primeiro do repositório) | Bruno |
| [#24](https://github.com/labsitio/nexus-orc-web/pull/24) | Bloco 1 do contrato de integração confirmado | Bruno |
| [#26](https://github.com/labsitio/nexus-orc-web/pull/26) | Agente `frontend-architect`, `architecture.md` preenchido, Bloco 1 transcrito como `Acordado`, [ADR-0005](docs/adr/0005-estrategia-mock.md) (estratégia de mock) | André |
| [#27](https://github.com/labsitio/nexus-orc-web/pull/27) | Agente `product-planner`, `planning.md` preenchido, milestones das 3 fases | Kássio |
| [#28](https://github.com/labsitio/nexus-orc-web/pull/28) | `frontend-developer` ganha `Glob`/`Grep`, executado e validado de verdade pelo revisor | André |

Issues fechadas hoje: #1, #2, #3, #4, #5, #7, #10, #19, #21, #29, #30.

### André — ordem de execução de hoje, 03/08 (dia da entrega)

O Kássio fatiou a Fase 01 no fim de semana ([#12](https://github.com/labsitio/nexus-orc-web/issues/12), comentário de 02/08) — 6 issues encadeadas, todas já com assignee `dehlferreira` e milestone. **Esta é a ordem real de execução, nesta sequência, sem pular:**

| Ordem | Issue | Depende de |
|---|---|---|
| 1º | [#35](https://github.com/labsitio/nexus-orc-web/issues/35) — Andaime dos dois projetos Next.js | nada — **ainda não iniciado**, é o bloqueio de tudo abaixo |
| 2º | [#38](https://github.com/labsitio/nexus-orc-web/issues/38) — Mock dos endpoints do fluxo de upload | #35 |
| 2º (paralelo) | [#39](https://github.com/labsitio/nexus-orc-web/issues/39) — Formulário de envio | #35 |
| 3º | [#40](https://github.com/labsitio/nexus-orc-web/issues/40) — Envio em duas chamadas, idempotência | #38, #39 |
| 4º | [#41](https://github.com/labsitio/nexus-orc-web/issues/41) — Tela de confirmação | #40 |
| 4º (paralelo) | [#42](https://github.com/labsitio/nexus-orc-web/issues/42) — Tratamento de erros do formato do backend | #40 |

**Candidatos a virar limitação declarada no README, não trabalho de hoje, se o tempo apertar:** #41 e #42 — o fluxo funciona sem eles, de forma mais crua.

Depois da cadeia acima, na fila (sem urgência de hoje): [#14](https://github.com/labsitio/nexus-orc-web/issues/14) (deploy — se Bruno não assumir), [#15](https://github.com/labsitio/nexus-orc-web/issues/15), [#31](https://github.com/labsitio/nexus-orc-web/issues/31), [#22](https://github.com/labsitio/nexus-orc-web/issues/22) (despriorizada), [#9](https://github.com/labsitio/nexus-orc-web/issues/9).

### Kássio — backlog entregue, disponibilidade de hoje incerta

[#12](https://github.com/labsitio/nexus-orc-web/issues/12) entregou 15 issues no fim de semana: épico + 5 tasks completas da Fase 01 (#37-42), 4 títulos da Fase 02 (#43-47, não iniciar sem corpo), Fase 03 registrada e não fatiada (#48 lista, #49 multi-tenant — **`bloqueio-externo`, confirmado de novo por leitura direta em 02/08**: backend ainda sem endpoint de listagem), e 2 transversais com corpo completo (#50 dado de demonstração, #51 README). Milestones das 3 fases criados. Se ele não estiver disponível hoje, Bruno assume #14/#50/#51.

### Bruno — hoje, dia da entrega (17:30)

- Se Kássio não vier: assumir [#14](https://github.com/labsitio/nexus-orc-web/issues/14) (deploy, rodando `frontend-developer` na própria máquina) e depois [#50](https://github.com/labsitio/nexus-orc-web/issues/50)/[#51](https://github.com/labsitio/nexus-orc-web/issues/51).
- Revisar os PRs do André assim que saírem — é o caminho crítico, cada rodada de revisão importa.
- Verificar a DoD de projeto (CLAUDE.md, 1.2.1) antes de 17:30.
- #6, #11, #13 seguem dependendo dos organizadores, sem resposta.

### Agentes: 5 de 5 publicados e executados

A equipe produz **cinco agentes próprios**, mais o de **Integração**, que vem do time de backend — cobrado hoje, ainda não entregue por eles, pode não existir na entrega.

| Agente | Estado |
|---|---|
| `qa-reviewer` | Publicado. Executado repetidamente ao longo do dia (todas as revisões de PR) |
| `tech-lead` | Publicado. Executado uma vez (auditoria de contradição + consolidação do STATUS) |
| `frontend-developer` | Publicado, corrigido (#28) e **executado e validado de verdade** pelo revisor |
| `frontend-architect` | Publicado (#26) e executado pelo autor |
| `product-planner` | Publicado (#27). **Achado a investigar:** não carregou na sessão do autor (`Agent type not found`) — a validação dele foi feita com prosa em agente genérico, não invocação real. Pode ser sistemático; vale checar antes do fim de semana |
| `integracao` | Não existe. Backend cobrado, sem entrega ainda |

**Nenhuma linha de código de aplicação ainda** — é o próximo item real do projeto.

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
