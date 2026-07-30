# Divisão de Responsabilidades da Equipe — Projeto Nexo

> Define a distribuição de responsabilidades da equipe de frontend (repositório [nexus-orc-web](https://github.com/labsitio/nexus-orc-web)) do projeto Nexo: quem é dono de qual documento, quais agentes cada integrante desenvolve e em que ordem o trabalho converge.

A equipe tem **3 integrantes** e produz **6 agentes de desenvolvimento**. Os números são diferentes por decisão de desenho: a quantidade de agentes vem do trabalho a ser feito, não do tamanho do time. Criar e operar agentes é o objetivo central do treinamento, então cada integrante desenvolve pelo menos um, e nenhuma frente fica sem dono.

Referência de fluxo geral: [CLAUDE.md](../CLAUDE.md).

---

## Tabela de Identidades

Mapeia a identidade de cada integrante para a frente correspondente. É o que permite ao comando `/minhas-tarefas` descobrir automaticamente quem está usando o Claude Code, sem ninguém precisar se apresentar.

| Frente | Nome | Sinais de identificação (nome no Git, e-mail, usuário do GitHub) |
|---|---|---|
| Tech Lead, Integração & Qualidade | Bruno Martins | `Bruno Martins` · `bruno.seibert@labsit.io` · `brunomartins-labsit` |
| Frontend Architect & Stack | André Luiz Ferreira | `André Luiz Ferreira`, `Andre`, `Deh`, `dehlferreira` · `andre.ferreira@labsit.io`, `deh.lferreira@gmail.com` · `dehlferreira` |
| Product Planner | Kássio Sá | `Kássio Sá`, `Kassio` · `kassio@labsit.io` · `kassiosa` |

A comparação **ignora acentos e diferença de maiúsculas**, e vale para qualquer um dos sinais da linha — nome, e-mail ou usuário do GitHub. Por isso a coluna lista variantes: o nome configurado no Git de alguém não necessariamente é o nome completo.

Se nenhum sinal casar, o comando **pergunta** em vez de adivinhar. Nesse caso, a correção é acrescentar sua variante nesta tabela — ou ajustar o Git com `git config user.name "Seu Nome"`.

Para conferir a identidade configurada na sua máquina:

```bash
git config user.name && git config user.email
```

---

## Princípios da Divisão

Três regras orientaram como o trabalho foi distribuído. Elas valem para todas as frentes, igualmente:

1. **Dono único por documento.** Cada arquivo tem um responsável, registrado no mapa de donos abaixo e refletido no `.github/CODEOWNERS`. Isso evita edição simultânea do mesmo arquivo e torna claro a quem recorrer sobre cada assunto.

2. **Frentes desacopladas.** Cada frente é desenhada para avançar sem esperar as outras no dia a dia. Onde existe dependência real, ela está explicitada na sequência de trabalho — e não implícita. O objetivo é que ninguém fique bloqueado esperando decisão de outra pessoa, e que a agenda de cada um seja flexível.

3. **Suplência definida para toda frente.** Todo documento tem um suplente indicado. Prazos de treinamento são curtos e a disponibilidade de cada pessoa varia ao longo dele; ter suplência combinada de antemão é o que permite absorver variação sem renegociação no meio do caminho. É prática normal de engenharia, não sinal de desconfiança.

---

## Bruno Martins — Tech Lead, Integração & Qualidade

**Objetivo:** Manter a coerência da governança, centralizar a consolidação e a execução oficial dos agentes, conduzir o alinhamento técnico com a equipe de backend e definir os critérios de qualidade da entrega.

**Entregáveis:**
- Agentes **Tech Lead** e **QA & Reviewer** criados e operacionais.
- [CLAUDE.md](../CLAUDE.md) finalizado.
- [docs/quality.md](quality.md) preenchido.
- Contrato base de integração acordado com a equipe de backend e registrado.
- Execução oficial dos agentes da equipe.

**Responsabilidades:**
- Criar os agentes **Tech Lead** e **QA & Reviewer**.
- Finalizar o CLAUDE.md, mantendo-o livre de decisões técnicas (stack, arquitetura, convenções) — essas pertencem a André.
- Preencher `docs/quality.md`: critérios de aceite, Definition of Done técnica e checklist de revisão. **Teste automatizado é item obrigatório do DoD** (CLAUDE.md, seção 1.2) — é requisito de avaliação do exercício, não escolha da equipe.
- Coordenar a integração das decisões entre as frentes e resolver conflitos, registrando em ADR.
- Ser o **escritor único do STATUS.md** e o **executor oficial** dos agentes (ver seções abaixo).
- **Conduzir o alinhamento com a equipe de backend** sobre o contrato de integração. O conteúdo técnico do contrato é definido por André; Bruno leva, negocia e registra o acordo.
- Manter as issues do backlog no GitHub enquanto o agente Product Planner não estiver disponível, para que o fluxo da seção 9 do CLAUDE.md continue válido desde o início.
- Ser o ponto de escalonamento das Stop Conditions (CLAUDE.md, seção 6).

**Documentos:** [CLAUDE.md](../CLAUDE.md) · [STATUS.md](../STATUS.md) · [docs/quality.md](quality.md) · [docs/team-responsibilities.md](team-responsibilities.md) · `.github/PULL_REQUEST_TEMPLATE.md` e `.github/CODEOWNERS`

**Agentes a desenvolver:**
- `Tech Lead` — governança, coordenação entre frentes e guarda das regras de processo do CLAUDE.md.
- `QA & Reviewer` — critérios de aceite, revisão de qualidade técnica e verificação do Definition of Done.
- `Integração` — varre os repositórios de backend e mobile por perguntas direcionadas ao frontend, responde o que já está registrado citando a fonte, e **escala o resto para a pessoa certa** em vez de decidir. Protocolo em [integracao-protocolo.md](integracao-protocolo.md).

---

## André Luiz Ferreira — Frontend Architect & Stack

**Objetivo:** Definir a arquitetura das interfaces web, a stack e as convenções de código, e especificar tecnicamente o contrato de integração e a estratégia de mock.

**Entregáveis:**
- Agentes **Frontend Architect** e **Frontend Developer** criados e operacionais.
- [docs/architecture.md](architecture.md) preenchido.
- [docs/engineering-principles.md](engineering-principles.md) preenchido.
- ADR da decisão de stack.
- Especificação técnica do contrato de integração e da estratégia de mock, com ADR.

**Responsabilidades:**
- Criar os agentes **Frontend Architect** e **Frontend Developer**.
- Preencher `docs/architecture.md`: arquitetura das duas interfaces web (portal de upload do fornecedor e Portal de Acompanhamento do gestor — ver CLAUDE.md, seção 1.1), componentes, fluxo de dados e as fronteiras com backend e mobile.
- Preencher `docs/engineering-principles.md`: stack, bibliotecas, convenções de código, padrões de componentização, gerenciamento de estado, performance e acessibilidade.
- **Decidir a stack e registrar em ADR.** As tecnologias sugeridas no escopo (React/Next.js, AppSync/API Gateway, Cognito, CloudFront + S3) são sugestões, e a equipe tem liberdade explícita para divergir. Tanto adotar quanto divergir exige ADR com a justificativa.
- **Definir o conteúdo técnico do contrato de integração:** nomes e casing de campos, formato de datas, enums, paginação, envelope de resposta, formato de erro, autenticação, nulabilidade e tipo de ID — mais o **mecanismo de "status em tempo real"** (polling, subscription ou outro), que é o ponto mais acoplado ao backend. Essa lista é a pauta que Bruno leva ao alinhamento.
- **Definir a estratégia de mock:** como o contrato é especificado e de onde o mock deriva. Exige ADR.
- Criar ADRs para decisões de arquitetura ou stack amplas e dificilmente reversíveis, usando [docs/adr/TEMPLATE.md](adr/TEMPLATE.md).

**Documentos:** [docs/architecture.md](architecture.md) · [docs/engineering-principles.md](engineering-principles.md) · ADRs de arquitetura e stack

**Agentes a desenvolver:**
- `Frontend Architect` — estrutura das interfaces web, fronteiras, fluxo de dados, contrato de integração e trade-offs arquiteturais.
- `Frontend Developer` — stack, bibliotecas, convenções de código e boas práticas de implementação.

---

## Kássio Sá — Product Planner

**Objetivo:** Estruturar o processo de planejamento da equipe e transformar o roadmap de três fases do escopo em um backlog navegável no GitHub.

A frente tem **duas partes com naturezas diferentes**, e vale tratá-las como tal:

| Parte | Depende de | Issue |
|---|---|---|
| **Processo** — o agente e o `planning.md` | nada; pode começar já | [#4](https://github.com/labsitio/nexus-orc-web/issues/4) |
| **Backlog de implementação** — épicos e tasks das 3 fases | arquitetura, stack e o contrato com o backend | [#12](https://github.com/labsitio/nexus-orc-web/issues/12) |

**Entregáveis:**
- Agente **Product Planner** criado e operacional.
- [docs/planning.md](planning.md) preenchido.
- Backlog de implementação das três fases estruturado no GitHub.

**Responsabilidades:**
- Criar o agente **Product Planner**.
- Preencher `docs/planning.md`: processo de planejamento, critérios de quebra em épicos e tasks, priorização, gestão de dependências e fluxo do backlog no GitHub.
- Traduzir as três fases do roadmap em épicos e tasks com escopo e critérios de aceite.
- Reportar a Bruno o que precisa entrar no STATUS.md.

**Documentos:** [docs/planning.md](planning.md) · estrutura de épicos e issues no GitHub

**Agentes a desenvolver:**
- `Product Planner` — quebra de trabalho em épicos/tasks, priorização, dependências e organização do backlog no GitHub.

**Fronteiras na criação de tasks.** Três frentes tocam o mesmo artefato, então convém explicitar:

- O **Product Planner** decide **o que** será feito e em que ordem, e escreve o critério de aceite de cada task.
- O **Frontend Architect / Developer** decide **como** — componentes, rotas, estado — dentro de cada task. Não fatia o backlog.
- O **QA & Reviewer** define **o que conta como pronto**, no framework de `quality.md`, contra o qual o Planner escreve os critérios específicos.

**Sobre a autonomia desta frente.** A parte de **processo** é a mais autocontida da equipe: o insumo são os documentos em [`escopo/`](../escopo/), já disponíveis, e nada depende de decisão de Bruno ou de André. Na prática, **horário flexível** — pode ser feita em blocos, fora de sincronia com as outras frentes.

O **backlog de implementação** é diferente: é o portão da fase de código, porque pela seção 4 do CLAUDE.md nenhuma feature é implementada sem task. Mas ele vem naturalmente depois da arquitetura e da stack, então não é o primeiro item a travar. Enquanto não existir, Bruno mantém as issues manualmente, e a #12 tem gatilho de suplência explícito.

**O agente é o que dá continuidade.** Como a execução oficial é centralizada (ver [ADR-0002](adr/0002-execucao-centralizada-e-escritor-unico.md)), um agente Product Planner bem definido permite que o backlog seja gerado por quem estiver executando, sem depender de disponibilidade contínua de quem o escreveu. Por isso o agente da #4 importa mais que a operação manual do backlog: é ele que preserva a capacidade.

---

## Suplência e Continuidade

Toda frente tem suplente combinado desde o início, e o desenho assume que a disponibilidade das pessoas varia ao longo de um treinamento curto. Duas garantias práticas:

- **Nenhuma frente é caminho único.** Se uma entrega atrasar, o projeto continua: a governança define o mínimo necessário para o fluxo seguir válido (por exemplo, o backlog pode ser operado manualmente por Bruno antes de o agente Product Planner existir).
- **Suplência é combinada, não improvisada.** O mapa de donos abaixo registra o suplente de cada documento. Se um suplente precisar assumir, ele parte de um documento que já tem estrutura e orientação de preenchimento — não de uma folha em branco.

Vale registrar que **os próprios agentes são parte da resposta a variação de carga**: "uso de IA e agentes para acelerar o desenvolvimento" é critério de avaliação do exercício, e usar o agente Tech Lead para rascunhar uma frente descoberta é exatamente o comportamento que o treinamento pretende exercitar.

**Distribuição de carga.** Bruno concentra governança, qualidade, alinhamento externo e execução; André concentra arquitetura e stack, que é o caminho crítico. Ambas ficam com dois agentes. A sequência de trabalho no final deste documento prioriza justamente o que tem dependência externa e o que destrava as demais frentes, para que essa concentração não vire gargalo.

---

## Onde os Agentes Vivem

Convenção obrigatória, para que os agentes das três frentes sejam encontráveis e a execução centralizada funcione sem garimpo:

- **Local:** `.claude/agents/` na raiz do repositório. Um arquivo por agente.
- **Nome do arquivo:** kebab-case do nome do agente — `tech-lead.md`, `qa-reviewer.md`, `frontend-architect.md`, `frontend-developer.md`, `product-planner.md`.
- **Versionado no Git.** Os agentes são o entregável central do exercício, não configuração de máquina. Só o `.claude/settings.local.json` fica fora do versionamento, porque é específico de cada máquina.
- **Cada definição de agente deve declarar o próprio escopo** — quais documentos aquele agente pode alterar e a qual frente pertence. Isso é o que, no fim, torna o direcionamento por frente confiável sem depender de ninguém se identificar a cada sessão (ver CLAUDE.md, seção 3.1).

| Agente | Arquivo | Frente |
|---|---|---|
| Tech Lead | `.claude/agents/tech-lead.md` | Bruno |
| QA & Reviewer | `.claude/agents/qa-reviewer.md` | Bruno |
| Frontend Architect | `.claude/agents/frontend-architect.md` | André |
| Frontend Developer | `.claude/agents/frontend-developer.md` | André |
| Product Planner | `.claude/agents/product-planner.md` | Kássio |
| Integração | `.claude/agents/integracao.md` | Bruno |

---

## Mapa de Donos por Documento

Base do `.github/CODEOWNERS`: o GitHub passa a exigir a revisão do dono quando o arquivo dele é alterado, tornando a regra "nenhum agente altera o documento de outra frente sem coordenação" (CLAUDE.md, seção 3) uma restrição real e não apenas um acordo verbal.

| Arquivo | Dono | Suplente |
|---|---|---|
| `CLAUDE.md` | Bruno | André |
| `STATUS.md` | Bruno (escritor único) | André |
| `docs/quality.md` | Bruno | André |
| `docs/team-responsibilities.md` | Bruno | André |
| `docs/architecture.md` | André | Bruno |
| `docs/engineering-principles.md` | André | Bruno |
| `docs/planning.md` | Kássio | Bruno |
| `.github/` | Bruno | André |
| `docs/adr/` | quem propõe o ADR | revisão de Bruno |

---

## Escritor Único do STATUS.md — e como reportar

Apenas **Bruno** edita o [STATUS.md](../STATUS.md).

**Motivo:** é o único arquivo que todos atualizariam ao fim de cada sessão de trabalho. Arquivo único com múltiplos escritores simultâneos gera conflito de merge de forma recorrente. Escritor único elimina essa classe de conflito ao custo de uma pessoa consolidando.

### Ninguém abre issue nova para reportar status

Reportar status **não** cria artefato novo. Use o que já existe, conforme o caso:

| Situação | Onde reportar | Como Bruno fica sabendo |
|---|---|---|
| Terminei algo, ou minha mudança altera o estado do projeto | **Bloco "Para o STATUS.md" na descrição do Pull Request** | Ele revisa o PR de qualquer forma — é CODEOWNER |
| Estou bloqueado, tomei uma decisão, ou recebi informação externa relevante — **sem PR associado** | **Comentário na issue correspondente**, mencionando **@brunomartins-labsit** | A menção gera notificação |
| É urgente e afeta o prazo | Mensagem direta no grupo, **e** um dos dois acima | O canal informal não substitui o registro |

A menção explícita ao @brunomartins-labsit no comentário de issue **não é formalidade**: sem ela, o comentário pode passar batido em meio às notificações, e o STATUS fica desatualizado sem ninguém perceber.

### O que reportar

Não precisa de texto corrido. Quatro linhas, e só as que se aplicam:

```
Para o STATUS.md:
- Concluído: <o que ficou pronto>
- Bloqueado: <o que impede, e de quem/o quê depende>
- Decisão: <o que foi decidido — e se precisa de ADR>
- Risco novo: <o que pode dar errado, e por quê>
```

Os quatro campos mapeiam direto para as seções do STATUS.md, então a consolidação é transcrição, não interpretação. Escrever "avancei bastante hoje" obriga Bruno a adivinhar em qual seção isso entra — e ele vai perguntar.

### Cadência

Bruno consolida o STATUS.md **ao menos uma vez por dia**, não a cada report. Entre consolidações, a fonte da verdade é o PR ou a issue — que é onde o registro já está, com autor e data. O STATUS.md é o retrato consolidado, não o log em tempo real.

---

## Modelo de Execução dos Agentes

**Até 03/08 a execução é distribuída**, por decisão do [ADR-0003](adr/0003-execucao-distribuida-na-janela-de-entrega.md). Depois da entrega, volta a ser centralizada em Bruno, como decidido no [ADR-0002](adr/0002-execucao-centralizada-e-escritor-unico.md) — a centralização existe para que o resultado seja reproduzível e não varie conforme a máquina de origem.

- Cada pessoa **entrega** as definições dos seus agentes e as diretrizes da sua frente.
- **Até 03/08, cada integrante executa oficialmente os agentes da própria frente** ([ADR-0003](adr/0003-execucao-distribuida-na-janela-de-entrega.md)) — não é preciso aguardar Bruno. Em troca, todo PR gerado por agente declara **qual agente o gerou**. Depois da entrega, a centralização do ADR-0002 volta a valer.
- **Validação local é permitida e recomendada.** Cada autor pode e deve rodar o próprio agente na própria máquina para verificar que funciona, antes de entregar.

**Motivo da distinção entre validar e executar:** se nenhum agente fosse executado antes do final, todos chegariam à integração sem nunca ter rodado, e a primeira execução seria o momento de maior risco do projeto. Validar localmente e executar oficialmente são atividades diferentes, e ambas são necessárias — independentemente de a execução estar centralizada ou distribuída.

---

## Kickoff — Primeira Ação de Cada Pessoa

Cada pessoa começa com uma leitura curta e uma entrega pequena e independente, de modo que a primeira rodada aconteça em paralelo, sem espera.

**Leitura comum (~20 min):** [CLAUDE.md](../CLAUDE.md) seções 1 a 1.3 — escopo do produto e da equipe, critérios de avaliação e o aviso sobre os dois sentidos de "agente"; [STATUS.md](../STATUS.md); e os arquivos em [`escopo/`](../escopo/), no mínimo `briefing-projeto.html` e `apresentacao-time.html`.

**Briefing da própria frente — uma vez, na primeira sessão.** Abra o Claude Code na raiz do repositório e rode:

```
/minhas-tarefas
```

Não é preciso se apresentar: o comando lê a identidade do Git da sua máquina, cruza com a Tabela de Identidades no início deste documento e responde com sua frente, sua próxima ação, seus documentos, os agentes que você precisa criar e as tasks do STATUS.md que são suas. Perguntar em linguagem natural — "o que eu preciso fazer?" — tem o mesmo efeito.

**Antes de rodar, confirme que sua identidade no Git está configurada**, senão o comando não tem como te reconhecer e vai perguntar quem você é:

```bash
git config user.name && git config user.email
```

Se estiver vazio, configure apenas para este repositório:

```bash
git config user.name "Seu Nome" && git config user.email "seu.email@labsit.io"
```

Depois disso não é necessário repetir o briefing a cada sessão — o mapa de donos está no CLAUDE.md, que é carregado sempre (ver seção 3.1).

| | Primeira leitura | Primeira entrega |
|---|---|---|
| **Bruno** | `apresentacao-time.html` (componentes e stack) + `arquitetura-macro.html` | Abrir a conversa com a equipe de backend sobre o contrato, usando a tabela da seção 5 de `architecture.md` como pauta. É a entrega com maior tempo de espera externo — convém ser a primeira. |
| **André** | `apresentacao-time.html`, seções 01, 02 e 04 | ADR da decisão de stack: adotar a sugestão do escopo ou divergir, com justificativa. Sem necessidade de preencher os documentos inteiros ainda. |
| **Kássio** | `briefing-projeto.html` (roadmap das 3 fases) | O agente Product Planner e o `planning.md` ([#4](https://github.com/labsitio/nexus-orc-web/issues/4)) — não depende de ninguém. O backlog de implementação ([#12](https://github.com/labsitio/nexus-orc-web/issues/12)) vem depois da arquitetura. |

---

## Sequência Recomendada de Trabalho

1. **Bruno** abre o alinhamento do contrato com o backend — maior tempo de espera externo e o que menos depende de nós.
2. **André** decide e registra a stack, depois avança na arquitetura. É o caminho crítico: Bruno depende dessas decisões para escrever critérios de qualidade aplicáveis.
3. **Bruno** cria o template de PR e o CODEOWNERS — não depende de ninguém e pode ocorrer em paralelo.
4. **Bruno** preenche `quality.md` após a stack estar decidida, porque o critério de teste depende da ferramenta que a stack traz.
5. **Kássio** entrega o agente Product Planner e o `planning.md` em paralelo às demais frentes — não depende de ninguém.
6. **Kássio** estrutura o backlog de implementação depois que a stack e a arquitetura fecharem. Se não estiver em andamento nesse momento, Bruno assume, rodando o agente ou redigindo.
6. **Bruno** finaliza o CLAUDE.md e revisa a coerência entre os documentos antes de qualquer implementação ser autorizada.
7. **Bruno** conduz a execução oficial dos agentes.

Nenhuma feature do produto deve ser implementada antes da conclusão desta fase de preparação.
