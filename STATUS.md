# STATUS.md — Projeto Nexo

> Este arquivo reflete o **estado atual** do projeto. Não é um histórico — histórico detalhado vive no GitHub (issues, PRs, commits). Deve ser atualizado ao final de qualquer sessão de trabalho relevante, conforme regras definidas em [CLAUDE.md](CLAUDE.md#8-atualização-de-status).

---

## Última atualização

- **Data:** 2026-07-31
- **Atualizado por:** agente `tech-lead` (primeira execução), conduzido por Bruno Martins — escritor único do STATUS.md, [ADR-0002](docs/adr/0002-execucao-centralizada-e-escritor-unico.md)

---

## Feature atual

Nenhuma feature de produto em desenvolvimento. A **stack está decidida** ([ADR-0004](docs/adr/0004-stack-frontend.md)) e a governança está em vigor, mas **ainda não existe código de aplicação** — nem `package.json`, nem projeto Next.js, nem suíte de testes da aplicação.

- **Backlog:** [13 issues abertas](https://github.com/labsitio/nexus-orc-web/issues) (#1, #3, #4, #6, #9, #11, #12, #13, #14, #15, #19, #21, #22)
- **Escopo do produto:** em [`escopo/`](escopo/) (5 arquivos HTML). Resumo e delimitação da fatia de frontend no [CLAUDE.md](CLAUDE.md), seções 1, 1.1 e 1.2.
- **Portão para a fase de código:** [#12](https://github.com/labsitio/nexus-orc-web/issues/12) — o backlog de implementação, que passa a ser produzido pelo agente Product Planner (#4).

---

## Task atual

**Sexta 31/07, tarde.** A stack saiu e o primeiro PR de conteúdo foi mergeado. As três frentes estão com trabalho aberto em paralelo.

### Bruno — PR #20 mergeado, contrato parcialmente confirmado

[PR #20](https://github.com/labsitio/nexus-orc-web/pull/20) ([#19](https://github.com/labsitio/nexus-orc-web/issues/19) — travas mecânicas antes do PR) foi **reprovado, corrigido e mergeado** (`e1e739c`), sem nova rodada de `qa-reviewer` — decisão assumida por limite de sessão, com a verificação (17 testes, `check-docs` verde) declarada no PR. #19 fechada.

[PR #24](https://github.com/labsitio/nexus-orc-web/pull/24) confirmou o **Bloco 1** do contrato de integração ([#1](https://github.com/labsitio/nexus-orc-web/issues/1)) por leitura direta do repositório do backend, sem reunião — é definição pública, não pendia de negociação. Blocos 2, 3 e 4 seguem sem mudança, verificados na mesma leitura; continuam exigindo reunião real, sem data marcada.

### André — segunda exceção à concentração de execução, ressalvas do #18 e arquitetura

- **[ADR-0003](docs/adr/0003-execucao-distribuida-na-janela-de-entrega.md) emendado de novo:** André passa a executar também o `frontend-architect` na própria máquina, além do `frontend-developer` — segunda exceção à concentração em Bruno, para não fazer a #3 esperar na fila do mesmo limite de sessão que já travou hoje.
- [#3](https://github.com/labsitio/nexus-orc-web/issues/3) — **prioridade agora.** Criar o agente `frontend-architect`, preencher `architecture.md` (14 campos) e a estratégia de mock. Não precisa de issue nova — já está coberta. Destrava o restante do #1 e o contexto que o `frontend-developer` vai ler no fim de semana.
- [#21](https://github.com/labsitio/nexus-orc-web/issues/21) — `tools` do `frontend-developer` sem `Glob` e `Grep`. **O agente ainda não foi executado nenhuma vez**, e a execução pelo autor é critério de aceite da issue e exigência de `docs/quality.md`, seção 2. É o último item da Definition of Done do #18 em aberto.
- [#22](https://github.com/labsitio/nexus-orc-web/issues/22) — imprecisões factuais no ADR-0004 já aceito. **Despriorizada:** corrige precisão, não decisão, e não deve disputar tempo com o caminho crítico do código.

### Kássio — vai tentar produzir hoje

[#4](https://github.com/labsitio/nexus-orc-web/issues/4) — agente Product Planner e `planning.md`. As issues de desenvolvimento passam a ser **saída do agente Product Planner**, que quebra o trabalho em épicos e tasks com critérios de aceite, e daí direciona ao agente dev. Ou seja: [#12](https://github.com/labsitio/nexus-orc-web/issues/12) deixa de ser trabalho manual.

### Agentes: 3 publicados, 2 executados

A equipe produz **cinco agentes próprios**, mais o de **Integração**, que vem do time de backend e pode não existir na entrega.

| Agente | Estado |
|---|---|
| `qa-reviewer` | Publicado. **Executado 3 vezes** em 31/07 (2 rodadas no #18, 1 no #20) |
| `tech-lead` | Publicado. **Executado pela primeira vez** em 31/07 |
| `frontend-developer` | Publicado no #18. **Nunca executado** — [#21](https://github.com/labsitio/nexus-orc-web/issues/21) |
| `frontend-architect` | Não existe — [#3](https://github.com/labsitio/nexus-orc-web/issues/3) |
| `product-planner` | Não existe — [#4](https://github.com/labsitio/nexus-orc-web/issues/4) |
| `integracao` | Não existe. Vem do time de backend |

**Nenhuma linha de código de aplicação ainda.**

---

## Prazo e plano até a entrega

**Entrega: segunda-feira, 03/08/2026, 17:30 (Brasília).** Restam a tarde de sexta 31/07, o fim de semana de disponibilidade incerta, e a manhã de segunda. A prorrogação foi pedida em 30/07 e **não houve resposta** — o prazo segue valendo como está.

### Escopo: implementar o máximo possível, em ordem de entregabilidade

**Decisão da equipe (30/07): tentar as três fases, acompanhando o avanço.** A recomendação anterior de cortar para a Fase 01 foi substituída — a aposta é que a assistência de agentes muda a produtividade o suficiente.

Para que "o máximo possível" não vire "nada terminado", vale uma regra de sequenciamento: **cada fase precisa ser demonstrável por si.** O prazo pode cortar em qualquer ponto, e o que estiver pronto tem de funcionar sozinho.

Ordem, por dependência real e não por preferência:

| Ordem | O quê | Viabilidade |
|---|---|---|
| 1º | **Portal de upload (Fase 01)** | Alta. Depende de 2 endpoints **firmes** no contrato do backend |
| 2º | **Painel do gestor — detalhe de um orçamento** | Média. Os 5 endpoints de status por BC são firmes; dá para montar a tela de um orçamento por id |
| 3º | **Painel do gestor — lista** | **Bloqueada por fora.** Não existe endpoint de listagem no contrato do backend, e eles declaram não ter BC de Acompanhamento especificado |
| 4º | **Multi-tenant (Fase 03)** | Improvável no prazo, e depende do isolamento do lado deles |

**O gargalo do item 3 não é nosso e não é de prazo:** é ausência de endpoint. Nenhuma quantidade de agentes constrói uma lista sem fonte de dados. Ou o backend especifica e implementa a listagem, ou essa tela sai da entrega — decisão a acompanhar, não a assumir.

### Governança aplicada com proporção

A estrutura documental deste repositório foi desenhada para um projeto de semanas. Com menos de três dias úteis restantes, parte dela é custo sem retorno. Para este prazo:

- **Mantém:** os agentes (é o objetivo do treinamento), testes automatizados (critério de avaliação), PR com revisão, STATUS atualizado.
- **Reduz:** ADR apenas para stack (feito) e estratégia de mock. Os demais documentos preenchidos no mínimo necessário para orientar os agentes — não em versão final.
- **Adia:** #6 (metas numéricas), #11 (datas intermediárias — o prazo é único) e #9 (MCP nas demais máquinas, se a execução concentrada em Bruno cobrir o uso).
- **A partir de agora, correção de precisão em documento aceito só entra se orientar código.** As issues #19 e #22 são as últimas dessa natureza que valem o custo; o que aparecer depois fica registrado como issue e não disputa tempo com implementação.

### Plano por dia

| Quando | Quem | O quê |
|---|---|---|
| **Sex 31, tarde** | Bruno | ~~Nova validação do PR #20~~ — feito, mergeado sem 3ª rodada de agente (limite de sessão) |
| **Sex 31, tarde** | Bruno | ~~Consolidar o STATUS~~ — feito, e reconsolidado de novo agora (esta atualização) |
| **Sex 31, tarde** | Bruno | ~~Bloco 1 do contrato (#1)~~ — confirmado no PR #24 |
| **Sex 31, tarde** | André | **#3 — prioridade.** Criar `frontend-architect`, preencher `architecture.md` mínimo do portal de upload + estratégia de mock (#15), com a decisão REST + polling registrada. Executado na própria máquina — segunda exceção da concentração |
| **Sex 31, tarde** | André | #21 — corrigir `tools` e **executar o `frontend-developer` uma vez**, fechando o último item da DoD do #18 |
| **Sex 31, tarde** | André | **Liberar as respostas às dúvidas do backend** — os agentes de integração deles seguem parados |
| **Sex 31, tarde** | Kássio | #4 — agente Product Planner e `planning.md`; em seguida, gerar as issues de implementação (#12) pelo agente |
| **Sáb 01 – Dom 02** | Bruno (execução) + André (`frontend-developer`) | **Implementação do portal de upload, com testes.** Andaime do projeto Next.js, `package.json`, suíte rodando, e o formulário de upload contra mock |
| **Sáb 01 – Dom 02** | André | #14 — build e deploy em CloudFront + S3, com URL no README. Não deixar para segunda |
| **Seg 03, manhã** | Bruno + André | Dado de demonstração, README que funciona em máquina limpa, fechamento do que estiver pela metade |
| **Seg 03, até 17:30** | Bruno | Verificar a Definition of Done de projeto (CLAUDE.md, 1.2.1) e entregar |

**Ponto de corte a respeitar:** se no domingo à noite não houver build passando e aplicação publicada, o que falta vira limitação declarada no README, não trabalho de segunda-feira. A DoD de projeto aceita limitação declarada; não aceita software que não roda.

### O que está travado e por quem

| O quê | Depende de |
|---|---|
| Mock ou integração real | resposta do backend sobre quando existe API |
| Painel do gestor — lista | backend especificar e implementar endpoint de listagem |
| Escopo entregável e prorrogação | organizadores ([#13](https://github.com/labsitio/nexus-orc-web/issues/13)) |
| Metas numéricas de qualidade | organizadores ([#6](https://github.com/labsitio/nexus-orc-web/issues/6)) |
| Project da organização | um owner da `labsitio` — pós-entrega |

---

## Próximas tasks

Todas as tasks existem como issue no [backlog do GitHub](https://github.com/labsitio/nexus-orc-web/issues), conforme a seção 9 do CLAUDE.md. A ordem abaixo é por dependência, não por importância.

| Issue | Task | Responsável |
|---|---|---|
| [#3](https://github.com/labsitio/nexus-orc-web/issues/3) | **Criar `frontend-architect`, preencher `architecture.md` e estratégia de mock — prioridade máxima agora.** Destrava #1 e o contexto do `frontend-developer` | André |
| [#21](https://github.com/labsitio/nexus-orc-web/issues/21) | `frontend-developer` sem `Glob` e `Grep`, e **executar o agente uma vez** | André |
| [#4](https://github.com/labsitio/nexus-orc-web/issues/4) | Criar o agente Product Planner e preencher `planning.md` — sem dependência | Kássio |
| [#12](https://github.com/labsitio/nexus-orc-web/issues/12) | Estruturar o backlog de implementação — **portão da fase de código**; passa a ser saída do agente Product Planner, com milestones por fase | Kássio |
| [#15](https://github.com/labsitio/nexus-orc-web/issues/15) | Plano de troca do mock pela API real, com data | André |
| [#14](https://github.com/labsitio/nexus-orc-web/issues/14) | Build, deploy e hospedagem das interfaces web — parte da definição de pronto | André |
| [#1](https://github.com/labsitio/nexus-orc-web/issues/1) | Contrato com o backend — **Bloco 1 confirmado (#24)**; Blocos 2/3/4 seguem pendentes de reunião real | Bruno |
| [#13](https://github.com/labsitio/nexus-orc-web/issues/13) | **Confirmar com os organizadores o escopo entregável até 03/08 17:30** | Bruno |
| [#22](https://github.com/labsitio/nexus-orc-web/issues/22) | Correções de precisão no ADR-0004 — despriorizada | André |
| [#6](https://github.com/labsitio/nexus-orc-web/issues/6) | Obter dos organizadores as metas numéricas dos critérios de sucesso — adiada | Bruno |
| [#9](https://github.com/labsitio/nexus-orc-web/issues/9) | Configurar o GitHub MCP nas máquinas de André e Kássio | André, Kássio |
| [#11](https://github.com/labsitio/nexus-orc-web/issues/11) | Alinhar as datas de referência de cada entrega — adiada, o prazo é único | Bruno |

---

## Bloqueios

1. **Nenhum projeto de aplicação existe ainda.** A stack está decidida, mas não há `package.json`, andaime Next.js nem suíte de testes de aplicação no repositório. **É o bloqueio de maior impacto para a entrega**, porque tudo que é avaliável como código depende dele.
2. **Critérios de sucesso sem números** ([#6](https://github.com/labsitio/nexus-orc-web/issues/6)). O escopo define os objetivos qualitativamente ("de horas para minutos", "rastreabilidade completa") mas não traz metas verificáveis. Contornado por ora: `docs/quality.md` adotou um critério objetivo que não depende de número — o teste deve falhar se a mudança for revertida.
3. **Três dos agentes ainda não existem:** Frontend Architect (#3, prioridade agora), Product Planner (#4) e Integração — este último vem do time de backend, com padrões de label acordados entre as três frentes. E o `frontend-developer`, embora publicado, **nunca foi executado** (#21). (Não confundir com os 5 agentes de IA do produto, que são do backend — ver CLAUDE.md, seção 1.3.)
4. **Contrato com o backend em aberto, mas já publicado por eles.** O backend entregou [openapi.yaml](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml) (OpenAPI 3.1, `0.1.0-provisional`) e um [guia de leitura para o frontend](https://github.com/labsitio/nexus-orc-back/blob/main/docs/api-contrato-frontend.md), com suposições e lacunas marcadas. Casing, datas, enums, erro (RFC 7807), tipo de ID, autenticação e nulabilidade estão **definidos** — falta confirmar em reunião e transcrever. O que segue aberto são as lacunas estruturais e o mecanismo de status, tratados em `docs/contrato-integracao-pauta.md`. O repositório deles está em fase de especificação: **não há implementação ainda**, então o frontend depende integralmente de mock por enquanto.
5. **GitHub MCP pendente para André e Kássio** ([#9](https://github.com/labsitio/nexus-orc-web/issues/9)). Funcionando na máquina de Bruno. Cada integrante precisa repetir o procedimento do README ("Integração com o GitHub via MCP"): token clássico próprio e `GITHUB_MCP_PAT`. Impacto reduzido pela concentração da execução em Bruno — mas ainda impede que os agentes daquela pessoa operem issues e PRs na máquina dela.

---

## Riscos

- **O entregável final é software rodando, e o backend não tem implementação.** Os organizadores têm utilização prevista para o Nexo — é projeto real, e ao final esperam o projeto funcionando, não só documentação e agentes. Mas o repositório do backend está em **fase de especificação**: contrato publicado, zero código. Se a nossa entrega precisa funcionar integrada, dependemos de algo que ainda não existe do outro lado. **É o risco de maior impacto do projeto.** Mitigações: mock como ponte com data de troca (#15), e a pergunta sobre o que "rodando" significa levada aos organizadores (#13). Definition of Done de projeto em CLAUDE.md, seção 1.2.1.
- **Metade da janela consumida sem uma linha de código.** Passaram-se 30/07 e a sexta 31/07 em governança, stack e travas de processo. Restam o fim de semana e a manhã de segunda para andaime, feature, teste e deploy. **Sem prorrogação — pedida em 30/07 e sem resposta — este é o risco que mais provavelmente se materializa.** Mitigação: o ponto de corte de domingo à noite registrado no plano por dia.
- **Disponibilidade no fim de semana é incerta**, e o fim de semana é a maior janela contínua de implementação. Com a execução dos agentes concentrada em Bruno, a mitigação do [ADR-0003](docs/adr/0003-execucao-distribuida-na-janela-de-entrega.md) — cada um executa a própria frente — deixa de operar por padrão. **Risco residual:** se Bruno não estiver disponível sábado e domingo, resta apenas a manhã de segunda. André segue habilitado a executar `frontend-architect` e `frontend-developer` por conta própria (duas exceções acordadas, a segunda registrada em 31/07).
- **Limite de sessão da ferramenta é um risco operacional real, e já mudou uma decisão de execução.** A reavaliação do PR #20 foi interrompida por limite de sessão em 31/07. Em resposta, o `frontend-architect` também passou a ser exceção à concentração em Bruno — para não empilhar a #3, que é caminho crítico duplo, na mesma fila que já travou. Com a execução ainda concentrada para as demais frentes, o teto de uso segue sendo recurso compartilhado, e o fim de semana é justamente quando o volume de execução aumenta.
- **As travas mecânicas só valem para quem as ativou.** O hook `pre-push` foi ativado na máquina de Bruno (`git config core.hooksPath .githooks`); **André e Kássio ainda não rodaram o comando**. É configuração por máquina e não é versionável — quem não ativou continua sem trava local nenhuma, e a única trava que ninguém contorna sem querer é o `check-docs` no CI.
- **`architecture.md` e `planning.md` ainda vazios** — 14 e 3 campos a preencher, respectivamente. São exatamente os dois documentos que o agente dev precisa ler para escrever o portal de upload: sem arquitetura e sem tasks com critério de aceite, o agente inventa o que falta. #3 e #4 são, por isso, caminho crítico do código, não trabalho de documentação.
- **O painel do gestor não tem backend especificado.** O contrato publicado pelo backend declara que **não existe spec de um Bounded Context "Acompanhamento"** — a spec 006 (Portal do Gestor) foi removida do repositório deles. Não há endpoint para **listar orçamentos**, nem para listar **pendências de revisão humana**; a busca semântica só retorna o que já foi validado, e o endpoint de status consolidado é PROVISÓRIO e sem dono. Como o painel é a nossa entrega das Fases 02 e 03, isto é risco de **escopo**, não de integração. Tratado no bloco 2 de `docs/contrato-integracao-pauta.md`; se a reunião não resolver, escalar aos organizadores.
- **Status em tempo real vs. polling.** O escopo exige status em tempo real; o backend não especificou WebSocket nem SSE, e nenhuma spec define intervalo de polling. Única referência temporal: p95 ≤ 5 min por etapa. O ADR-0004 decidiu REST com polling e declarou o caminho de volta como trade-off — o risco que resta é de **expectativa**: se "tempo real" for avaliado ao pé da letra, polling pode não satisfazer.
- **Autenticação do portal do fornecedor em aberto.** Todo endpoint exige JWT do Cognito, e o contrato do backend trata apenas de papéis internos. Não está definido se o fornecedor externo tem conta no Cognito, se é pool separado, nem quem implementaria o cadastro/convite. Define se entregamos duas aplicações ou uma com autorização por papel — e é decisão que o #3 precisa endereçar antes de o agente dev escrever a tela de upload.
- **Exportação de auditoria em JSON.** O backend entrega JSON paginado por decisão registrada (ADR-006 deles); CSV e PDF são responsabilidade do frontend. Nosso escopo pede relatórios exportáveis, então a geração do arquivo é trabalho nosso e precisa entrar no backlog (#12).
- **Integração tardia entre as 3 equipes.** Backend, frontend e mobile trabalham em paralelo e integram só no final. Mitigação: contrato base acordado no início (#1) e mock derivado dele.
- **Divergência entre frentes.** Três pessoas preenchendo documentos em paralelo podem produzir decisões incompatíveis. Já ocorreu duas vezes: colisão de numeração de ADR em 0003, e um ADR aceito (0004) afirmando impacto em `docs/quality.md` que não existe. Mitigação: coordenação do Tech Lead, CODEOWNERS por documento, e auditoria de contradição a cada consolidação do STATUS.
- **Concentração de entregas em André.** `architecture.md` (#3), estratégia de mock (#15), deploy (#14) e as duas ressalvas do #18 (#21, #22) estão todas com ele, e #3 e #15 são pré-requisito do código. A dependência da stack caiu com o ADR-0004, mas a concentração não.
- **Disponibilidade desigual entre as frentes.** A de Kássio é reduzida. O desenho absorve isso: a frente de planejamento é autocontida e o backlog é operado por Bruno desde o início. Suplência registrada em `docs/team-responsibilities.md` ("Suplência e Continuidade").
- **Colisão de vocabulário em "agente".** O produto tem 5 agentes de IA (Bedrock, do backend) e esta equipe tem agentes de desenvolvimento (Claude Code). Confundi-los gera erro de escopo. Mitigação: tabela de desambiguação no CLAUDE.md, seção 1.3, e qualificação obrigatória do termo.

---

## ADRs recentes

- [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md) — Modelo de governança documental com ADRs, STATUS e backlog no GitHub — **Aceito** (30/07).
- [ADR-0002](docs/adr/0002-execucao-centralizada-e-escritor-unico.md) — Execução centralizada dos agentes e escritor único do STATUS.md — **Aceito** (30/07), com a execução centralizada **emendada pelo ADR-0003**.
- [ADR-0003](docs/adr/0003-execucao-distribuida-na-janela-de-entrega.md) — Execução distribuída na janela até a entrega — **Aceito** (30/07), **emendado em 31/07**: a execução volta a ser concentrada em Bruno, com exceção do `frontend-developer`, que segue com André. Expira em 03/08.
- [ADR-0004](docs/adr/0004-stack-frontend.md) — Stack frontend: TypeScript, Next.js 14 + React 18, **Vitest + React Testing Library**, API Gateway REST com polling em vez de AppSync, Tailwind, Cognito + NextAuth, CloudFront + S3 — **Aceito**, ratificado na revisão do `qa-reviewer` em 31/07 e mergeado em `a7772e0`. Correções de precisão pendentes em [#22](https://github.com/labsitio/nexus-orc-web/issues/22).

**Próximo número livre: 0005.** Não há ADR em aberto em branch ou PR não mergeado. Quem for abrir um ADR reserva o número em voz alta antes de começar — a colisão em 0003 já aconteceu neste projeto.

Template para novos ADRs: [docs/adr/TEMPLATE.md](docs/adr/TEMPLATE.md).

---

## Infraestrutura de trabalho em vigor

- **Proteção da branch `main` ativa** ([#10](https://github.com/labsitio/nexus-orc-web/issues/10)): exige Pull Request com **0 aprovações** (para ninguém depender de disponibilidade de terceiros na janela de entrega), `check-docs` como **status check obrigatório**, bloqueio de force push, restrição de deleção, **bypass list vazia** — a regra vale para os três, inclusive para o Tech Lead. "Require review from Code Owners" está deliberadamente **desabilitado**: com o curinga `* @brunomartins-labsit` no CODEOWNERS e o GitHub não permitindo autoaprovação, nenhum PR de Bruno poderia ser mergeado.
- **`check-docs` é a única trava que ninguém contorna sem querer.** Ele impede o merge quando a documentação está inconsistente. O veredito do `qa-reviewer`, por outro lado, **não** é trava técnica: é acordo da equipe (`docs/quality.md`, seção 5).
- **Hook `pre-push`** versionado em `.githooks/`, ativado com `git config core.hooksPath .githooks`. Ativo na máquina de Bruno; pendente nas de André e Kássio.
- **Os três integrantes são collaborators com papel `admin`**, e o `.github/CODEOWNERS` está com os handles reais — as regras de dono valem de fato no Pull Request.
- **`gh` CLI** instalado e autenticado como `brunomartins-labsit`, com token próprio no keyring — separado do `GITHUB_MCP_PAT` usado pelo MCP.
- **"Automatically delete head branches"** habilitado.

---

## Observações

- **Criação de Project da organização está bloqueada**, e não por permissão de repositório: o botão "New project" não aparece, o que indica restrição na configuração da organização ("Allow members to create projects"). Depende de um owner da `labsitio`. **Pós-entrega** — o problema prático que o board resolveria já está coberto por labels `para:*` e assignees.
- **Filtros e views do protocolo de integração ficam para depois.** As labels `integracao:*` não existem em nenhum dos três repositórios, e o agente de Integração — com o padrão de labels acordado entre as três frentes — vem do time de backend. Montar filtro agora retornaria vazio e daria a falsa impressão de que não há pendência.
- **`docs/quality.md` não fixa a ferramenta de teste da aplicação**, por decisão própria: aponta para `docs/engineering-principles.md`, onde Vitest está registrado. Exceção deliberada: os scripts de governança em `scripts/` usam `node:test`, que não depende de `package.json`. O ADR-0004 afirma o contrário na seção "Impacto em Outros Documentos" — ver [#22](https://github.com/labsitio/nexus-orc-web/issues/22).
- A sequência recomendada de trabalho entre as frentes está no final de [docs/team-responsibilities.md](docs/team-responsibilities.md).
