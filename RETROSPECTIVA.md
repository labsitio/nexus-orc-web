# RETROSPECTIVA.md — Aprendizados do Exercício Nexo

> Este documento não é governança (isso é `CLAUDE.md`) nem estado (isso é `STATUS.md`). É o registro do que a equipe aprendeu construindo o Nexo como exercício de desenvolvimento assistido por agentes de IA — para servir de referência em projetos futuros, dentro ou fora deste time.

**Data:** 2026-08-03 (dia da entrega)
**Escrito por:** Bruno Martins, a partir da execução real do projeto — não é teoria, é o que de fato aconteceu.

---

## 1. Agentes de desenvolvimento: o que funcionou

A equipe criou 5 agentes especializados (`.claude/agents/`), um por frente de responsabilidade:

| Agente | Papel | O que aprendemos |
|---|---|---|
| `tech-lead` | Guarda o processo, consolida `STATUS.md`, resolve contradição entre docs | Mais valioso como **auditor de coerência** do que como executor — seu maior ganho foi achar divergências entre o que os documentos diziam e o que o código/backlog realmente refletiam. |
| `frontend-architect` | Estrutura, contrato de integração, mock strategy | Funciona melhor **antes** do código existir — decisões de arquitetura tomadas cedo evitaram retrabalho estrutural depois. |
| `frontend-developer` | Implementa componentes/testes conforme convenções | O agente mais executado do dia. Ganho real só apareceu depois que ganhou `Glob`/`Grep` (issue #28) — sem eles, não conseguia se orientar num monorepo que ele mesmo não criou. |
| `qa-reviewer` | Revisa contra a Definition of Done, não escreve código | O agente com maior retorno por token gasto: achou bugs reais e específicos (não genéricos) em praticamente toda revisão de PR do dia. |
| `product-planner` | Fatia backlog em épicos/tasks com critério de aceite | Essencial na fase de planejamento (fim de semana), quase ocioso depois que a implementação começou — seu valor é concentrado no início do ciclo, não distribuído. |

**Lição central:** um agente por *responsabilidade*, não por *pessoa*. As três pessoas da equipe rodaram os mesmos 5 agentes em máquinas diferentes — o agente carrega o conhecimento de "como fazer", a pessoa só decide "quando" e "com qual token budget".

### O que não funcionou de primeira

- Um agente criado **no meio de uma sessão já aberta** (`product-planner`) não apareceu como tipo invocável (`Agent type not found`) — o registro de subagentes carrega na abertura da sessão. Precisou sessão nova para validar de verdade. **Lição:** criar o agente e reabrir a sessão antes de declarar "pronto para uso".
- Confiar no relato de "executei o agente e validou" sem rodar de novo por conta própria gerou pelo menos duas rodadas de retrabalho (ver seção 4).

---

## 2. Integração via MCP (GitHub)

O GitHub como MCP (em vez de CLI `gh` ou navegação manual) foi decisivo para dar ao Claude Code autonomia real sobre o backlog:

- **Ganho real:** criar/reatribuir issues, comentar em PRs, checar CI, mergear — tudo dentro da mesma sessão, sem trocar de ferramenta. Isso tornou o loop "revisar → comentar → esperar → re-verificar" rápido o bastante para acontecer várias vezes no mesmo dia, sob pressão de prazo.
- **Ganho inesperado:** `pull_request_read` com `get_check_runs` e `get_commits` permitiu **verificar objetivamente** o que uma pessoa alegava ter feito, comparando com o que o Git realmente registrava — isso virou disciplina central do dia (seção 4).
- **Limite descoberto:** o **PAT da equipe não tinha escopo `workflow`** — o GitHub bloqueia push de mudanças em `.github/workflows/*` sem esse escopo, mesmo via MCP. Um PR (#71) precisou deliberadamente deixar de fora uma mudança de CI por causa disso. **Lição:** o escopo do token de integração precisa ser decidido *antes* de alguém tentar mexer em workflow no meio de um PR sob prazo.
- **Custo de contexto:** respostas grandes (diff de PR, lista de commits) estouram limite de token da própria chamada de ferramenta e viram arquivo em disco. Vale pedir campos específicos (`fields: [...]`) em vez do objeto completo sempre que possível.

---

## 3. Atribuição de tasks e execução distribuída

O modelo evoluiu three vezes ao longo do projeto, e cada mudança foi uma decisão real, não cosmética:

1. **Centralizado (ADR-0002):** só Bruno executava, para manter `STATUS.md` com escritor único e reduzir ruído de coordenação. Funcionou enquanto o volume de trabalho cabia numa pessoa.
2. **Distribuído com exceções (ADR-0003, duas emendas):** André e depois Kássio passaram a rodar os próprios agentes, mas em pontos específicos (quando o gargalo real virou *sessão/token*, não *entendimento do processo*).
3. **Totalmente distribuído no dia da entrega (ADR-0003, terceira emenda):** as três máquinas rodando em paralelo, sob a lógica de que o limite de token por sessão é o recurso escasso, e três contas multiplicam esse limite por três.

**Lição principal:** a governança precisa **evoluir com o gargalo real**, não com uma preferência inicial. O gargalo começou sendo "clareza de processo" (resolvido por centralização) e terminou sendo "throughput de tokens sob prazo fixo" (resolvido por distribuição) — o mesmo processo de governança (ADR + `STATUS.md`) serviu aos dois, só a *config* de execução mudou.

**Lição sobre paralelismo real:** dividir trabalho em 3 máquinas não multiplica velocidade por 3 automaticamente — o grafo de dependência da cadeia de tasks (#38→#40→#41, #39→#40→#42) só tinha paralelismo real de 2 em cada ponto. A divisão precisou ser **por etapa da cadeia**, reatribuída dinamicamente conforme quem terminava primeiro, não por pessoa fixa do início ao fim.

**Mecanismo que sustentou isso:** `/minhas-tarefas` lendo a identidade do Git e cruzando com uma tabela de identidades versionada — cada pessoa, em qualquer máquina, descobre sozinha o que fazer, sem depender de alguém lembrar de avisar. Isso importou mais no dia da entrega do que em qualquer outro momento.

---

## 4. Integração entre pessoas: a disciplina que mais valeu

A lição mais cara do dia, repetida pelo menos três vezes com o mesmo padrão: **"ele disse que fez" não é o mesmo que "aconteceu".**

Três PRs (#62, #69, #71) alegaram testes passando (às vezes citando `tsc --noEmit`, checagem de tipo, no lugar de rodar a suíte de verdade) e branches "prontos", quando na prática:

- Testes reais falhavam (5 casos em `useFileUpload.test.tsx`, verificados rodando `npm run test -- --run` de verdade, não confiando na descrição do PR).
- Branches não tinham sido rebaseados desde antes de dependências mergearem — e o GitHub reportava `mergeable_state: clean`, que **só indica ausência de conflito textual**, não que o branch está atualizado. Isso enganou a leitura superficial três vezes seguidas: mergear "limpo" teria revertido issues já entregues (#65, #70) sem ninguún perceber até a demo.

**Prática que se consolidou:** nunca aceitar o relato — sempre `git fetch` + rodar a suíte de verdade num worktree descartável antes de revisar ou mergear qualquer PR de outra pessoa. Rápido de fazer, e foi o que evitou pelo menos três reversões silenciosas de trabalho já entregue.

**Lição de comunicação:** comentar diretamente no PR (não só relatar ao humano em chat) foi o que permitiu que o autor visse o problema com contexto técnico completo (merge-base, diff exato, sugestão de comando) — em vez de "corrige isso aí", que obrigaria uma investigação nova do zero.

---

## 5. Governança como código vivo, não documento estático

`CLAUDE.md` + `STATUS.md` + ADRs formaram um ciclo fechado (decisão → registro → estado → planejamento → nova decisão) que funcionou mesmo sob pressão extrema de prazo — mas só porque a governança foi **proporcional**, não burocrática:

- ADRs viraram **emendas** em vez de documentos novos quando a decisão era pequena e urgente (terceira exceção de execução, no dia da entrega, levou minutos para registrar formalmente).
- Desvios de escopo foram **declarados explicitamente no PR** ("isto não foi feito, e é por isto") em vez de escondidos atrás de "está tudo pronto" — isso preservou a confiança de que o que estava marcado como feito, estava mesmo.
- O `check-docs` mecânico (rodado no CI) supriu o que a instrução em `CLAUDE.md` não conseguiria sozinha: uma trava técnica não depende de ninguém lembrar de segui-la.

**Lição sobre limites da governança documental:** ela é instrução, não trava — funciona porque todo mundo carrega o mesmo contexto (`CLAUDE.md` lido em toda sessão), mas pode ser contornada por quem insistir. A trava real vem de CODEOWNERS, branch protection e CI — três mecanismos que não dependem de leitura nem boa vontade.

---

## 6. Estratégia de mock como ponte, não destino

Trabalhar contra mock derivado do contrato real do backend (`openapi.yaml`), com campos PROVISÓRIOS isolados deliberadamente, permitiu às três equipes progredirem em paralelo sem que o frontend ficasse bloqueado por um backend ainda em fase de especificação.

**Risco que isso criou, e que se confirmou:** ficou fácil o mock virar confortável demais — o fluxo ficou "demonstrável contra mock" bem antes de qualquer integração real, e a decisão consciente de **declarar isso como limitação explícita** (no README, no STATUS.md) em vez de fingir que não importava foi o que manteve a entrega honesta sobre o que de fato funciona.

---

## 7. Se fôssemos começar de novo

O que faríamos diferente, sabendo o que sabemos agora:

1. **Forçar rebase como parte do checklist de PR desde o primeiro dia**, não descobrir o problema na terceira ocorrência. Uma linha no template de PR ("branch rebaseado sobre a `main` atual? confirmado por `git merge-base`") teria custado zero e evitado três investigações.
2. **Negociar o escopo do token de integração (PAT) antes de qualquer PR tentar tocar workflow**, não no meio do dia da entrega.
3. **Definir explicitamente, com os organizadores, as metas numéricas dos critérios de sucesso antes do meio do projeto** — isso ficou como bloqueio aberto o projeto inteiro, porque sem número não existe critério de aceite verificável.
4. **Reservar tempo, cedo, para confirmar se o backend teria algo consumível de verdade** — a decisão de "mock até o fim" só virou explícita no dia da entrega; poderia ter sido decidida (e comunicada como risco) uma semana antes.
