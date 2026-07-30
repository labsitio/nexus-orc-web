# Divisão de Responsabilidades da Equipe — Projeto Nexo

> Este documento define **quem faz o quê** na equipe de frontend (repositório [nexus-orc-web](https://github.com/labsitio/nexus-orc-web)) do projeto Nexo. Nenhum agente listado aqui foi criado ainda — cada pessoa é responsável por criar os agentes da sua frente e preencher os documentos sob sua responsabilidade.

A equipe tem **3 integrantes**, dos quais **2 com participação ativa confirmada**, e produz **5 agentes de desenvolvimento**. Esses números são diferentes de propósito: a quantidade de agentes é definida pelo trabalho que precisa ser feito, não pelo tamanho do time — e a criação de agentes é o objetivo central do treinamento, então todos os integrantes recebem pelo menos um.

**Premissa de planejamento:** a Pessoa 3 tem participação incerta e **pode não entregar nada**. O trabalho foi distribuído de modo que a ausência dela **não bloqueie** o projeto. Qualquer entrega dela é ganho, não dependência. Ver "Plano de contingência" abaixo.

Referência de fluxo geral: [CLAUDE.md](../CLAUDE.md).

---

## Pessoa 1 — Tech Lead, Integração & Qualidade

> Participação ativa. Frente mais ampla, porque concentra o que não pode faltar.

**Objetivo:** Garantir a coerência da governança, ser o ponto único de consolidação e de execução oficial, negociar o contrato base com o backend e assegurar os critérios de qualidade — inclusive testes automatizados, que são requisito de avaliação do exercício.

**Entregáveis:**
- Agentes **Tech Lead** e **QA & Reviewer** criados e operacionais.
- [CLAUDE.md](../CLAUDE.md) finalizado.
- [docs/quality.md](quality.md) preenchido.
- Contrato base de integração **acordado com a equipe de backend** e registrado.
- Execução oficial dos agentes da equipe.

**Responsabilidades:**
- Criar os agentes **Tech Lead** e **QA & Reviewer**.
- Finalizar o CLAUDE.md, mantendo-o livre de decisões técnicas (stack, arquitetura, convenções) — essas pertencem à Pessoa 2.
- Preencher `docs/quality.md`: critérios de aceite, Definition of Done técnica e checklist de revisão. **Teste automatizado é item obrigatório do DoD** (CLAUDE.md, seção 1.2) — não é decisão da equipe.
- Coordenar a integração das decisões entre as frentes e resolver conflitos, registrando em ADR.
- Ser o **escritor único do STATUS.md**.
- Ser o **executor oficial** dos agentes.
- **Negociar o contrato base com a equipe de backend** — conduzir a conversa e fechar o acordo. O *conteúdo técnico* do contrato é definido pela Pessoa 2; a Pessoa 1 é dona da negociação e do relacionamento entre equipes.
- **Operar o backlog no interim:** enquanto o agente Product Planner não existir, abrir e manter as issues no GitHub manualmente, para não violar a seção 9 do CLAUDE.md.
- Ser o ponto de escalonamento das Stop Conditions (CLAUDE.md, seção 6).

**Documentos que deverá criar/manter:**
- [CLAUDE.md](../CLAUDE.md) — dono
- [STATUS.md](../STATUS.md) — escritor único
- [docs/quality.md](quality.md)
- [docs/team-responsibilities.md](team-responsibilities.md) — manutenção
- `.github/PULL_REQUEST_TEMPLATE.md` e `.github/CODEOWNERS`

**Agentes a desenvolver:**
- `Tech Lead` — governança, coordenação entre frentes e guarda das regras de processo do CLAUDE.md.
- `QA & Reviewer` — critérios de aceite, revisão de qualidade técnica e verificação do Definition of Done.

---

## Pessoa 2 — Frontend Architect & Stack

> Participação ativa. Caminho crítico do projeto.

**Objetivo:** Definir a arquitetura das interfaces web, a stack, as bibliotecas e as convenções de código — e especificar tecnicamente o contrato de integração e a estratégia de mock.

**Entregáveis:**
- Agentes **Frontend Architect** e **Frontend Developer** criados e operacionais.
- [docs/architecture.md](architecture.md) preenchido.
- [docs/engineering-principles.md](engineering-principles.md) preenchido.
- ADR da decisão de stack.
- Especificação técnica do contrato de integração + estratégia de mock, com ADR.

**Responsabilidades:**
- Criar os agentes **Frontend Architect** e **Frontend Developer**.
- Preencher `docs/architecture.md`: arquitetura das duas interfaces web (portal de upload do fornecedor e Portal de Acompanhamento do gestor — ver CLAUDE.md, seção 1.1), componentes, fluxo de dados e **as fronteiras com backend e mobile**.
- Preencher `docs/engineering-principles.md`: stack, bibliotecas, convenções de código, padrões de componentização, gerenciamento de estado, performance e acessibilidade.
- **Decidir a stack e registrar em ADR.** As tecnologias sugeridas no escopo (React/Next.js, AppSync/API Gateway, Cognito, CloudFront + S3) são sugestões, não imposições — a equipe tem liberdade para divergir. Mas adotar *ou* divergir exige ADR com justificativa.
- **Definir o conteúdo técnico do contrato de integração**: nomes e casing de campos, formato de datas, enums, paginação, envelope de resposta, formato de erro, autenticação, nulabilidade e tipo de ID — mais **o mecanismo de "status em tempo real"** (polling, subscription ou outro), que é o item mais acoplado ao backend. Essa lista é o que a Pessoa 1 leva para acordar.
- **Definir a estratégia de mock** — como o contrato é especificado e de onde o mock deriva. Exige ADR.
- Criar ADRs para toda decisão de arquitetura ou stack ampla e dificilmente reversível, usando [docs/adr/TEMPLATE.md](adr/TEMPLATE.md).

**Documentos que deverá criar/manter:**
- [docs/architecture.md](architecture.md)
- [docs/engineering-principles.md](engineering-principles.md)
- ADRs de arquitetura e stack em `docs/adr/`

**Agentes a desenvolver:**
- `Frontend Architect` — estrutura das interfaces web, fronteiras, fluxo de dados, contrato de integração e trade-offs arquiteturais.
- `Frontend Developer` — stack, bibliotecas, convenções de código e boas práticas de implementação.

---

## Pessoa 3 — Product Planner

> **Participação incerta.** Recebeu a frente escolhida deliberadamente por ser a mais isolada e a que menos bloqueia as demais, para que a criação do agente — objetivo central do treinamento — continue possível sem colocar o projeto em risco.

**Objetivo:** Estruturar o processo de planejamento e o backlog do time no GitHub.

**Entregáveis:**
- Agente **Product Planner** criado e operacional.
- [docs/planning.md](planning.md) preenchido.
- Backlog estruturado no GitHub (épicos e tasks das três fases do roadmap).

**Responsabilidades:**
- Criar o agente **Product Planner**.
- Preencher `docs/planning.md`: processo de planejamento, quebra em épicos e tasks, priorização, gestão de dependências e fluxo do backlog no GitHub.
- Estruturar o backlog a partir das três fases do roadmap descritas nos documentos de escopo.
- Reportar à Pessoa 1 o que precisa entrar no STATUS.md (não editar o arquivo diretamente).

**Documentos que deverá criar/manter:**
- [docs/planning.md](planning.md)
- Estrutura de épicos/issues no GitHub

**Agentes a desenvolver:**
- `Product Planner` — quebra de trabalho em épicos/tasks, priorização, dependências e organização do backlog no GitHub.

**Por que esta frente e não outra:** é a mais autocontida das cinco (depende dos documentos de escopo, que já existem, e não de decisões das outras pessoas), o que maximiza a chance de ser concluída em isolamento. E é a única cuja ausência a Pessoa 1 consegue cobrir operacionalmente sem comprometer critério de avaliação — diferente de qualidade, onde "testes automatizados" é requisito explícito dos organizadores, e de arquitetura, que destrava todo o resto.

---

## Plano de Contingência

O projeto é planejado assumindo **contribuição zero da Pessoa 3**. Regras:

- **Nada no caminho crítico depende dela.** Se `docs/planning.md` e o agente Product Planner não existirem, o projeto continua: a Pessoa 1 abre e mantém as issues no GitHub manualmente, satisfazendo a seção 9 do CLAUDE.md sem o agente.
- **Ponto de corte explícito.** A Pessoa 1 define uma data a partir da qual assume a frente de planejamento. Sem data definida, a ausência vira descoberta tardia — que é o pior cenário.
- **Se a Pessoa 3 aparecer no meio, ela ainda tem o que fazer.** A frente não é "reservada e vazia": mesmo com o backlog já operando manualmente, criar o agente Product Planner e formalizar `planning.md` continua sendo entrega real.
- **Use os agentes para cobrir a lacuna.** "Uso de IA e agentes para acelerar o desenvolvimento" é critério de avaliação do exercício. A Pessoa 1 pode usar o agente Tech Lead para rascunhar o que falta, em vez de absorver tudo manualmente — isso é exatamente o comportamento que o treinamento quer demonstrar.

**Carga real com 2 pessoas ativas:** a Pessoa 1 acumula governança, qualidade, negociação externa e execução; a Pessoa 2 acumula arquitetura e stack. Ambas ficam com 2 agentes. É apertado e não há folga — motivo pelo qual a sequência de trabalho abaixo prioriza o que tem dependência externa e o que destrava as outras frentes.

---

## Mapa de Donos por Documento

Este mapa é a base do `.github/CODEOWNERS`: o GitHub passa a exigir a revisão do dono quando o arquivo dele é tocado, transformando a regra "nenhum agente altera o documento de outra frente sem coordenação" (CLAUDE.md, seção 3) em restrição real.

| Arquivo | Dono | Suplente |
|---|---|---|
| `CLAUDE.md` | Pessoa 1 | — |
| `STATUS.md` | Pessoa 1 (escritor único) | — |
| `docs/quality.md` | Pessoa 1 | — |
| `docs/team-responsibilities.md` | Pessoa 1 | — |
| `docs/architecture.md` | Pessoa 2 | Pessoa 1 |
| `docs/engineering-principles.md` | Pessoa 2 | Pessoa 1 |
| `docs/planning.md` | Pessoa 3 | **Pessoa 1 (contingência)** |
| `.github/` | Pessoa 1 | — |
| `docs/adr/` | quem propõe o ADR | revisão obrigatória da Pessoa 1 |

---

## Escritor Único do STATUS.md

Apenas a **Pessoa 1** edita o [STATUS.md](../STATUS.md). As Pessoas 2 e 3 reportam o que precisa ser registrado (na descrição do PR ou na issue) e a Pessoa 1 consolida.

**Motivo:** o STATUS.md é o único arquivo que todos atualizariam ao fim de cada sessão de trabalho. Arquivo único + múltiplos escritores simultâneos = merge conflict garantido, toda vez. Escritor único elimina a classe inteira de conflito ao custo de uma pessoa.

---

## Modelo de Execução dos Agentes

A execução é **centralizada**, para evitar que cada integrante rode os agentes na própria máquina e o resultado divirja.

- Cada pessoa **entrega** as definições dos seus agentes e as diretrizes da sua frente.
- **Apenas a Pessoa 1** solicita a criação e a execução oficial dos agentes — a execução que gera o resultado entregue.
- **Validação local é permitida e recomendada.** Cada autor pode e deve rodar o próprio agente na própria máquina para verificar que ele funciona, antes de entregar.

**Motivo da distinção:** centralizar a execução oficial evita divergência de resultado. Mas se ninguém executasse nada antes do final, os agentes chegariam ao dia da integração nunca tendo rodado, e a primeira execução seria o momento de maior risco do projeto. Validar localmente e executar oficialmente são atividades diferentes.

---

## Kickoff — Primeira Ação de Cada Pessoa

Recorte prático para distribuir no início. Cada pessoa começa **lendo** e entrega **um artefato pequeno**, para que ninguém fique esperando decisão de outro na primeira rodada.

**Leitura comum a todos, antes de qualquer coisa (~20 min):** [CLAUDE.md](../CLAUDE.md) seções 1 a 1.3 (escopo, critérios de avaliação e o aviso dos dois sentidos de "agente"), [STATUS.md](../STATUS.md) e os arquivos em [`escopo/`](../escopo/) — no mínimo `briefing-projeto.html` e `apresentacao-time.html`.

| | Primeira leitura | Primeira entrega |
|---|---|---|
| **Pessoa 1** | `apresentacao-time.html` (componentes e stack) + `arquitetura-macro.html` | Mensagem ao time de backend abrindo a conversa do contrato, com a tabela da seção 5 de `architecture.md` como pauta. **É a única entrega com dependência externa — faça primeiro.** |
| **Pessoa 2** | `apresentacao-time.html`, seções 01, 02 e 04 | ADR da decisão de stack: adotar a sugestão do escopo ou divergir, com justificativa. Ainda sem preencher os documentos inteiros. |
| **Pessoa 3** | `briefing-projeto.html` (roadmap das 3 fases) | Épicos das três fases abertos como issues no GitHub. Se não houver retorno até o ponto de corte, a Pessoa 1 assume. |

---

## Sequência Recomendada de Trabalho

1. **Pessoa 1** abre a negociação do contrato base com o backend **imediatamente** — é o item com maior tempo de espera externo e o que menos depende de nós. Começar tarde aqui atrasa todo o resto.
2. **Pessoa 2** decide e registra a stack, depois define arquitetura. É o caminho crítico: a Pessoa 1 depende dessas decisões para escrever critérios de qualidade que façam sentido.
3. **Pessoa 1** cria o template de PR e o CODEOWNERS — não depende de ninguém e pode ser feito em paralelo.
4. **Pessoa 1** preenche `quality.md` depois que a stack estiver decidida, porque critério de teste depende de qual ferramenta de teste a stack traz.
5. **Pessoa 3** (ou Pessoa 1, em contingência) estrutura o backlog a partir do roadmap.
6. **Pessoa 1** finaliza o CLAUDE.md e revisa a integração entre os documentos antes de qualquer implementação ser autorizada.
7. **Pessoa 1** conduz a execução oficial dos agentes.

Nenhuma feature do produto deve ser implementada antes da conclusão desta fase de preparação.
