# ADR-0003: Execução distribuída dos agentes na janela até a entrega

## Status

**Aceito** em 2026-07-30 por Bruno Martins (Tech Lead), **com emenda em 2026-07-31**.

> Emenda o [ADR-0002](0002-execucao-centralizada-e-escritor-unico.md), suspendendo a decisão 1 (execução oficial centralizada) durante a janela até 03/08. A decisão 2 daquele ADR — escritor único do STATUS.md — **permanece em vigor**.

### Emenda de 2026-07-31 — a execução volta a ser concentrada, por escolha de quem estava liberado

A atribuição nominal registrada na decisão abaixo ("André executa Frontend Architect e Frontend Developer; Kássio executa Product Planner") **deixa de valer como obrigação**. Bruno passa a executar os agentes de todas as frentes na própria máquina, com **duas exceções**: `frontend-architect` e `frontend-developer` continuam sendo executados por André, conforme a seção 2 de `docs/quality.md`, que exige que quem entrega uma definição de agente a tenha executado — o critério de aceite da [#21](https://github.com/labsitio/nexus-orc-web/issues/21) já registra isso para o segundo.

**A segunda exceção (`frontend-architect`) foi acrescentada no mesmo dia**, quando o limite de sessão da ferramenta se confirmou como gargalo real: a [#3](https://github.com/labsitio/nexus-orc-web/issues/3) (criar o agente, preencher `architecture.md`, estratégia de mock) é caminho crítico duplo — destrava o restante do contrato de integração ([#1](https://github.com/labsitio/nexus-orc-web/issues/1)) e o contexto que o `frontend-developer` precisa ler no fim de semana. Rodar isso na sessão de Bruno adiaria o que menos pode esperar, sem ganho nenhum: André precisaria validar o agente localmente de qualquer forma, pela mesma regra do `quality.md`.

Isto **não restaura** o ADR-0002 nem revoga esta permissão: quem quiser executar a própria frente segue autorizado a fazê-lo até 03/08. O que muda é o padrão — a execução deixa de ser distribuída por atribuição e passa a ser concentrada por conveniência, recuperando de graça a reprodutibilidade que motivou o ADR-0002.

Registrado como emenda, e não como ADR novo, por proporção: este ADR expira em 03/08, e abrir um ADR-0005 para uma mudança com três dias de vida seria cerimônia sem retorno (ver "Governança aplicada com proporção" no [STATUS.md](../../STATUS.md)).

**Risco que a emenda cria, e que está registrado no STATUS:** com a execução numa única máquina e conta, o limite de sessão da ferramenta passa a ser recurso compartilhado por todas as frentes — e já interrompeu uma revisão em 31/07.

## Data

2026-07-30

## Autor(es)

Bruno Martins — Tech Lead.

---

## Contexto

O [ADR-0002](0002-execucao-centralizada-e-escritor-unico.md) centralizou em Bruno a execução oficial dos agentes, para que o resultado entregue fosse reproduzível e atribuível a uma execução conhecida. A decisão foi tomada **antes** de duas informações que mudam o cálculo:

1. **A entrega é 03/08 às 17:30**, e o fim de semana é a maior janela contínua de implementação disponível.
2. **A disponibilidade de Bruno no fim de semana é incerta.**

Combinadas, elas transformam a centralização de garantia em gargalo: se cada execução oficial depende de uma pessoa que pode não estar disponível no sábado e domingo, a implementação simplesmente não acontece. O risco que o ADR-0002 evitava era divergência de resultado; o risco que ele passa a criar é ausência de resultado.

Trocar um risco de qualidade por um risco de existência é um mau negócio quando o entregável é software funcionando (`CLAUDE.md`, seção 1.2.1).

---

## Decisão

**Durante a janela até 03/08 às 17:30, cada integrante executa oficialmente os agentes da própria frente.**

- André executa Frontend Architect e Frontend Developer; Kássio executa Product Planner; Bruno executa Tech Lead, QA & Reviewer e Integração.
- Não é preciso aguardar Bruno para que uma execução conte como oficial.
- **Substituto da rastreabilidade que a centralização dava:** todo Pull Request cujo conteúdo foi gerado por agente deve declarar, em "Observações", **qual agente o gerou**. É o que preserva a atribuição — que era o valor real da centralização — sem o gargalo.
- **A decisão 2 do ADR-0002 continua valendo:** o STATUS.md segue com escritor único.

**Após a entrega, esta emenda expira** e a centralização do ADR-0002 volta a valer, salvo novo ADR.

---

## Alternativas Consideradas

| Alternativa | Prós | Contras | Motivo da rejeição |
|---|---|---|---|
| **A. Manter a centralização** | Resultado reproduzível, atribuível a uma execução | Depende de Bruno estar disponível sábado e domingo, o que não está garantido. Se não estiver, a implementação para | Rejeitada. Preserva uma garantia de qualidade ao custo de possivelmente não haver o que garantir |
| **B. Concentrar tudo na segunda-feira** | Mantém o ADR-0002 intacto | Comprime toda a implementação em algumas horas, no dia da entrega, sem folga para defeito. É o cenário de maior risco possível | Rejeitada |
| **C. Execução distribuída na janela, com declaração do agente no PR** | Ninguém fica bloqueado; a atribuição é preservada por outro meio | Perde a garantia de que todo o resultado saiu de uma execução única e reproduzível | **Escolhida.** Preserva o objetivo real — saber o que cada agente produziu — por um mecanismo mais barato |
| **D. Pedir prorrogação do prazo e manter tudo como está** | Resolveria a causa em vez do sintoma | Não é decisão da equipe, e a resposta pode não vir a tempo | Rejeitada como solução única. **Vale ser tentada em paralelo** — ver Consequências |

---

## Consequências

### Positivas

- A implementação deixa de depender da agenda de uma pessoa no fim de semana.
- Cada autor valida e entrega a própria frente, o que também encurta o ciclo de correção: quem escreveu o agente está presente quando ele falha.
- A atribuição por agente, declarada no PR, é mais granular do que a centralização oferecia — antes se sabia *quem executou*, agora se sabe *qual agente gerou cada mudança*.

### Negativas / Trade-offs aceitos

- **Perde-se a reprodutibilidade de execução única.** Resultados gerados em máquinas diferentes podem divergir em detalhe. Aceito: com revisão por PR e testes automatizados obrigatórios, a divergência que importa é detectada.
- **Depende de disciplina no PR.** Se ninguém declarar qual agente gerou o quê, perde-se a atribuição sem ganhar nada.
- **A emenda tem prazo, e prazo é esquecido.** Depois de 03/08 a centralização volta a valer — se ninguém lembrar, o processo fica em estado indefinido.

### Sobre a prorrogação do prazo

A alternativa D não substitui esta decisão, mas deve ser tentada em paralelo, e **hoje**: pedir prorrogação na quinta dá aos organizadores tempo de replanejar; pedir na segunda à tarde não. Se a prorrogação vier, esta emenda perde urgência — mas não é motivo para não a registrar agora, porque a decisão não pode depender de uma resposta que talvez não venha.

---

## Impacto em Outros Documentos

- [x] `docs/adr/0002-execucao-centralizada-e-escritor-unico.md` — nota de emenda no Status
- [x] `docs/team-responsibilities.md` — seção "Modelo de Execução dos Agentes"
- [x] `STATUS.md` — ADRs recentes e plano até a entrega
- [x] `.github/PULL_REQUEST_TEMPLATE.md` — campo para declarar o agente que gerou a mudança

---

## Referências

- [ADR-0002](0002-execucao-centralizada-e-escritor-unico.md) — decisão emendada
- `CLAUDE.md`, seção 1.2.1 — o entregável é software em funcionamento
- `STATUS.md`, seção "Prazo e plano até a entrega"
