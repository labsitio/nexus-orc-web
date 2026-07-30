# STATUS.md — Projeto Nexo

> Este arquivo reflete o **estado atual** do projeto. Não é um histórico — histórico detalhado vive no GitHub (issues, PRs, commits). Deve ser atualizado ao final de qualquer sessão de trabalho relevante, conforme regras definidas em [CLAUDE.md](CLAUDE.md#8-atualização-de-status).

---

## Última atualização

- **Data:** 2026-07-30
- **Atualizado por:** Claude, atuando como Tech Lead (o agente Tech Lead formal ainda não foi criado — ver [docs/team-responsibilities.md](docs/team-responsibilities.md), Bruno)

---

## Feature atual

Nenhuma feature de produto em desenvolvimento. O projeto está na **fase de preparação de governança**: montagem da estrutura de documentação e definição de responsabilidades, anterior a qualquer implementação.

- **Epic/Issue:** backlog aberto em [issues #1 a #11](https://github.com/labsitio/nexus-orc-web/issues)
- **Descrição:** Estabelecer a estrutura de governança, planejamento e qualidade que orientará a equipe de agentes antes do início do desenvolvimento.
- **Escopo do produto:** recebido em 2026-07-30, em [`escopo/`](escopo/) (5 arquivos HTML). Resumo e delimitação da fatia de frontend registrados no [CLAUDE.md](CLAUDE.md), seções 1, 1.1 e 1.2.

---

## Task atual

Criação da documentação base de governança — **concluída, aguardando aprovação do responsável humano**.

- **Issue:** —  (estrutura anterior à abertura do backlog)
- **Responsável:** Tech Lead
- **Status:** em revisão
- **Entregue:** `README.md`, `CLAUDE.md`, `STATUS.md`, os quatro documentos de frente em `docs/`, `docs/team-responsibilities.md`, `docs/adr/TEMPLATE.md`, ADR-0001 e ADR-0002, `.gitignore`, `.gitattributes`, `.mcp.json`, `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md` e o comando `.claude/commands/minhas-tarefas.md`
- **Repositório:** publicado em [nexus-orc-web](https://github.com/labsitio/nexus-orc-web), branch `main`

---

## Prazo e plano até a entrega

**Entrega: segunda-feira, 03/08/2026, 17:30 (Brasília).** Hoje é quinta 30/07 — restam **4 dias, dois deles de fim de semana**.

Isso obriga corte de escopo. O que segue é a recomendação do Tech Lead, a confirmar com a equipe.

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

A estrutura documental deste repositório foi desenhada para um projeto de semanas. Em 4 dias, parte dela é custo sem retorno. Para este prazo:

- **Mantém:** os 5 agentes (é o objetivo do treinamento), testes automatizados (critério de avaliação), PR com revisão, STATUS atualizado.
- **Reduz:** ADR apenas para stack e estratégia de mock. Os demais documentos preenchidos no mínimo necessário para orientar os agentes — não em versão final.
- **Adia:** #6 (metas numéricas) e #11 (datas intermediárias — o prazo é único). O backlog (#12) acompanha a ordem de entregabilidade acima, começando pela Fase 01.

### Plano por dia

| Quando | Quem | O quê |
|---|---|---|
| **Qui 30, hoje** | Bruno | Reunião com o backend (#1). Levar também as perguntas de #13. Responder o que der na hora |
| **Qui 30, hoje** | André | **Decidir a stack** e registrar ADR curto (#2). É o que destrava todo o resto — **não pode passar de hoje** |
| **Qui 30, hoje** | André | **Liberar as respostas pré-escritas às dúvidas do backend.** Os agentes de integração deles estão **parados esperando** — resposta parcial hoje vale mais que resposta completa amanhã |
| **Qui 30, hoje** | Bruno + André | Criar os 5 agentes. Prioridade: Frontend Developer e Frontend Architect, que são os que produzem código |
| **Sex 31** | André | Arquitetura mínima do portal de upload + estratégia de mock (#3, #15) |
| **Sex 31** | Bruno | `quality.md` no mínimo viável, com teste automatizado obrigatório. Pipeline de deploy (#14) |
| **Sáb 01 – Dom 02** | agentes, execução por Bruno | Implementação do portal de upload, com testes |
| **Seg 03, manhã** | Bruno + André | Deploy final, README que funciona em máquina limpa, dado de demonstração |
| **Seg 03, até 17:30** | Bruno | Verificar a Definition of Done de projeto (CLAUDE.md, 1.2.1) e entregar |

### O que precisa ser decidido hoje, sem exceção

1. **Stack** (#2) — bloqueia todo o resto
2. **Escopo: Fase 01 apenas** — confirmar com a equipe e com os organizadores
3. **Mock ou integração real** — depende da resposta do backend na reunião; se não houver API até domingo, é mock com a limitação declarada

---

## Próximas tasks

Todas as tasks existem como issue no [backlog do GitHub](https://github.com/labsitio/nexus-orc-web/issues), conforme a seção 9 do CLAUDE.md. A ordem abaixo é por dependência, não por importância.

| Issue | Task | Responsável |
|---|---|---|
| [#8](https://github.com/labsitio/nexus-orc-web/issues/8) | Aceitar ou revisar o ADR-0001 e o ADR-0002 — pré-requisito de processo | Bruno |
| [#1](https://github.com/labsitio/nexus-orc-web/issues/1) | **Acordar o contrato base de integração com o backend** — maior espera externa, começar já | Bruno |
| [#6](https://github.com/labsitio/nexus-orc-web/issues/6) | Obter dos organizadores as metas numéricas dos critérios de sucesso | Bruno |
| [#2](https://github.com/labsitio/nexus-orc-web/issues/2) | **Decidir a stack em ADR** e preencher `engineering-principles.md` — caminho crítico | André |
| [#3](https://github.com/labsitio/nexus-orc-web/issues/3) | Preencher `architecture.md`: arquitetura, fronteiras e estratégia de mock | André |
| [#4](https://github.com/labsitio/nexus-orc-web/issues/4) | Criar o agente Product Planner e preencher `planning.md` — sem dependência | Kássio |
| [#7](https://github.com/labsitio/nexus-orc-web/issues/7) | Criar o agente Tech Lead e finalizar o CLAUDE.md | Bruno |
| [#5](https://github.com/labsitio/nexus-orc-web/issues/5) | Criar o agente QA & Reviewer e preencher `quality.md` — depende de #2 e #6 | Bruno |
| [#9](https://github.com/labsitio/nexus-orc-web/issues/9) | Configurar o GitHub MCP nas máquinas de André e Kássio | André, Kássio |
| [#10](https://github.com/labsitio/nexus-orc-web/issues/10) | Habilitar a proteção da branch `main` com Require review from Code Owners | Bruno |
| [#11](https://github.com/labsitio/nexus-orc-web/issues/11) | Alinhar as datas de referência de cada entrega | Bruno |
| [#13](https://github.com/labsitio/nexus-orc-web/issues/13) | **Confirmar com os organizadores o que "rodando" significa e qual fase é esperada** — bloqueia o backlog | Bruno |
| [#12](https://github.com/labsitio/nexus-orc-web/issues/12) | Estruturar o backlog de implementação das 3 fases — **portão da fase de código**; depende de #1, #2, #3 e #13 | Kássio |
| [#14](https://github.com/labsitio/nexus-orc-web/issues/14) | Build, deploy e hospedagem das interfaces web — parte da definição de pronto | André |
| [#15](https://github.com/labsitio/nexus-orc-web/issues/15) | Plano de troca do mock pela API real, com data | André |

---

## Bloqueios

1. **Critérios de sucesso sem números.** O escopo define os objetivos qualitativamente ("de horas para minutos", "rastreabilidade completa") mas não traz metas verificáveis. Sem elas, Bruno não consegue escrever critérios de aceite que possam ser de fato verificados em `docs/quality.md`.
2. **GitHub MCP pendente para André e Kássio.** Funcionando na máquina de Bruno — validado com leitura autenticada no repositório privado. Cada integrante precisa repetir o procedimento do README ("Integração com o GitHub via MCP"): criar um token clássico próprio e definir `GITHUB_MCP_PAT`. Até que cada um faça isso, os agentes daquela pessoa não operam issues nem PRs.
3. **Proteção da branch `main` não configurada.** O `.github/CODEOWNERS` está completo com os três handles, mas o GitHub só **exige** a revisão do dono se "Require review from Code Owners" estiver habilitado na proteção da branch. Sem isso, o arquivo apenas sugere revisores e o mapa de donos segue valendo como acordo.
4. **Nenhum agente de desenvolvimento criado.** Os cinco agentes descritos em `docs/team-responsibilities.md` existem apenas como especificação; nenhum foi implementado. (Não confundir com os 5 agentes de IA do produto, que são do backend — ver CLAUDE.md, seção 1.3.)
5. **Contrato com o backend em aberto, mas já publicado por eles.** O backend entregou [openapi.yaml](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml) (OpenAPI 3.1, `0.1.0-provisional`) e um [guia de leitura para o frontend](https://github.com/labsitio/nexus-orc-back/blob/main/docs/api-contrato-frontend.md), com as suposições e lacunas marcadas. Casing, datas, enums, erro (RFC 7807), tipo de ID, autenticação e nulabilidade estão **definidos** — falta confirmar em reunião e transcrever. O que segue aberto são as lacunas estruturais e o mecanismo de status, tratados em `docs/contrato-integracao-pauta.md`. O repositório deles está em fase de especificação: **não há implementação ainda**, então o frontend depende integralmente de mock por enquanto.

---

## Riscos

- **O entregável final é software rodando, e o backend não tem implementação.** Os organizadores têm utilização prevista para o Nexo — é projeto real, e ao final esperam o projeto funcionando, não só documentação e agentes. Mas o repositório do backend está em **fase de especificação**: contrato publicado, zero código. Se a nossa entrega precisa funcionar integrada, dependemos de algo que ainda não existe do outro lado. **É o risco de maior impacto do projeto.** Mitigações: mock como ponte com data de troca (#15), e a pergunta sobre o que "rodando" significa levada aos organizadores (#13). Definition of Done de projeto em CLAUDE.md, seção 1.2.1.
- **Prazo de 4 dias, dois de fim de semana.** Entrega em 03/08 às 17:30. Com 2 pessoas ativas, nenhum agente criado e zero código, só há espaço para **uma** fase do roadmap. Recomendação registrada em "Prazo e plano até a entrega": Fase 01, portal de upload. O painel do gestor não é construível conforme o escopo enquanto o backend não tiver endpoint de listagem — o corte é técnico, não só de tempo.
- **Divergência entre frentes.** Três pessoas preenchendo documentos em paralelo (arquitetura, stack, qualidade, planejamento) podem produzir decisões incompatíveis. Mitigação prevista: coordenação do Tech Lead, CODEOWNERS por documento e registro de conflitos em ADR (CLAUDE.md, seção 3).
- **Disponibilidade desigual entre as frentes.** A disponibilidade dos integrantes varia ao longo do treinamento, e a de Kássio é reduzida. O desenho absorve isso: a frente de planejamento é autocontida e não é caminho único — o backlog é operado por Bruno desde o início, independente do agente Product Planner existir. Suplência de cada documento registrada em `docs/team-responsibilities.md` ("Suplência e Continuidade"). **Risco residual:** Bruno concentra governança, qualidade, alinhamento externo e execução, sem folga para imprevisto — se algo precisar ceder, considerar mover `quality.md` para André.
- **Caminho crítico concentrado em André.** Arquitetura e stack destravam a qualidade (Bruno não escreve critério de teste sem saber qual ferramenta a stack traz) e o planejamento. Atraso aqui propaga para todas as frentes.
- **Integração tardia entre as 3 equipes.** Backend, frontend e mobile trabalham em paralelo e integram só no final. Mitigação: contrato base acordado no início e mock derivado dele (ver `docs/architecture.md`, seção 5).
- **Colisão de vocabulário em "agente".** O produto tem 5 agentes de IA (Bedrock, do backend) e esta equipe tem 5 agentes de desenvolvimento (Claude Code). São cinco de cada lado, e confundi-los gera erro de escopo — alguém pode achar que a equipe de frontend deve construir o Classificador ou o Extrator. Mitigação: tabela de desambiguação no CLAUDE.md, seção 1.3, e qualificação obrigatória do termo em toda discussão.
- **O painel do gestor não tem backend especificado.** O contrato publicado pelo backend ([openapi.yaml](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml)) declara que **não existe spec de um Bounded Context "Acompanhamento"** — a spec 006 (Portal do Gestor) foi removida do repositório deles. Não há endpoint para **listar orçamentos**, nem para listar **pendências de revisão humana**; a busca semântica só retorna o que já foi validado, e o endpoint de status consolidado é PROVISÓRIO e sem dono. Como o painel é a nossa entrega das Fases 02 e 03, isto é risco de **escopo**, não de integração. Tratado no bloco 2 de `docs/contrato-integracao-pauta.md`; se a reunião não resolver, escalar aos organizadores.
- **Não existe push de status: só polling.** O escopo exige status em tempo real, mas o backend não especificou WebSocket nem SSE em nenhum plan.md, e nenhuma spec define intervalo de polling. Única referência temporal: p95 ≤ 5 min por etapa do pipeline. Afeta diretamente a decisão de stack (#2) — sem AppSync do lado deles, não há subscription a consumir.
- **Autenticação do portal do fornecedor em aberto.** Todo endpoint exige JWT do Cognito, e o contrato do backend trata apenas de papéis internos. Não está definido se o fornecedor externo tem conta no Cognito, se é pool separado, nem quem implementaria o cadastro/convite. Define se entregamos duas aplicações ou uma com autorização por papel.
- **Exportação de auditoria em JSON.** O backend entrega JSON paginado por decisão registrada (ADR-006 deles); CSV e PDF são responsabilidade do frontend. Nosso escopo pede relatórios exportáveis, então a geração do arquivo é trabalho nosso e precisa entrar no backlog.
- **Stack já sugerida pelo escopo.** Os documentos sugerem React/Next.js + AppSync/API Gateway + Cognito, hospedado em CloudFront + S3, explicitamente como "ponto de partida para discussão do time". André não parte de uma folha em branco: precisa **adotar ou justificar o desvio em ADR**. Ignorar a sugestão sem registro é o risco aqui.
- **Templates permanecerem vazios.** O maior risco de processo é a implementação começar antes de `architecture.md`, `engineering-principles.md`, `quality.md` e `planning.md` serem preenchidos, esvaziando a governança na prática.
- **Modelo de governança ainda não aceito formalmente.** O [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md) foi redigido, mas está em status **Proposto**. Pela seção 7 do CLAUDE.md, nenhuma implementação que dependa deste modelo deve prosseguir antes do aceite. Mitigação: aceite explícito do responsável humano.
- **Dependência de aprovação humana.** A fase de preparação está parada aguardando aprovação; sem ela, nenhuma frente avança.

---

## ADRs recentes

- [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md) — Adoção do modelo de governança documental com ADRs, STATUS e backlog no GitHub — **Proposto** (aguardando aceite do responsável humano).
- [ADR-0002](docs/adr/0002-execucao-centralizada-e-escritor-unico.md) — Execução centralizada dos agentes e escritor único do STATUS.md — **Proposto**.

Template para novos ADRs: [docs/adr/TEMPLATE.md](docs/adr/TEMPLATE.md).

---

## Observações

- **`.github/CODEOWNERS` está com placeholders** (`@usuario-pessoa-1/2/3`). Enquanto não forem substituídos pelos handles reais, **o GitHub ignora as regras silenciosamente** — nada é exigido no Pull Request e o mapa de donos segue valendo apenas como acordo. É a task 9.
- **Nome do projeto definido: Nexo.** Todas as referências na documentação já usam esse nome. A **pasta raiz de trabalho ainda se chama `LabsTalks - Agentes IA`** (nome do treinamento, não do projeto) — a renomeação está pendente e deve ocorrer fora de uma sessão ativa do Claude Code, ou ser resolvida naturalmente ao criar o repositório com o nome `nexo`.
- A estrutura criada é **exclusivamente documental**. Nenhum código de aplicação, nenhuma tecnologia e nenhuma stack foram definidos — intencionalmente, pois essas decisões pertencem a André e Kássio e devem passar por ADR.
- `docs/architecture.md`, `docs/engineering-principles.md`, `docs/quality.md` e `docs/planning.md` são esqueletos com seções e orientações de preenchimento, sem qualquer decisão tomada.
- A sequência recomendada de trabalho entre as cinco frentes está no final de [docs/team-responsibilities.md](docs/team-responsibilities.md).
