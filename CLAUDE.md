# CLAUDE.md — Governança do Projeto Nexo

Este documento define **como** o projeto **Nexo** é conduzido: fluxo de trabalho, governança, planejamento e regras de colaboração entre a equipe (humana e agentes de IA).

Ele **não define**:
- Tecnologias, linguagens ou frameworks
- Stack de front-end, back-end, dados ou infraestrutura
- Princípios de engenharia ou convenções de código
- Arquitetura da solução

Essas decisões pertencem à equipe e devem ser registradas em [docs/architecture.md](docs/architecture.md), [docs/engineering-principles.md](docs/engineering-principles.md) e em ADRs (`docs/adr/`).

---

## 1. Objetivos do Projeto

> Preenchido a partir dos documentos de escopo recebidos, disponíveis em [`escopo/`](escopo/): `index.html`, `briefing-projeto.html`, `apresentacao-executiva.html`, `apresentacao-time.html` e `arquitetura-macro.html`. Esses arquivos são a fonte do escopo — este resumo não os substitui.

- **Nome do projeto:** Nexo

- **O que é:** plataforma de dados para redes varejistas, construída do zero e 100% nativa em AWS (serverless-first), que recebe orçamentos enviados por fornecedores e os processa automaticamente com agentes de IA sobre Amazon Bedrock — identificando fornecedor e formato, extraindo itens/preços/condições, validando consistência e indexando para busca semântica.

- **Problema a resolver:** o time de compras de uma rede varejista recebe centenas de orçamentos por mês, de dezenas de fornecedores, cada um em formato próprio (PDF, planilha, e-mail, formulário, catálogo) e por quatro canais distintos (portal web, API REST, SFTP e app mobile). Hoje isso depende de leitura e digitação manual, o que gera: ciclo de horas ou dias até o dado estar disponível, erro humano sob pressão de volume, rastreabilidade frágil (quem tratou, quando, em que etapa) e informação presa dentro do arquivo, difícil de recuperar e comparar.

- **Público / stakeholders:** gestores e times de compras de redes varejistas (usuários do Portal Web de Acompanhamento); fornecedores que enviam orçamentos (usuários dos canais de ingestão); áreas de auditoria e compliance (consumidoras dos relatórios).

- **Critérios de sucesso do projeto:** conforme os documentos de escopo — reduzir o tempo entre o recebimento do orçamento e o dado disponível de horas/dias para **minutos**; eliminar a triagem manual como etapa obrigatória do caminho principal; **rastreabilidade completa** de cada orçamento (origem, canal, etapa, agente responsável, decisão) disponível em tempo real e exportável para auditoria; e busca semântica sobre todo o acervo processado.
  > **Atenção:** os documentos de escopo não trazem metas numéricas verificáveis (ex: precisão mínima de extração, tempo-alvo em segundos, volume/mês). Definir esses números é pré-requisito para que Kássio escreva critérios de aceite que possam de fato ser verificados. Ver Bloqueios em [STATUS.md](STATUS.md).

---

### 1.1. Escopo desta equipe: frontend (portal web)

O Nexo é executado por **três equipes em paralelo**, uma por área, cada uma com seu próprio repositório na organização `labsitio`:

