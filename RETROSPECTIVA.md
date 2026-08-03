# RETROSPECTIVA.md — Aprendizados do Exercício Nexo

> Este documento não é governança (isso é `CLAUDE.md`) nem estado (isso é `STATUS.md`). É o registro do que a equipe aprendeu construindo o Nexo como exercício de desenvolvimento assistido por agentes de IA — para servir de referência em projetos futuros, dentro ou fora deste time.

**Data:** 2026-08-03 (dia da entrega, revisado após a apresentação)
**Escrito por:** Bruno Martins, a partir da execução real do projeto — não é teoria, é o que de fato aconteceu.

> **Se for para levar uma única lição daqui:** a das seções 4.1 e 4.2. Terminamos o dia com 87 testes verdes e três defeitos que quebravam o fluxo principal no navegador. Suíte verde e aplicação funcionando são verificações diferentes, e a segunda não é opcional quando o entregável é software rodando.

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
- **Um agente cumpre bem a instrução que recebeu, inclusive a instrução incompleta.** O `frontend-developer` entregou duas features corretas e testadas no dia (a tela de confirmação e o detalhe do orçamento), mas em nenhuma das duas foi instruído a abrir a aplicação — então não abriu, e não tinha como saber que devia. Os defeitos da seção 4.1 são falha do prompt, não do agente. **Quanto mais capaz o executor, mais o resultado depende da precisão do pedido:** o que não está no prompt não acontece, e não vai ser questionado.
- **O `qa-reviewer` reprovou entregas com fundamento**, inclusive as escritas na mesma sessão de quem o invocou — três autores tiveram a primeira versão reprovada e os achados eram reais. Um revisor que só aprova não está revisando; que ele reprove o próprio time é sinal de que está funcionando.

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

**Um detalhe do GitHub que enganou três vezes:** `mergeable_state: "clean"` na API significa **ausência de conflito textual**, e nada mais. Não diz que o branch está atualizado. Um branch criado antes de três merges pode reportar `clean` e, ao ser mergeado, apagar o que aqueles três merges entregaram. A checagem que de fato responde é `git merge-base <branch> origin/main` comparado com o tip da `main` — se diferem, o branch está atrasado, independente do que a API diz.

---

## 4.1. O aprendizado mais caro: suíte verde não prova aplicação funcionando

Isto merece seção própria porque foi o padrão dominante da última hora, e nenhum dos três defeitos abaixo era detectável pelos testes — **todos os testes estavam corretos e verdes em todos os três casos**:

| Defeito | Por que o teste não pegou |
|---|---|
| **404 em todo o fluxo.** Os handlers de mock existiam só em `msw/node`, consumidos pelos testes. Na aplicação rodando, nada interceptava as chamadas. | O teste rodava exatamente o ambiente em que o mock existia. A aplicação era o único lugar onde ele não existia. |
| **`/v1https://...s3.amazonaws.com/...`** — `apiRequest` prefixava a base da API em toda URL, inclusive na URL presigned **absoluta** do S3. O fluxo abortava no 2º passo. | Este *foi* pego por 5 testes vermelhos — mas o PR declarava a suíte verde com base em `tsc --noEmit`, que checa tipo e não roda teste nenhum. O sinal existia; ninguém olhou. |
| **`cannot configure an already enabled network`** — `worker.start()` chamado a cada montagem, e `reactStrictMode` monta duas vezes de propósito em desenvolvimento. | Vitest não roda com Strict Mode nem monta a árvore duas vezes. O comportamento só existe no navegador em modo dev. |

Três conclusões práticas:

