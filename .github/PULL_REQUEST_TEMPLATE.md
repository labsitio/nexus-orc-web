## O que muda

<!-- Descreva a mudança em uma ou duas frases. O que existia antes, o que passa a existir. -->

## Issue relacionada

<!-- Closes #NN — toda task relevante deve ter issue antes de começar (CLAUDE.md, seção 9).
     Se não há issue, explique por que a mudança é trivial o suficiente para dispensar uma. -->

Closes #

## Frente responsável

<!-- Marque a sua. Se o PR toca documento de outra frente, explique a coordenação em "Observações". -->

- [ ] Bruno Martins — Tech Lead, Integração & Qualidade
- [ ] André Luiz Ferreira — Frontend Architect & Stack
- [ ] Kássio Sá — Product Planner

---

## Definition of Done

Checklist da seção 5 do [CLAUDE.md](../CLAUDE.md), somada aos critérios de [docs/quality.md](../docs/quality.md).
Item que não se aplica deve ser marcado e justificado — não apagado.

- [ ] O escopo definido na issue foi integralmente atendido (ou o desvio está documentado abaixo).
- [ ] **Existe teste automatizado cobrindo a mudança.** Requisito de avaliação do exercício, não opcional — ver CLAUDE.md, seção 1.2. Se não se aplica (ex: mudança só de documentação), justifique em "Observações".
- [ ] A suíte de testes passa localmente.
- [ ] `node scripts/check-docs.mjs` passa (o CI também roda, mas rodar antes evita ida e volta).
- [ ] Os critérios de aceite de `docs/quality.md` foram verificados.
- [ ] Decisões estruturais tomadas neste trabalho estão registradas em ADR (CLAUDE.md, seção 7).
- [ ] Nenhuma mudança contradiz um ADR aceito. Se contradiz, há um novo ADR que o revisa ou supera.
- [ ] O código segue as convenções de `docs/engineering-principles.md`.
- [ ] Passou pela revisão do agente **QA & Reviewer**.
- [ ] Documentos afetados foram atualizados (architecture, engineering-principles, quality, planning).
- [ ] O que precisa entrar no `STATUS.md` foi reportado a Bruno — **escritor único** do arquivo (não edite direto).

## Para o STATUS.md

<!-- Bruno é o escritor único do STATUS.md e consolida a partir daqui. Preencha só as
     linhas que se aplicam e apague as demais — cada uma mapeia para uma seção do
     arquivo, então a consolidação é transcrição, não adivinhação.
     Se não há nada a registrar, escreva "nada a registrar". -->

- **Concluído:**
- **Bloqueado:**
- **Decisão tomada:**
- **Risco novo:**

## Observações

<!-- Desvios de escopo, itens do checklist que não se aplicam e por quê, pontos de
     atenção para quem revisa, dúvidas em aberto. -->
