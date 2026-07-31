---
description: Roda o agente QA & Reviewer contra o trabalho local, antes de o PR existir — uso: /revisar (ou /revisar 18 para revisar um PR já aberto)
allowed-tools: Read, Glob, Grep, Bash, Task, Agent, mcp__github__issue_read, mcp__github__list_issues, mcp__github__pull_request_read, mcp__github__list_pull_requests
---

## Alvo informado

`$ARGUMENTS`

## Estado local

- **Branch:** !`git rev-parse --abbrev-ref HEAD`
- **Alterado em relação à `main`:** !`git diff --stat origin/main...HEAD`
- **Não commitado:** !`git status --short`

## Sua tarefa

Antecipar a revisão: apontar o que o `qa-reviewer` apontaria, **antes** de o trabalho chegar a outra pessoa. Uma ida e volta de revisão custa a disponibilidade de duas pessoas; encontrar a mesma coisa aqui custa um minuto.

### 1. Definir o alvo

- **Sem argumento:** revise o trabalho local — o diff da branch atual contra `origin/main`, **mais o que ainda não foi commitado**. É o uso principal, porque o objetivo é rodar antes de abrir o PR.
- **Com um número:** revise aquele Pull Request pelo GitHub.

Se a branch atual for a `main` e não houver diff nem alteração pendente, não há o que revisar — diga isso e pare.

### 2. Descobrir a issue

A convenção de branch é `<tipo>/<nº da issue>-<descrição>`, então o número sai do nome da branch. Leia a issue: é contra o escopo dela que a revisão acontece, não contra o que a mudança parece querer ser.

Se não houver issue identificável, diga — pela seção 9 do `CLAUDE.md` toda task relevante deveria ter uma antes de começar, e isso por si já é um achado.

### 3. Invocar o agente

Chame o agente **`qa-reviewer`**, informando: o alvo (diff local ou número do PR), o número da issue, e que a revisão é **local e antecipada**.

Não reimplemente a revisão aqui. O agente carrega `docs/quality.md`, o Definition of Done e os ADRs; duplicar esse critério neste comando é criar uma segunda fonte da verdade que vai divergir da primeira.

### 4. Regra que muda em relação à revisão de PR

**Não publique nada no GitHub.** Quando ainda não existe PR, não há onde publicar; quando existe, o autor é você mesmo, e review de si próprio no PR só faz ruído. O veredito fica aqui, no terminal.

A única exceção é o pedido explícito de revisar o PR **de outra pessoa** — aí vale o fluxo normal do agente, que publica e submete.

### 5. Devolver

- O **veredito** e os achados, na ordem de severidade que o agente usa.
- **O que corrigir antes de abrir o PR** — separado do que pode virar issue depois.
- Se estiver limpo, diga o que foi verificado. Revisão que sempre encontra algo perde credibilidade.

## O que este comando não é

Não substitui as travas mecânicas. O `check-docs` roda no `pre-push` e no CI, e pega link quebrado, referência a seção inexistente, segredo versionado e agente sem frontmatter sem gastar token nenhum. Este comando existe para o que **nenhum script decide**: se a mudança atende ao escopo da issue, se contradiz um ADR aceito, se o teste testa o que a mudança faz ou apenas existe.

Se o `check-docs` está falhando, corrija isso primeiro — não gaste uma revisão para descobrir o que um segundo de script já disse.
