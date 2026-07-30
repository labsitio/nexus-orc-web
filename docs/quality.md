# Qualidade e Critérios de Aceite — Projeto Nexo

> Documento vivo, de responsabilidade do agente **QA & Reviewer** (Bruno — ver [team-responsibilities.md](team-responsibilities.md)). Define os critérios contra os quais uma entrega é avaliada.

Este documento **complementa** a Definition of Done geral definida em [CLAUDE.md](../CLAUDE.md#5-definition-of-done) — não a substitui.

---

> **Requisito não negociável herdado dos organizadores:** **testes automatizados** e **código de qualidade** são critérios explícitos de avaliação do exercício (ver [CLAUDE.md](../CLAUDE.md), seção 1.2). A Definition of Done definida aqui **precisa** exigir teste automatizado — isso não é decisão da equipe, é requisito de entrada.

---

## 1. Critérios de Aceite Gerais

Valem para toda entrega, independente da feature.

- **Atende ao escopo da issue**, integralmente. Entrega parcial é aceitável apenas com o desvio declarado no Pull Request.
- **Não faz além do escopo da issue.** Trabalho não planejado que apareceu no caminho vira issue nova, conforme a seção 10 do `CLAUDE.md` — não entra de carona.
- **Existe teste automatizado cobrindo a mudança** (ver seção 2).
- **A suíte de testes passa** e o build funciona a partir do repositório limpo.
- **`node scripts/check-docs.mjs` passa.**
- **Segue as convenções** de [engineering-principles.md](engineering-principles.md).
- **Nenhum segredo versionado.** Token, chave e credencial vêm de variável de ambiente.
- **Decisão estrutural registrada em ADR**, quando houver, e nenhuma contradição a ADR aceito.

---

## 2. Definition of Done — Qualidade Técnica

### O teste é obrigatório, e o critério é objetivo

Toda mudança de comportamento exige teste automatizado. **Não exigimos percentual de cobertura** — nesta fase do projeto, percentual vira métrica perseguida por si mesma e não diz se o que importa está testado.

O critério é outro, e é verificável:

> **O teste deve falhar se a mudança for revertida.**

É o que separa teste que cobre a mudança de teste que apenas existe. Teste que passaria com a implementação vazia não conta como cobertura, e o revisor deve dizer isso explicitamente quando encontrar.

A ferramenta e o comando de teste são definidos em [engineering-principles.md](engineering-principles.md) — este documento não os fixa, para não divergir dele.

### Duas exceções, e apenas estas

- **Mudança exclusivamente de documentação ou configuração**, sem alteração de comportamento.
- **Impossibilidade técnica**, declarada e justificada no Pull Request. "Não deu tempo" não é impossibilidade técnica.

### Checklist técnica

- [ ] Existe teste automatizado que falha se a mudança for revertida.
- [ ] A suíte passa localmente.
- [ ] O build funciona a partir do repositório limpo.
- [ ] `check-docs` passa.
- [ ] Nenhum segredo em código.
- [ ] Se a mudança entrega ou altera definição de agente, o autor **rodou o agente** antes de entregar ([ADR-0002](adr/0002-execucao-centralizada-e-escritor-unico.md)).
- [ ] Se o conteúdo foi gerado por agente, o PR declara **qual agente** ([ADR-0003](adr/0003-execucao-distribuida-na-janela-de-entrega.md)).

---

## 3. Checklist de Revisão de Código

Cada item deve ser respondível com sim ou não. Se exigir julgamento subjetivo, não é critério — é preferência, e não entra aqui.

**Escopo**
- [ ] A mudança faz o que a issue pede?
- [ ] A mudança faz **apenas** o que a issue pede?

**Teste**
- [ ] Existe teste cobrindo a mudança?
- [ ] O teste falharia se a implementação fosse revertida?

**Processo**
- [ ] Decisão estrutural sem ADR? (biblioteca nova, padrão de estado, estrutura de pastas)
- [ ] A mudança contradiz algum ADR aceito?
- [ ] O bloco "Para o STATUS.md" do PR está preenchido?

**Integração com o backend**
- [ ] Usa apenas endpoints que existem no [contrato do backend](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml)?
- [ ] Campos marcados como PROVISÓRIO no contrato deles estão isolados, de modo que uma mudança do lado deles não se espalhe pelo código?
- [ ] Estados terminais que **não são erro** são apresentados corretamente? `VALIDADO_COM_RESSALVA`, `EXTRAIDO_COM_PENDENCIA_CONFIRMADA` e `FALHA_INDEXACAO` são válidos — `FALHA_INDEXACAO` em particular não bloqueia nada de negócio.
- [ ] Resposta `409` em decisão humana é tratada recarregando o estado, e não como falha?

**Segurança**
- [ ] Nenhum segredo versionado?
- [ ] `404` do backend é tratado como "não encontrado", sem inferir existência em outro tenant?

---

## 4. Critérios de Aceite por Tipo de Task

| Tipo | Exige teste? | Observação |
|---|---|---|
| **Feature** | Sim | Teste do caminho principal, no mínimo |
| **Correção de defeito** | Sim, obrigatoriamente | O teste deve reproduzir o defeito e falhar sem a correção. É o único jeito de saber que a correção corrige |
| **Refatoração** | Os testes existentes bastam | Se não havia teste, a refatoração começa escrevendo um — refatorar sem teste é reescrever no escuro |
| **Documentação** | Não | `check-docs` deve passar |
| **Configuração / infra** | Quando testável | Se não for testável automaticamente, declare como foi verificado manualmente |
| **Definição de agente** | Não se aplica | Mas o autor deve ter **executado o agente** antes de entregar |

---

## 5. Processo de Revisão

### Vereditos

O agente `qa-reviewer` emite um de três:

| Veredito | Significado |
|---|---|
| **Aprovado** | Atende a tudo. Pode mergear. |
| **Aprovado com ressalvas** | Nada bloqueia o merge, mas há item a corrigir depois. As ressalvas devem virar issue — ressalva que não vira issue é ressalva esquecida. |
| **Reprovado** | Há item bloqueante. **Não deve ser mergeado.** |

### O que acontece na reprovação

**PR reprovado não deve ser mergeado.** Mas a decisão do que fazer é do autor, não do revisor:

1. O revisor **aponta** os achados, com o critério que fundamenta cada um.
2. O **autor decide**: corrige, ou justifica por que o achado não se aplica.
3. O autor **solicita nova validação** — explicitamente, dizendo o que mudou desde a última.
4. O revisor reavalia **apenas o que mudou**, mais qualquer efeito colateral.

O passo 3 não é formalidade: sem pedido explícito de nova validação, ninguém sabe se o autor terminou de mexer, e o PR fica num limbo em que cada lado espera o outro.

**Ser honesto sobre o alcance disso:** não há bloqueio técnico. A proteção da branch está configurada com **0 aprovações exigidas** ([#10](https://github.com/labsitio/nexus-orc-web/issues/10)), justamente para não depender de alguém estar disponível durante a janela de entrega. Então "não deve ser mergeado" é **acordo da equipe**, não trava. Quem mergear um PR reprovado consegue — e assume a escolha.

### Quem revisa

O agente `qa-reviewer` faz a verificação contra estes critérios. Ele **não altera código**: aponta e devolve. Correção é de quem escreveu.

---

## 6. Métricas de Qualidade Acompanhadas

**Nenhuma, por decisão consciente.**

Com a entrega em 03/08 e o entregável sendo software funcionando, acompanhar métrica custa tempo que não vira código, e percentual de cobertura induz a escrever teste para o número em vez de para o risco.

O que substitui a métrica nesta fase: o critério objetivo da seção 2 — **o teste falha se a mudança for revertida** — verificado a cada Pull Request.

Se o projeto continuar depois da entrega, isto é o primeiro item a revisitar.
