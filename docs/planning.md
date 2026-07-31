# Planejamento — Projeto Nexo

> Documento vivo, de responsabilidade do agente **Product Planner** (Kássio, com Bruno como suplente — ver [team-responsibilities.md](team-responsibilities.md)). Define o processo de planejamento do projeto: como o trabalho é quebrado em épicos e tasks, como prioridades e dependências são geridas, e como o backlog flui dentro do GitHub.

Este documento operacionaliza a filosofia de planejamento definida em [CLAUDE.md](../CLAUDE.md#10-filosofia-de-planejamento-antes-da-implementação) e as regras de uso do GitHub como backlog oficial ([CLAUDE.md, seção 9](../CLAUDE.md#9-utilização-do-github-via-mcp-como-backlog-oficial)).

**Quem decide o quê.** Três frentes tocam o mesmo artefato — a task —, então convém deixar explícito antes de qualquer regra:

| Frente | Decide |
|---|---|
| **Product Planner** (Kássio) | **O quê** e em que ordem: épicos, tasks, dependências e o critério de aceite de cada uma |
| **Frontend Architect / Developer** (André) | **Como**, dentro de cada task: componentes, rotas, estado. Não fatia o backlog |
| **QA & Reviewer** (Bruno) | **O que conta como pronto** no geral, em [quality.md](quality.md). O Planner escreve o critério específico dentro desse framework |

---

## 1. Processo de Planejamento

Uma necessidade vira item de trabalho rastreável em quatro passos. O ciclo é o mesmo para feature, defeito, débito técnico ou trabalho de processo.

| Passo | Quem | O que acontece |
|---|---|---|
| 1. **Proposta** | qualquer pessoa ou agente | Quem identificou a necessidade **abre a issue** — não implementa. Basta contexto e o que se espera que passe a funcionar |
| 2. **Fatiamento** | Product Planner | A proposta é recusada, quebrada ou aceita como task: recebe escopo, critério de aceite, dependências, milestone e responsável |
| 3. **Validação de escopo** | Tech Lead | Só quando a task envolve decisão estrutural (ADR pendente), afeta mais de uma frente, ou compromete a equipe com outra equipe |
| 4. **Execução** | frente responsável | Pelo comando `/implementar <nº>`, que exige plano antes do código |

Duas regras que sustentam o processo:

- **Ninguém implementa sem issue.** É a seção 4 do [CLAUDE.md](../CLAUDE.md). Trabalho não planejado que aparece no meio de outro vira issue nova, não carona no PR em andamento.
- **A ambiguidade é resolvida no passo 2, não durante a execução.** Se o Planner não consegue escrever o critério de aceite, a task não está pronta para sair do backlog — e o problema é do planejamento, não de quem vai implementar.

### Quando o Planner recusa uma proposta

Recusar é parte do trabalho, e a recusa é registrada como comentário na issue antes de fechá-la. Três motivos legítimos:

- **Não é da nossa fatia** — pertence a backend ou mobile (ver [CLAUDE.md](../CLAUDE.md), seção 1.1). Encaminhar, não absorver.
- **Não tem fonte de dados** — depende de endpoint que não existe no contrato do backend. Nesse caso a issue **não é fechada**: recebe `bloqueio-externo` e fica registrada com a dependência nomeada.
- **Não cabe no prazo e não é caminho crítico** — fica registrada como issue, sem milestone, e não disputa tempo com implementação.

---

## 2. Quebra em Épicos

**Um épico é uma capacidade que o usuário reconhece, entregável e demonstrável por si.** O teste é este: se o prazo cortar o projeto exatamente ao fim deste épico, sobra algo que dá para mostrar funcionando para alguém que não desenvolveu?

"Portal de upload do fornecedor" passa no teste. "Camada de API", "componentes de UI" e "configurar o build" não passam — são partes de um épico, não épicos.

**Convenções:**

- Título no formato `[Épico] <capacidade>` — ex: `[Épico] Portal de upload do fornecedor`.
- Label **`epico`**, e o milestone da fase correspondente.
- As tasks entram como **sub-issues** do épico (hierarquia nativa do GitHub), não como lista de caixas no corpo. Caixa marcada à mão desatualiza; sub-issue fechada não.
- O corpo do épico declara: a capacidade, quem é o usuário dela, **como demonstrá-la** e o que está fora.

**Tamanho.** Um épico que não cabe nas fases do roadmap está grande demais; um épico com uma única task não é épico — é task. Os épicos desta equipe saem diretamente do escopo, não de invenção: portal de upload (Fase 01), painel do gestor (Fases 02 e 03) e multi-tenant (Fase 03).

---

## 3. Quebra em Tasks

**Uma task é uma sessão de trabalho de um agente, com um critério de aceite verificável.** Duas verificações objetivas antes de considerá-la pronta para execução:

1. **Consegue-se escrever o critério de aceite com sim ou não?** Se o critério exige julgamento ("a tela deve estar boa"), não é critério — quebre mais ou reescreva.
2. **Outra pessoa executa sem perguntar nada ao autor?** Se precisa da conversa que gerou a task, a task está incompleta. É o que permite que o backlog seja executado por quem estiver disponível.

**Granularidade.** Uma task que precisa de vários dias está grande; uma task que só faz sentido mergeada junto com outra está pequena — a unidade é **o que pode entrar num Pull Request sozinho**, porque é o PR que dá lugar à revisão.

**Esqueleto obrigatório do corpo:**

```markdown
**Depende de:** #N (ou "nada")
**Fase:** 01 | 02 | 03 | transversal

## Contexto
## Escopo
## Critérios de aceite
## Fora de escopo
## Referências
```

**O responsável não vai no corpo** — vai no campo `assignee` nativo do GitHub, e só lá. Dois lugares para o mesmo dado divergem na primeira reatribuição, e é do campo que a seção 6 lê o estado "Pronta". **`Fase: transversal`** é para o que não pertence a fase de produto nenhuma: andaime, dado de demonstração, deploy, troca do mock pela API real.

Dois campos que costumam ser omitidos e não devem ser:

- **Fora de escopo** — o que alguém razoavelmente acharia incluído, e não está. É o que impede a task de crescer durante a implementação, e o que dá fundamento ao critério de `quality.md` "não faz **apenas** o que a issue pede".
- **Referências** — arquivo, seção, ADR ou endpoint do contrato. Task sem referência força o executor a garimpar, e garimpo é onde ele inventa.

**Critério de aceite mínimo, em toda task de comportamento:** existe teste automatizado que **falha se a mudança for revertida** ([quality.md](quality.md), seção 2). O Planner escreve isso explicitamente; não é subentendido.

As **exceções são as de `quality.md`** — as duas da seção 2 e a linha "Configuração / infra: quando testável" da seção 4. Em task de infraestrutura, o critério exige teste sobre a parte testável e pede que a verificação manual do resto seja **declarada no PR**. Critério de aceite inatingível é tão ruim quanto critério ausente.

---

## 4. Priorização

**Critério único: dependência real, depois entregabilidade.** Não há escala de prioridade P0/P1/P2 — com três pessoas e uma janela curta, escala de prioridade é discussão sobre rótulo, não sobre ordem.

A ordem vigente vem do [STATUS.md](../STATUS.md), seção "Prazo e plano até a entrega", e o Planner **não a reinventa**:

| Ordem | O quê | Situação |
|---|---|---|
| 1º | Portal de upload (Fase 01) | Viável — depende de 2 endpoints firmes |
| 2º | Painel do gestor, detalhe de um orçamento (Fase 02) | Viável — 5 endpoints de status firmes |
| 3º | Painel do gestor, lista | **Bloqueada por fora** — não existe endpoint de listagem |
| 4º | Multi-tenant (Fase 03) | Improvável no prazo |

**Quem decide:** o Planner ordena; o Tech Lead ajusta quando a ordem conflita com compromisso externo ou com o prazo. **Revisão:** a cada consolidação do `STATUS.md` — o backlog não tem cadência própria de repriorização (ver seção 7).

**Profundidade decrescente por fase.** Backlog exaustivo não é entregável: detalhar as três fases em grão fino consome a janela que era da implementação. Fase 01 com tasks prontas para executar; Fase 02 no nível de épico, com as tasks do caminho principal; Fase 03 registrada como épico e nada além.

---

## 5. Gestão de Dependências

Dependência se registra **no corpo da issue**, em linha própria e com o número: `**Depende de:** #17`. Sem número, a dependência não é rastreável; sem linha própria, ela se perde no texto.

Três naturezas, tratadas de forma diferente:

| Natureza | Como registrar | Efeito |
|---|---|---|
| **Interna** — depende de outra task nossa | `Depende de: #N` | A task fica no backlog. Enquanto #N estiver aberta, não é elegível para execução |
| **Externa** — depende de backend, mobile ou organizadores | `Depende de:` + label **`bloqueio-externo`** + de quem depende, nomeado | Não vira task executável. Se for pré-requisito de uma fase, o Tech Lead escala |
| **De decisão** — depende de ADR ou de campo de documento ainda vazio | `Depende de:` + o documento e a seção | Não sai do backlog antes do ADR ser aceito (CLAUDE.md, seção 7) |

**A dependência que mais invalida uma task:** endpoint inexistente. Antes de escrever qualquer task que consome dado do backend, conferir o [contrato deles](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml). Tela sem fonte de dados não é task de implementação, é dependência externa disfarçada — e nenhuma quantidade de agentes constrói uma lista sem endpoint. Campos marcados como `PROVISÓRIO` no contrato entram na task com a exigência de serem **isolados** no código.

**Dependência circular** entre duas tasks é sinal de que a fronteira entre elas está errada: junte-as ou mova o pedaço compartilhado para uma terceira.

---

## 6. Fluxo do Backlog no GitHub

O estado de um item **não é registrado em label** — é **derivado de sinais que o GitHub já atualiza sozinho**. A razão é prática: label de estado precisa ser movida à mão, e label não movida mente sobre o estado do backlog. O Project da organização, que resolveria isso com colunas, está bloqueado por configuração da `labsitio` (ver [STATUS.md](../STATUS.md), "Observações").

| Estado | Como é representado no GitHub | Quem atualiza |
|---|---|---|
| **Proposta** | Issue aberta, **sem milestone** | quem abriu |
| **Backlog** | Issue aberta, com milestone, **sem assignee** | Planner, ao fatiar |
| **Pronta** | Issue aberta, com milestone **e** assignee, sem `bloqueio-externo` e sem `Depende de:` aberta | Planner |
| **Bloqueada** | Issue aberta com label **`bloqueio-externo`**, ou com `Depende de: #N` cuja #N está aberta | Planner / quem detectou |
| **Em andamento** | Existe branch `<tipo>/<nº>-<descrição>` para a issue | quem executa (o `/implementar` cria) |
| **Em revisão** | Pull Request aberto com `Closes #<nº>` | quem executa |
| **Concluída** | Issue **fechada** — o merge do PR fecha sozinho pelo `Closes` | GitHub, no merge |

Nenhuma linha dessa tabela exige que alguém se lembre de mover nada: o milestone e o assignee são preenchidos uma vez no fatiamento, e branch, PR e fechamento vêm do próprio fluxo de trabalho.

### Labels: só roteamento e assunto

| Label | Significado |
|---|---|
| `para:andre` · `para:bruno` · `para:kassio` | Roteamento — de quem é a task. É o que o `/minhas-tarefas` consulta |
| `epico` | A issue é um épico e tem sub-issues |
| `bloqueio-externo` | Depende de alguém fora desta equipe |
| `planejamento` · `arquitetura` · `qualidade` · `governanca` · `infra` · `integracao` · `agente` | Assunto |

**Label nova exige combinação com o Tech Lead**, porque label é convenção e convenção não declarada só existe na cabeça de quem criou.

### Milestones — um por fase

| Milestone | Escopo |
|---|---|
| `Fase 01 — Portal de upload` | Envio manual de orçamento pelo fornecedor |
| `Fase 02 — Painel do gestor (detalhe)` | Ciclo de vida de **um** orçamento por id |
| `Fase 03 — Lista + multi-tenant` | Listagem, filtros e isolamento por tenant |

Toda task e todo épico recebem o milestone da fase. É o que dá "quanto falta por fase" sem o Project.

> **Limitação conhecida da ferramenta:** as ferramentas de MCP disponíveis **atribuem** milestone a uma issue, mas **não criam** — e não listam os existentes (`list_issues` não retorna o campo). Então o agente `product-planner` **assume que os milestones não existem até que um humano confirme, com o número de cada um**: ele para antes de criar as issues e pede a criação a quem tem o `gh` CLI autenticado. Criar issue sem milestone significa voltar depois em todas.

---

## 7. Cadência de Planejamento

**Não há ritual de planejamento com data.** Com a entrega em 03/08 e três pessoas em fusos de disponibilidade diferentes, reunião de replanejamento custa mais do que resolve. O planejamento é **orientado a evento**, e os eventos são estes:

| Evento | O que o Planner faz |
|---|---|
| Um épico termina | Confere se a fase seguinte está fatiada na profundidade da seção 4 |
| Uma dependência externa se resolve (ou cai) | Reavalia as tasks que a citavam — inclusive removendo as que perderam sentido |
| O `STATUS.md` é consolidado | Confere que a ordem do backlog é a mesma da seção "Prazo e plano até a entrega" |
| Alguém pede para implementar algo sem issue | Escreve a issue. Não libera a implementação |

Após a entrega, se o projeto continuar, este é o primeiro item a revisitar — uma cadência fixa passa a fazer sentido quando o horizonte deixa de ser de dias.

---

## 8. Relação com STATUS.md

O `STATUS.md` é escrito **só por Bruno** ([ADR-0002](adr/0002-execucao-centralizada-e-escritor-unico.md)). O Planner **reporta**, não edita — e o fluxo é de mão dupla:

| Direção | O que trafega |
|---|---|
| **Backlog → STATUS** | Épico concluído, task nova que muda o caminho crítico, dependência externa nova, risco de escopo. Vai pelo bloco "Para o STATUS.md" do PR, ou por comentário na issue mencionando **@brunomartins-labsit** |
| **STATUS → Backlog** | A ordem de entregabilidade e os bloqueios. O `STATUS.md` é **fonte** para a priorização da seção 4, não consequência dela |

**Divisão de conteúdo, para os dois não se sobreporem:** o `STATUS.md` diz *onde o projeto está*; o backlog do GitHub diz *o que falta e em que ordem*. Item concluído sai do `STATUS.md` e continua no GitHub como issue fechada — histórico é do GitHub, presente é do `STATUS.md`.

**Reportar status não cria issue nova.** O procedimento completo está em [team-responsibilities.md](team-responsibilities.md), seção "Escritor Único do STATUS.md — e como reportar".

---

## Referências

- [CLAUDE.md](../CLAUDE.md) — seções 4 (fluxo de planejamento), 9 (GitHub como backlog) e 10 (planejar antes de implementar)
- [docs/quality.md](quality.md) — framework de critérios de aceite e Definition of Done
- [docs/team-responsibilities.md](team-responsibilities.md) — fronteiras entre as frentes e como reportar ao `STATUS.md`
- [STATUS.md](../STATUS.md) — ordem de entregabilidade e bloqueios vigentes
- [ADR-0002](adr/0002-execucao-centralizada-e-escritor-unico.md) — escritor único do `STATUS.md`
- `.claude/agents/product-planner.md` — o agente que opera este processo