| Equipe | Repositório | Escopo |
|---|---|---|
| Backend | [nexus-orc-back](https://github.com/labsitio/nexus-orc-back) | Pipeline, agentes de IA do produto, APIs, dados |
| **Frontend (nós)** | **[nexus-orc-web](https://github.com/labsitio/nexus-orc-web)** | **Todas as interfaces web** |
| Mobile | [nexus-orc-mobile](https://github.com/labsitio/nexus-orc-mobile) | Aplicativo nativo de captura e envio |

Os resultados das três áreas são integrados no final.

A fatia desta equipe são as **interfaces web** do Nexo:

1. **Portal Web de Acompanhamento (Painel do Gestor)** — onde o gestor de compras acompanha o ciclo de vida completo de cada orçamento: canal de entrada, timestamp de cada etapa do pipeline (recebido → fornecedor/formato identificado → extraído → validado → indexado → disponível/arquivado), status em tempo real, alertas de erro e pendência, busca e filtros (período, fornecedor, faixa de preço) e exportação de relatórios de auditoria. Roadmap: **MVP na Fase 02, versão completa e multi-tenant na Fase 03**.
2. **Portal web de upload** — tela pela qual o fornecedor envia o orçamento manualmente, quando não tem integração automatizada. Roadmap: **Fase 01**.
   > **Ambas são desta equipe.** A divisão dos repositórios é por plataforma, não por feature: tudo que é web vive em `nexus-orc-web`. São, porém, dois produtos distintos dentro do mesmo repositório — públicos diferentes (fornecedor externo vs. gestor interno), fases diferentes (01 vs. 02/03) e provavelmente modelos de autenticação diferentes. Devem ser planejados e arquitetados como tal, não como "telas do mesmo sistema".

- **Fora de escopo desta equipe (pertence a backend ou mobile):** o pipeline de processamento e sua orquestração; os agentes de IA do produto; os canais de ingestão por API REST e SFTP; o aplicativo mobile nativo e suas notificações push; a modelagem de dados e a camada de busca; a infraestrutura e a observabilidade **do pipeline**; e a definição dos contratos de API — que consumimos, mas não definimos (ver `docs/architecture.md`, seções 4 e 5).

- **Dentro do escopo desta equipe, e fácil de esquecer:** o **build, o deploy e a hospedagem das interfaces web** (CloudFront + S3, conforme o escopo sugere) são entrega nossa. A infraestrutura que é do backend é a do pipeline, não a do nosso artefato. Como o entregável final é o projeto **rodando** (ver seção 1.2), publicar o frontend em ambiente acessível faz parte da definição de pronto — não é etapa opcional de infraestrutura.

---

### 1.2. Critérios de avaliação do exercício

O Nexo é conduzido como exercício pós-treinamento de Claude Code. Além dos objetivos de produto acima, os organizadores declararam o que esperam das equipes. **Essas expectativas funcionam como critérios de avaliação e devem ser tratadas como requisitos, não como recomendações:**

| Expectativa | Onde isso é endereçado neste projeto |
|---|---|
| Colaboração entre os times | Contrato base negociado com o backend no início (Bruno) — ver `docs/architecture.md`, seção 5 |
| Uso de IA e agentes para acelerar o desenvolvimento | Os 5 agentes de desenvolvimento de `docs/team-responsibilities.md`; execução centralizada |
| Arquitetura bem definida | `docs/architecture.md` + ADRs em `docs/adr/` |
| Código de qualidade | `docs/engineering-principles.md` (convenções) + `docs/quality.md` (checklist de revisão) |
| **Testes automatizados** | `docs/quality.md` — **requisito explícito**, não opcional. A Definition of Done precisa exigir teste automatizado. |
| Criatividade para resolver problemas reais | Liberdade de stack (ver abaixo) e decisões registradas em ADR |
| Aprendizado e troca de conhecimento | Governança documental: ADRs registram o *porquê*, não só o *quê* |

Três consequências diretas:

- **A equipe tem liberdade de stack.** As tecnologias sugeridas nos documentos de escopo (React/Next.js, AppSync/API Gateway, Cognito, CloudFront + S3) são **sugestões explícitas, não imposições** — a equipe pode alterá-las conforme julgar melhor. Mas *escolher* continua sendo decisão estrutural: seja adotando a sugestão, seja divergindo dela, a escolha precisa de ADR com a justificativa. Liberdade não dispensa registro.
- **O exercício produz código, não apenas documentação.** "Código de qualidade" e "testes automatizados" só são avaliáveis sobre software que existe. As pessoas não escrevem esse código — os agentes escrevem, orientados pelos documentos desta pasta. Governança fraca aqui aparece como código ruim lá.
- **O entregável final é o projeto rodando.** Ver a seção 1.2.1 abaixo. Este é o ponto que mais muda prioridades, e o que mais se perde de vista num exercício.

---

### 1.2.1. O Nexo é um projeto real, e o entregável é software em funcionamento

Os organizadores têm **utilização prevista** para o Nexo. O exercício é praticar o desenvolvimento assistido por agentes, mas o resultado esperado ao final é **o projeto inteiro funcionando** — não um conjunto de documentos, especificações e agentes bem escritos.

Isso reordena as prioridades de forma concreta:

| Consequência | O que muda na prática |
|---|---|
| **Software tem que executar** | Build funcionando, aplicação acessível, fluxo principal navegável de ponta a ponta. Documento bem escrito não substitui tela que abre. |
| **Deploy é parte da entrega** | Publicar as interfaces web em ambiente acessível é escopo desta equipe (ver seção 1.1), não etapa posterior de terceiros. |
| **Mock é ponte, não destino** | A estratégia de mock existe para o frontend não ficar bloqueado pelo backend. Mas se a entrega final precisa funcionar de verdade, precisa haver **plano e data de troca do mock pela API real**, não apenas o mock. |
| **Integração deixa de ser opcional** | As três equipes integram no final por necessidade, não por formalidade. Um frontend que só funciona contra mock não é entrega. |
| **Dados de demonstração importam** | Um sistema vazio não é demonstrável. Precisa existir dado suficiente para o fluxo principal ser mostrado. |
| **Escopo precisa caber** | O roadmap tem três fases. Entregar as três funcionando é improvável no prazo de um treinamento — **qual fase é esperada ao final é pergunta para os organizadores**, e a resposta define o que sequer entra no backlog. |

**Risco central que isso cria:** o repositório do backend está em **fase de especificação, sem implementação**. Se a nossa entrega precisa funcionar integrada, dependemos de código que ainda não existe do outro lado. Isso é acompanhado como risco em [STATUS.md](STATUS.md) e é assunto obrigatório do alinhamento com o backend.

**Definition of Done no nível do projeto** — soma-se à da seção 5, que é por task:

- [ ] A aplicação **builda** sem erro a partir do repositório limpo.
- [ ] A suíte de testes automatizados passa.
- [ ] A aplicação está **publicada em ambiente acessível**, com URL registrada no README.
- [ ] O fluxo principal é **navegável de ponta a ponta** por quem não desenvolveu.
- [ ] A integração com o backend real está funcionando, **ou** a limitação está declarada explicitamente, com o que falta e de quem depende.
- [ ] Existe dado suficiente para demonstrar o fluxo.
- [ ] O README explica como rodar localmente, em passos que funcionam numa máquina limpa.

---

### 1.3. Aviso de vocabulário: dois sentidos de "agente"

O projeto usa a palavra **agente** para duas coisas completamente diferentes, e confundi-las gera erro grave de escopo:

| Termo | O que é | De quem é |
|---|---|---|
| **Agentes de IA do Nexo** (5) | Classificador de Fornecedor e Formato, Extrator de Dados, Validador de Consistência, Indexação e Busca Semântica, Orquestrador de Workflow. Rodam sobre **Amazon Bedrock** e são **funcionalidade do produto**. | Equipe de **backend** |
| **Agentes de desenvolvimento** (5) | Tech Lead, Frontend Architect, Frontend Developer, QA & Reviewer, Product Planner. Rodam no **Claude Code** e são a **ferramenta de trabalho desta equipe**. | Esta equipe (ver [docs/team-responsibilities.md](docs/team-responsibilities.md)) |

Coincidência infeliz: são cinco de cada lado. Sempre qualificar qual dos dois está em discussão.

---

## 2. Fluxo de Trabalho

O projeto é conduzido por uma equipe de agentes de IA especializados, cada um responsável por uma frente de trabalho, coordenados por um agente **Tech Lead**. O fluxo geral é:

1. **Planejamento** — toda mudança relevante nasce de uma task rastreável no backlog (GitHub, ver seção 9), com escopo, critérios de aceite e responsável definidos antes de qualquer implementação.
2. **Decisão** — decisões estruturais (arquitetura, stack, convenções, critérios de qualidade) são registradas como ADR antes de serem implementadas.
3. **Implementação** — só ocorre depois que a task está clara, o escopo está definido e (quando aplicável) o ADR correspondente foi aceito. O caminho de issue até Pull Request é padronizado pelo comando **`/implementar <número da issue>`** (definido em `.claude/commands/implementar.md`): ele carrega as convenções, exige plano antes do código, obriga teste automatizado e preenche o template de PR. Usar o comando em vez de improvisar é o que mantém a implementação consistente entre pessoas e entre sessões.
4. **Revisão** — toda entrega passa pelo agente QA & Reviewer contra os critérios definidos em [docs/quality.md](docs/quality.md) antes de ser considerada concluída.

   **Nunca commite direto na `main`.** Todo trabalho vai em branch e entra por Pull Request — é o PR que dá lugar físico à revisão. Sem ele, esta etapa 4 não tem onde acontecer.

   Convenção de nome de branch, para o histórico ficar legível com três pessoas e agentes trabalhando em paralelo:

   ```
   <tipo>/<nº da issue>-<descrição-curta>
   ```

   `tipo` é um de `feat`, `fix`, `docs`, `chore` ou `test`. Exemplos: `feat/17-formulario-upload`, `docs/2-adr-stack`, `test/19-cobertura-upload`.

   O comando `/implementar` cria a branch com essa convenção automaticamente. Fora dele, é manual — e há duas travas: a proteção da branch no GitHub, que exige `admin` no repositório, e o hook `pre-push` versionado em `.githooks/`, que funciona sem permissão alguma e é ativado com `git config core.hooksPath .githooks`. Ver o README.
5. **Atualização de estado** — ao final de qualquer sessão de trabalho relevante, o [STATUS.md](STATUS.md) é atualizado (ver seção 8).

Nenhuma etapa deve ser pulada para "economizar tempo". Se uma etapa não se aplica (ex: mudança trivial sem impacto arquitetural), isso deve ser justificado explicitamente, não simplesmente omitido.

---

## 3. Governança

- **Tech Lead** é o guardião deste documento e da coerência entre as demais frentes. Qualquer alteração neste CLAUDE.md deve ser proposta e revisada por ele.
- Cada frente de trabalho (arquitetura, front-end/stack, qualidade, planejamento) tem um documento vivo correspondente em `docs/`. Esses documentos são a fonte da verdade da respectiva frente — não o conhecimento implícito de quem escreveu.
- A divisão de responsabilidades entre as frentes — quem é dono de qual documento e qual agente cada integrante deve criar — está registrada em [docs/team-responsibilities.md](docs/team-responsibilities.md).
- Decisões que alteram significativamente arquitetura, stack, processo ou critérios de qualidade **exigem um ADR**, mesmo que o autor tenha certeza da decisão.
- Conflitos entre frentes (ex: arquitetura vs. stack proposta) são resolvidos pelo Tech Lead, com a decisão registrada em ADR.
- Nenhum agente deve alterar o documento de outra frente sem coordenação explícita do Tech Lead.

### 3.1. Identificação do integrante e escopo de atuação

Cada integrante trabalha na sua própria máquina, com sua própria sessão do Claude Code. Duas coisas garantem que o escopo de cada um seja respeitado sem custo recorrente de contexto:

**1. Identificação automática pela identidade do Git.** O integrante não precisa se apresentar. Basta rodar:

```
/minhas-tarefas
```

O comando (definido em `.claude/commands/minhas-tarefas.md`, versionado no repositório) lê o `git config user.name` da máquina, cruza com a **Tabela de Identidades** de [docs/team-responsibilities.md](docs/team-responsibilities.md) e responde com a frente, a próxima ação concreta, os documentos de que a pessoa é dona, os agentes que precisa criar e as tasks do STATUS.md que são dela.

A mesma coisa funciona em linguagem natural — **"o que eu preciso fazer?"**, "quais são minhas responsabilidades?" ou equivalente. Nesse caso, o assistente deve seguir o mesmo procedimento: ler a identidade do Git, cruzar com a Tabela de Identidades e responder. **Não presumir a frente por eliminação**: se a identidade não casar com nenhuma linha da tabela, mostrar o que foi encontrado e perguntar.

É uma leitura de onboarding e não precisa ser repetida a cada sessão — entendido o escopo, a pessoa atua a partir dele, sem gasto recorrente de tokens e contexto.

**2. O mapa de donos vive neste arquivo.** Como o CLAUDE.md é carregado em toda sessão, a tabela abaixo está sempre disponível, sem custo adicional e sem depender de abrir outros documentos. A partir dela, o assistente deve:

- Restringir as alterações aos documentos da frente em que está atuando.
- Ao receber um pedido que toque documento de outra frente, **não executar silenciosamente**: avisar de quem é o documento e sugerir encaminhar ao dono ou ao Tech Lead. Se a pessoa for a **suplente** daquele documento e confirmar que está assumindo, pode prosseguir — registrando o motivo no PR.

| Frente | Documentos de que é dona |
|---|---|
| **Bruno** — Tech Lead, Integração & Qualidade | `CLAUDE.md`, `STATUS.md`, `docs/quality.md`, `docs/team-responsibilities.md`, `.github/` |
| **André** — Frontend Architect & Stack | `docs/architecture.md`, `docs/engineering-principles.md` |
| **Kássio** — Product Planner | `docs/planning.md` |
| Qualquer frente | `docs/adr/` — quem propõe o ADR o escreve; revisão de Bruno |

**Quando a frente não estiver clara** e o pedido implicar alterar um documento com dono definido, o assistente pergunta antes — em vez de assumir. É uma pergunta curta e pontual, não uma rotina de abertura.

Três ressalvas honestas sobre o alcance desta regra:

- É **instrução, não trava**. Ela funciona porque este arquivo é carregado em toda sessão, mas pode ser contornada por quem insistir. A trava real é o `.github/CODEOWNERS`, que atua no momento do Pull Request.
- **A pessoa retém o briefing entre sessões; o assistente não.** Cada sessão nova começa sem histórico da anterior. Isso não afeta a produtividade de quem já conhece o próprio escopo — apenas significa que a checagem de escopo se apoia na tabela acima, e não em memória de conversa.
- Quando os agentes de desenvolvimento existirem, **eles passam a ser o mecanismo principal**: cada agente carrega o escopo da sua frente na própria definição. Invocar o agente certo é mais confiável e mais barato que declarar quem se é, porque não depende de ninguém lembrar.

---

## 4. Fluxo de Planejamento

Filosofia central: **planejar antes de implementar.** Nenhuma funcionalidade é implementada sem que exista, previamente:

1. Uma task no backlog do GitHub descrevendo o que precisa ser feito e por quê.
2. Escopo e critérios de aceite claros (definidos pelo Product Planner, revisados pelo Tech Lead).
3. Dependências e riscos identificados.
4. Quando a task envolve decisão estrutural (arquitetura, stack, processo): um ADR correspondente, aceito antes da implementação começar.

O planejamento é responsabilidade do agente **Product Planner**, mas todo agente que identificar necessidade de trabalho não planejado deve **abrir uma task**, não implementar diretamente.

---

## 5. Definition of Done

Uma task só é considerada concluída quando, no mínimo:

- [ ] O escopo definido na task foi integralmente atendido (ou o desvio foi documentado e aprovado).
- [ ] Os critérios de aceite (ver [docs/quality.md](docs/quality.md)) foram verificados.
- [ ] Decisões estruturais tomadas durante o trabalho foram registradas em ADR.
- [ ] O código/artefato passou pela revisão do agente QA & Reviewer.
- [ ] O [STATUS.md](STATUS.md) foi atualizado refletindo a conclusão.
- [ ] A task no GitHub foi atualizada/fechada com um resumo do que foi entregue.

Critérios adicionais específicos de qualidade técnica serão definidos pela equipe em [docs/quality.md](docs/quality.md) e se somam a este checklist, nunca o substituem.

---

## 6. Stop Conditions

Um agente deve **parar e escalar para o Tech Lead (ou para o humano responsável)** antes de prosseguir quando:

- A task não tiver escopo ou critérios de aceite claros.
- A implementação exigir uma decisão de arquitetura, stack ou processo que ainda não foi registrada em ADR.
- Houver conflito entre o que está documentado em `docs/` e o que está sendo pedido.
- A mudança afetar múltiplas frentes de trabalho sem coordenação prévia.
- For necessário contornar (bypass) uma regra de qualidade, revisão ou governança definida neste documento.
- Informação necessária para decidir não estiver disponível (ambiguidade real, não falta de busca).

Nessas situações, o agente documenta o bloqueio em STATUS.md (seção "Bloqueios") em vez de assumir uma decisão em nome da equipe.

---

## 7. Regras para ADRs

- Toda decisão **estrutural e dificilmente reversível** (arquitetura, stack, convenções amplas, processo de qualidade, processo de planejamento) deve virar um ADR.
- Decisões triviais, reversíveis ou de escopo muito local **não** precisam de ADR — mas na dúvida, prefira registrar.
- Todo ADR usa o template em [docs/adr/TEMPLATE.md](docs/adr/TEMPLATE.md) e é numerado sequencialmente (`docs/adr/0001-titulo.md`, `0002-...`, etc).
- Um ADR aceito não é apagado quando torna-se obsoleto — é marcado como **Superseded** e referencia o ADR que o substitui.
- Nenhuma implementação que contradiga um ADR aceito deve prosseguir sem antes propor um novo ADR que o revise ou supere.
- ADRs recentes devem ser referenciados em STATUS.md.

---

## 8. Atualização de STATUS

O [STATUS.md](STATUS.md) é o retrato do estado atual do projeto e deve ser atualizado:

- Ao final de qualquer sessão de trabalho que altere feature atual, task atual, bloqueios ou riscos.
- Sempre que um ADR novo for aceito.
- Sempre que uma task for concluída ou uma nova task for iniciada.

Regras:
- STATUS.md reflete o **presente**, não o histórico — histórico detalhado vive no GitHub (issues, PRs, commits).
- Nunca deixar STATUS.md desatualizado ao encerrar uma sessão de trabalho relevante.
- Se não há nada novo a registrar, ainda assim atualizar o campo "última atualização".

---

## 9. Utilização do GitHub via MCP como Backlog Oficial

- O **GitHub é a fonte oficial do backlog** deste projeto (issues, milestones, projects, pull requests).
- Toda task de trabalho relevante deve existir como issue no GitHub antes de ser iniciada.
- O acesso ao GitHub deve ocorrer via MCP configurado para este projeto — não decisões de backlog fora dele (ex: listas soltas em chat, documentos paralelos).
- STATUS.md e ADRs **referenciam** issues/PRs do GitHub (por número/link), mas não os substituem.
- Cabe ao agente **Product Planner** manter o backlog organizado: épicos, tasks, prioridades e dependências (ver [docs/planning.md](docs/planning.md)).

---

## 10. Filosofia de Planejamento Antes da Implementação

> "Planejar não é burocracia — é a forma de garantir que o trabalho de implementação, uma vez iniciado, não precise ser refeito."

- Nenhum agente implementa uma feature "porque parece óbvia". Se parece óbvia, é rápido registrá-la como task e ADR (se aplicável) antes de começar.
- Ambiguidade é resolvida **antes** da implementação, não durante — e nunca depois, silenciosamente.
- Mudanças de escopo durante a implementação exigem atualização da task correspondente no GitHub, não apenas do código.
- Um plano ruim documentado é mais valioso que um plano bom que existe apenas na cabeça de quem implementou.

---

## 11. Autoalimentação Através de ADRs e STATUS

Este projeto é projetado para que **o próprio processo de trabalho alimente a documentação que orienta o próximo passo**:

- Toda decisão relevante vira ADR → ADRs recentes aparecem em STATUS.md → STATUS.md informa a próxima task planejada → a próxima task planejada, ao ser executada, pode gerar novos ADRs.
- Isso cria um ciclo fechado: **decisão → registro → estado → planejamento → nova decisão**.
- Nenhum agente (ou humano) deve depender de memória de conversa ou contexto implícito para saber o estado do projeto — tudo deve estar em STATUS.md, ADRs e no backlog do GitHub.
- Se um agente notar que STATUS.md, ADRs ou docs/ estão desalinhados com a realidade do projeto, isso é, por si só, motivo para uma correção antes de prosseguir com qualquer outra tarefa.

---

## 12. Checklist Antes de Responder Qualquer Solicitação

Antes de iniciar qualquer trabalho, todo agente (independente da frente) deve verificar:

- [ ] Li o [STATUS.md](STATUS.md) atual para entender o estado presente do projeto?
- [ ] Existe uma task correspondente no backlog do GitHub? Se não, ela precisa ser criada antes de prosseguir?
- [ ] O escopo e os critérios de aceite desta solicitação estão claros?
- [ ] Esta solicitação envolve uma decisão estrutural que deveria virar ADR?
- [ ] Existe algum ADR existente que já decide (ou restringe) este assunto?
- [ ] A frente de trabalho desta sessão foi declarada (ver seção 3.1)? Esta solicitação é responsabilidade dela, ou deveria ser encaminhada ao dono do documento / à coordenação do Tech Lead?
- [ ] Alguma Stop Condition (seção 6) se aplica aqui?
- [ ] Ao final do trabalho, o que precisa ser atualizado em STATUS.md e/ou no GitHub?

Se qualquer resposta acima for "não sei" ou "não está claro", isso é motivo para pausar e esclarecer antes de agir — não para assumir e seguir em frente.
