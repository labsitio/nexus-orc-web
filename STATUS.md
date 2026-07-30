# STATUS.md — Projeto Nexo

> Este arquivo reflete o **estado atual** do projeto. Não é um histórico — histórico detalhado vive no GitHub (issues, PRs, commits). Deve ser atualizado ao final de qualquer sessão de trabalho relevante, conforme regras definidas em [CLAUDE.md](CLAUDE.md#8-atualização-de-status).

---

## Última atualização

- **Data:** 2026-07-30
- **Atualizado por:** Claude, atuando como Tech Lead (o agente Tech Lead formal ainda não foi criado — ver [docs/team-responsibilities.md](docs/team-responsibilities.md), Bruno)

---

## Feature atual

Nenhuma feature de produto em desenvolvimento. O projeto está na **fase de preparação de governança**: montagem da estrutura de documentação e definição de responsabilidades, anterior a qualquer implementação.

- **Epic/Issue:** _(a criar — backlog no GitHub ainda não existe, ver Bloqueios)_
- **Descrição:** Estabelecer a estrutura de governança, planejamento e qualidade que orientará a equipe de agentes antes do início do desenvolvimento.
- **Escopo do produto:** recebido em 2026-07-30, em [`escopo/`](escopo/) (5 arquivos HTML). Resumo e delimitação da fatia de frontend registrados no [CLAUDE.md](CLAUDE.md), seções 1, 1.1 e 1.2.

---

## Task atual

Criação da documentação base de governança — **concluída, aguardando aprovação do responsável humano**.

- **Issue:** _(a criar)_
- **Responsável:** Tech Lead
- **Status:** em revisão
- **Entregue:** `README.md`, `CLAUDE.md`, `STATUS.md`, os quatro documentos de frente em `docs/`, `docs/team-responsibilities.md`, `docs/adr/TEMPLATE.md`, ADR-0001 e ADR-0002, `.gitignore`, `.gitattributes`, `.mcp.json`, `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md` e o comando `.claude/commands/minhas-tarefas.md`
- **Repositório:** publicado em [nexus-orc-web](https://github.com/labsitio/nexus-orc-web), branch `main`

---

## Próximas tasks

Todas dependem da aprovação da estrutura atual e da resolução dos bloqueios abaixo. Cada item deverá virar issue no GitHub antes de ser iniciado.

1. Aceitar (ou revisar) o [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md), formalizando o modelo de governança — pré-requisito de processo para as demais.
2. Criar as issues das tasks abaixo no GitHub, agora que o MCP está operacional (Bruno).
3. **Abrir a negociação do contrato base com a equipe de backend** (Bruno) — maior tempo de espera externo, deve começar imediatamente.
4. Alinhar com a equipe as **datas de referência de cada entrega** e confirmar a suplência registrada em `docs/team-responsibilities.md` (Bruno).
5. Criar o agente **Tech Lead** e finalizar o CLAUDE.md (Bruno).
6. Decidir a stack em ADR, criar os agentes **Frontend Architect** e **Frontend Developer** e preencher `docs/architecture.md` e `docs/engineering-principles.md` (André) — caminho crítico.
7. Criar o agente **QA & Reviewer** e preencher `docs/quality.md` — com teste automatizado obrigatório no DoD (Bruno).
8. Criar o agente **Product Planner**, preencher `docs/planning.md` e estruturar o backlog das 3 fases (Kássio, com Bruno como suplente).
9. Habilitar a proteção da branch `main` com "Require review from Code Owners" nas configurações do repositório (Bruno).

---

## Bloqueios

1. **Critérios de sucesso sem números.** O escopo define os objetivos qualitativamente ("de horas para minutos", "rastreabilidade completa") mas não traz metas verificáveis. Sem elas, Bruno não consegue escrever critérios de aceite que possam ser de fato verificados em `docs/quality.md`.
2. **GitHub MCP pendente para André e Kássio.** Funcionando na máquina de Bruno — validado com leitura autenticada no repositório privado. Cada integrante precisa repetir o procedimento do README ("Integração com o GitHub via MCP"): criar um token clássico próprio e definir `GITHUB_MCP_PAT`. Até que cada um faça isso, os agentes daquela pessoa não operam issues nem PRs.
3. **Proteção da branch `main` não configurada.** O `.github/CODEOWNERS` está completo com os três handles, mas o GitHub só **exige** a revisão do dono se "Require review from Code Owners" estiver habilitado na proteção da branch. Sem isso, o arquivo apenas sugere revisores e o mapa de donos segue valendo como acordo.
4. **Nenhum agente de desenvolvimento criado.** Os cinco agentes descritos em `docs/team-responsibilities.md` existem apenas como especificação; nenhum foi implementado. (Não confundir com os 5 agentes de IA do produto, que são do backend — ver CLAUDE.md, seção 1.3.)
5. **Contrato base com o backend não iniciado.** Nenhum contato com a equipe de backend até o momento. Como o frontend depende desse contrato para mockar dados e as três equipes trabalham em paralelo, atrasar isso comprime o prazo de todas as frentes.

---

## Riscos

- **Divergência entre frentes.** Três pessoas preenchendo documentos em paralelo (arquitetura, stack, qualidade, planejamento) podem produzir decisões incompatíveis. Mitigação prevista: coordenação do Tech Lead, CODEOWNERS por documento e registro de conflitos em ADR (CLAUDE.md, seção 3).
- **Disponibilidade desigual entre as frentes.** A disponibilidade dos integrantes varia ao longo do treinamento, e a de Kássio é reduzida. O desenho absorve isso: a frente de planejamento é autocontida e não é caminho único — o backlog é operado por Bruno desde o início, independente do agente Product Planner existir. Suplência de cada documento registrada em `docs/team-responsibilities.md` ("Suplência e Continuidade"). **Risco residual:** Bruno concentra governança, qualidade, alinhamento externo e execução, sem folga para imprevisto — se algo precisar ceder, considerar mover `quality.md` para André.
- **Caminho crítico concentrado em André.** Arquitetura e stack destravam a qualidade (Bruno não escreve critério de teste sem saber qual ferramenta a stack traz) e o planejamento. Atraso aqui propaga para todas as frentes.
- **Integração tardia entre as 3 equipes.** Backend, frontend e mobile trabalham em paralelo e integram só no final. Mitigação: contrato base acordado no início e mock derivado dele (ver `docs/architecture.md`, seção 5).
- **Colisão de vocabulário em "agente".** O produto tem 5 agentes de IA (Bedrock, do backend) e esta equipe tem 5 agentes de desenvolvimento (Claude Code). São cinco de cada lado, e confundi-los gera erro de escopo — alguém pode achar que a equipe de frontend deve construir o Classificador ou o Extrator. Mitigação: tabela de desambiguação no CLAUDE.md, seção 1.3, e qualificação obrigatória do termo em toda discussão.
- **"Status em tempo real" não está especificado.** O escopo exige status em tempo real e alertas no painel do gestor, mas não define o mecanismo. Polling, subscription via AppSync/WebSocket ou outro caminho é decisão de arquitetura de frontend **acoplada ao backend** — precisa entrar na pauta do contrato base, não ser decidida unilateralmente.
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
