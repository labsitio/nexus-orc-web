# STATUS.md — Projeto Nexo

> Este arquivo reflete o **estado atual** do projeto. Não é um histórico — histórico detalhado vive no GitHub (issues, PRs, commits). Deve ser atualizado ao final de qualquer sessão de trabalho relevante, conforme regras definidas em [CLAUDE.md](CLAUDE.md#8-atualização-de-status).

---

## Última atualização

- **Data:** 2026-07-24
- **Atualizado por:** Claude, atuando como Tech Lead (o agente Tech Lead formal ainda não foi criado — ver [docs/team-responsibilities.md](docs/team-responsibilities.md), Pessoa 1)

---

## Feature atual

Nenhuma feature de produto em desenvolvimento. O projeto está na **fase de preparação de governança**: montagem da estrutura de documentação e definição de responsabilidades, anterior a qualquer implementação.

- **Epic/Issue:** _(a criar — backlog no GitHub ainda não existe, ver Bloqueios)_
- **Descrição:** Estabelecer a estrutura de governança, planejamento e qualidade que orientará a equipe de agentes antes do início do desenvolvimento.
- **Escopo do produto:** recebido em 2026-07-24, em [`escopo/`](escopo/) (5 arquivos HTML). Resumo e delimitação da fatia de frontend registrados no [CLAUDE.md](CLAUDE.md), seções 1, 1.1 e 1.2.

---

## Task atual

Criação da documentação base de governança — **concluída, aguardando aprovação do responsável humano**.

- **Issue:** _(a criar)_
- **Responsável:** Tech Lead
- **Status:** em revisão
- **Entregue:** `CLAUDE.md`, `STATUS.md`, `docs/architecture.md`, `docs/engineering-principles.md`, `docs/quality.md`, `docs/planning.md`, `docs/team-responsibilities.md`, `docs/adr/TEMPLATE.md`, `docs/adr/0001-adocao-do-modelo-de-governanca.md`

---

## Próximas tasks

Todas dependem da aprovação da estrutura atual e da resolução dos bloqueios abaixo. Cada item deverá virar issue no GitHub antes de ser iniciado.

1. Aceitar (ou revisar) o [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md), formalizando o modelo de governança — pré-requisito de processo para as demais.
2. Vincular esta documentação ao repositório [nexus-orc-web](https://github.com/labsitio/nexus-orc-web), configurar o **GitHub MCP** e abrir as issues das tasks abaixo (Pessoa 1).
3. **Abrir a negociação do contrato base com a equipe de backend** (Pessoa 1) — maior tempo de espera externo, deve começar imediatamente.
4. **Definir o ponto de corte** a partir do qual a Pessoa 1 assume a frente de planejamento, caso a Pessoa 3 não retorne (Pessoa 1).
5. Criar o agente **Tech Lead** e finalizar o CLAUDE.md (Pessoa 1).
6. Decidir a stack em ADR, criar os agentes **Frontend Architect** e **Frontend Developer** e preencher `docs/architecture.md` e `docs/engineering-principles.md` (Pessoa 2) — caminho crítico.
7. Criar o agente **QA & Reviewer**, preencher `docs/quality.md` (com teste automatizado obrigatório no DoD) e criar o template de PR + CODEOWNERS (Pessoa 1).
8. Criar o agente **Product Planner**, preencher `docs/planning.md` e estruturar o backlog das 3 fases (Pessoa 3 — ou Pessoa 1, se atingido o ponto de corte da contingência).
9. Registrar em ADR-0002 o modelo de execução centralizada e o escritor único do STATUS.md (Pessoa 1).

---

## Bloqueios

1. **Critérios de sucesso sem números.** O escopo define os objetivos qualitativamente ("de horas para minutos", "rastreabilidade completa") mas não traz metas verificáveis. Sem elas, a Pessoa 1 não consegue escrever critérios de aceite que possam ser de fato verificados em `docs/quality.md`.
2. **GitHub MCP não configurado.** Os três repositórios já existem na organização `labsitio` (o nosso é [nexus-orc-web](https://github.com/labsitio/nexus-orc-web)), mas o acesso via MCP exigido pela seção 9 do CLAUDE.md ainda não está configurado nesta máquina, e o `gh` CLI não está instalado. Sem isso, o backlog oficial não pode ser operado pelos agentes.
3. **Esta pasta local não é o repositório.** A documentação de governança vive em `C:\Projetos\Labsit\nexo`, que não está vinculado a `nexus-orc-web`. Precisa ser decidido se estes documentos vão para a raiz do repositório do time (recomendado — governança versionada junto com o código que ela governa) e, em caso positivo, feito o `git init`/clone e o primeiro commit.
4. **Nenhum agente de desenvolvimento criado.** Os cinco agentes descritos em `docs/team-responsibilities.md` existem apenas como especificação; nenhum foi implementado. (Não confundir com os 5 agentes de IA do produto, que são do backend — ver CLAUDE.md, seção 1.3.)
5. **Contrato base com o backend não iniciado.** Nenhum contato com a equipe de backend até o momento. Como o frontend depende desse contrato para mockar dados e as três equipes trabalham em paralelo, atrasar isso comprime o prazo de todas as frentes.

---

## Riscos

- **Divergência entre frentes.** Três pessoas preenchendo documentos em paralelo (arquitetura, stack, qualidade, planejamento) podem produzir decisões incompatíveis. Mitigação prevista: coordenação do Tech Lead, CODEOWNERS por documento e registro de conflitos em ADR (CLAUDE.md, seção 3).
- **Equipe efetiva de 2 pessoas, não 3.** A Pessoa 3 tem participação incerta e pode não entregar nada. O planejamento assume contribuição zero dela: recebeu a frente de planejamento por ser a mais autocontida e a única cuja ausência a Pessoa 1 consegue cobrir sem perder critério de avaliação. Mitigação e ponto de corte em `docs/team-responsibilities.md` ("Plano de contingência"). **Risco residual:** a Pessoa 1 acumula governança, qualidade, negociação externa e execução oficial — não há folga para imprevisto.
- **Caminho crítico concentrado na Pessoa 2.** Arquitetura e stack destravam a qualidade (a Pessoa 1 não escreve critério de teste sem saber qual ferramenta a stack traz) e o planejamento. Atraso aqui propaga para todas as frentes.
- **Integração tardia entre as 3 equipes.** Backend, frontend e mobile trabalham em paralelo e integram só no final. Mitigação: contrato base acordado no início e mock derivado dele (ver `docs/architecture.md`, seção 5).
- **Colisão de vocabulário em "agente".** O produto tem 5 agentes de IA (Bedrock, do backend) e esta equipe tem 5 agentes de desenvolvimento (Claude Code). São cinco de cada lado, e confundi-los gera erro de escopo — alguém pode achar que a equipe de frontend deve construir o Classificador ou o Extrator. Mitigação: tabela de desambiguação no CLAUDE.md, seção 1.3, e qualificação obrigatória do termo em toda discussão.
- **"Status em tempo real" não está especificado.** O escopo exige status em tempo real e alertas no painel do gestor, mas não define o mecanismo. Polling, subscription via AppSync/WebSocket ou outro caminho é decisão de arquitetura de frontend **acoplada ao backend** — precisa entrar na pauta do contrato base, não ser decidida unilateralmente.
- **Stack já sugerida pelo escopo.** Os documentos sugerem React/Next.js + AppSync/API Gateway + Cognito, hospedado em CloudFront + S3, explicitamente como "ponto de partida para discussão do time". A Pessoa 2 não parte de uma folha em branco: precisa **adotar ou justificar o desvio em ADR**. Ignorar a sugestão sem registro é o risco aqui.
- **Templates permanecerem vazios.** O maior risco de processo é a implementação começar antes de `architecture.md`, `engineering-principles.md`, `quality.md` e `planning.md` serem preenchidos, esvaziando a governança na prática.
- **Modelo de governança ainda não aceito formalmente.** O [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md) foi redigido, mas está em status **Proposto**. Pela seção 7 do CLAUDE.md, nenhuma implementação que dependa deste modelo deve prosseguir antes do aceite. Mitigação: aceite explícito do responsável humano.
- **Dependência de aprovação humana.** A fase de preparação está parada aguardando aprovação; sem ela, nenhuma frente avança.

---

## ADRs recentes

- [ADR-0001](docs/adr/0001-adocao-do-modelo-de-governanca.md) — Adoção do modelo de governança documental com ADRs, STATUS e backlog no GitHub — **Proposto** (aguardando aceite do responsável humano).

Template para novos ADRs: [docs/adr/TEMPLATE.md](docs/adr/TEMPLATE.md).

---

## Observações

- **Nome do projeto definido: Nexo.** Todas as referências na documentação já usam esse nome. A **pasta raiz de trabalho ainda se chama `LabsTalks - Agentes IA`** (nome do treinamento, não do projeto) — a renomeação está pendente e deve ocorrer fora de uma sessão ativa do Claude Code, ou ser resolvida naturalmente ao criar o repositório com o nome `nexo`.
- A estrutura criada é **exclusivamente documental**. Nenhum código de aplicação, nenhuma tecnologia e nenhuma stack foram definidos — intencionalmente, pois essas decisões pertencem às Pessoas 2 e 3 e devem passar por ADR.
- `docs/architecture.md`, `docs/engineering-principles.md`, `docs/quality.md` e `docs/planning.md` são esqueletos com seções e orientações de preenchimento, sem qualquer decisão tomada.
- A sequência recomendada de trabalho entre as cinco frentes está no final de [docs/team-responsibilities.md](docs/team-responsibilities.md).