1. **Teste e aplicação são dois ambientes, não um.** Todo mock, provider ou configuração que existe só num deles é um defeito esperando o dia da demonstração. Vale perguntar de cada peça de infraestrutura de teste: *isso também vale onde o usuário clica?*
2. **`tsc --noEmit` não é rodar teste**, e "build passa" precisa ser verificado, não presumido — o `next build` estava quebrado por erro de tipo num PR que afirmava o contrário.
3. **Abrir a aplicação é uma etapa de verificação, não uma formalidade.** Quando o entregável é software rodando, clicar no fluxo principal é tão obrigatório quanto rodar a suíte. Nenhuma quantidade de teste substitui isso.

---

## 4.2. Sob prazo, a governança cede — e o que importa é ceder por escrito

Na última hora, três regras do próprio `CLAUDE.md` foram flexibilizadas. Registrar isso importa mais que fingir que não aconteceu:

- **O revisor corrigiu o PR do autor.** Com minutos até a apresentação, não havia janela para "autor corrige → revisor revalida". Empurrei a correção como **fast-forward** no branch dele, sem reescrever commit algum, e detalhei os quatro defeitos no PR. Foi a escolha certa para o prazo, e é péssima como hábito: some o aprendizado do autor e concentra conhecimento em quem corrigiu.
- **Uma feature foi implementada com as dependências declaradas em aberto.** O detalhe do orçamento (#46) foi entregue por cima de #44 (autenticação) e #45 (mock dos endpoints por BC), que seguem abertas, e com dado estático em vez de mock derivado do contrato. A issue foi **deixada aberta com a ressalva do que não foi feito**, em vez de fechada como se estivesse pronta.
- **Feature nova entrou sem passar pelo ciclo de planejamento.** Foi decisão de demonstração, não de produto.

O que salvou os três casos de virarem dívida invisível foi a mesma coisa: **declarar o desvio no lugar onde alguém vai procurar** — comentário no PR, ressalva na issue, limitação no README. Governança que não sobrevive à pressão de prazo não serve para nada; governança que sobrevive por escrito, mesmo cedendo, continua servindo.

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

1. **Abrir a aplicação no navegador desde o primeiro dia de código, não no dia da entrega.** É a mudança de maior impacto desta lista. Os três defeitos da seção 4.1 existiam há horas e só apareceram quando alguém clicou. Um item na Definition of Done por task — *"o fluxo que esta task toca foi exercitado no navegador"* — teria pego todos os três, cada um no dia em que foi introduzido.
2. **Fazer o mock valer no navegador junto com o mock de teste**, na mesma task (#38), não como correção de emergência. Configurar `msw/browser` custa uma tarde de trabalho no início e evita um 404 na hora da apresentação.
3. **Forçar rebase como parte do checklist de PR desde o primeiro dia**, não descobrir o problema na terceira ocorrência. Uma linha no template ("branch rebaseado sobre a `main` atual? confirmado por `git merge-base`") teria custado zero e evitado três investigações.
4. **Exigir no template de PR o output real do comando de teste**, colado, em vez da marcação de um checkbox. O checkbox foi marcado com honestidade em PRs cuja suíte estava vermelha — quem marcou acreditava que `tsc --noEmit` bastava. Pedir o output transforma uma afirmação em evidência, e custa um `Ctrl+V`.
5. **Negociar o escopo do token de integração (PAT) antes de qualquer PR tentar tocar workflow**, não no meio do dia da entrega.
6. **Definir explicitamente, com os organizadores, as metas numéricas dos critérios de sucesso antes do meio do projeto** — ficou como bloqueio aberto o projeto inteiro, porque sem número não existe critério de aceite verificável.
7. **Reservar tempo, cedo, para confirmar se o backend teria algo consumível de verdade** — a decisão de "mock até o fim" só virou explícita no dia da entrega; poderia ter sido decidida (e comunicada como risco) uma semana antes.
8. **Deixar o deploy funcionando antes de existir feature para publicar.** O pipeline foi escrito e nunca exercitado contra ambiente real, porque a conta AWS nunca foi confirmada. Um "hello world" publicado na primeira semana teria transformado uma incógnita de infraestrutura numa questão resolvida — e a entrega teria URL pública.
