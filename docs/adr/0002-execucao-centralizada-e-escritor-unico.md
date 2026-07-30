# ADR-0002: Execução centralizada dos agentes e escritor único do STATUS.md

## Status

Proposto

> Ao ser aceito, atualizar este campo e refletir a mudança na seção "ADRs recentes" do [STATUS.md](../../STATUS.md).

## Data

2026-07-30

## Autor(es)

Bruno — Tech Lead. Registrado com apoio do Claude Code, a pedido de bruno.seibert@labsit.io.

---

## Contexto

A equipe de frontend tem três integrantes, cada um trabalhando na própria máquina, com sua própria sessão do Claude Code, e disponibilidade que varia ao longo do treinamento. Dois problemas operacionais surgem dessa configuração e precisam de regra antes de o trabalho começar:

1. **Execução dos agentes.** Se cada integrante executar os agentes na própria máquina para gerar o resultado entregue, os resultados divergem — modelos, versões de configuração, contexto local e ordem de execução diferentes produzem saídas diferentes. Na integração final, não há como dizer qual saída é "a" entrega da equipe.

2. **Escrita no STATUS.md.** A seção 8 do CLAUDE.md determina que o STATUS.md seja atualizado ao final de toda sessão de trabalho relevante. Como é um arquivo único e todos trabalham em paralelo, três pessoas cumprindo essa regra produzem conflito de merge de forma recorrente — no mesmo arquivo, muitas vezes nas mesmas seções.

Ambas as decisões já estão descritas em `docs/team-responsibilities.md` e em prática desde o início. Este ADR as formaliza, porque a seção 7 do CLAUDE.md exige registro de decisões estruturais e de processo — e um processo que exige ADR para tudo, sem ADR para as próprias regras de operação, é incoerente.

- **Issue relacionada:** _(a criar — GitHub MCP ainda não configurado, ver Bloqueios em STATUS.md)_

---

## Decisão

**1. A execução oficial dos agentes é centralizada em Bruno.**

- Cada integrante **entrega** as definições dos seus agentes (em `.claude/agents/`) e as diretrizes da sua frente.
- Bruno conduz a **execução oficial** — a que gera o resultado entregue e integrado com as demais equipes.
- **Validação local é permitida e recomendada:** cada autor deve rodar o próprio agente na própria máquina para verificar que funciona, antes de entregar.

**2. O STATUS.md tem escritor único: Bruno.**

- André e Kássio não editam o arquivo. Reportam o que precisa ser registrado na descrição do Pull Request ou na issue, e Bruno consolida.

---

## Alternativas Consideradas

| Alternativa | Prós | Contras | Motivo da rejeição |
|---|---|---|---|
| **A. Execução distribuída** — cada um executa seus próprios agentes e o resultado é somado | Paralelismo máximo; ninguém espera ninguém | Resultado não reproduzível; divergência de saída entre máquinas; na integração não há uma entrega única identificável | Rejeitada. O custo aparece exatamente no momento mais crítico — a integração com backend e mobile |
| **B. Centralização total, sem execução local** — só Bruno roda qualquer coisa, em qualquer momento | Consistência absoluta | Nenhum agente teria sido executado antes do final; a primeira execução de todos coincidiria com o dia da integração, concentrando todo o risco no pior momento | Rejeitada. Trocaria divergência de resultado por risco de descobrir defeito tarde |
| **C. Decisão adotada** — execução oficial centralizada + validação local livre | Resultado reproduzível e, ao mesmo tempo, cada agente testado por quem o escreveu | Exige disciplina de distinguir "validar" de "entregar"; concentra uma etapa em Bruno | **Escolhida.** Separa dois objetivos que estavam sendo confundidos: consistência do resultado e verificação precoce |
| **D. STATUS.md com escrita livre** — todos atualizam, conflitos resolvidos no merge | Nenhuma pessoa vira gargalo | Conflito recorrente em arquivo único; risco de perda de informação em resolução apressada de merge | Rejeitada. O conflito é previsível e frequente; escritor único o elimina por construção |
| **E. STATUS.md fragmentado** — um arquivo de status por frente | Elimina conflito sem centralizar | Contraria o propósito do STATUS.md (seção 8 do CLAUDE.md): ser **um** retrato do estado presente. Três arquivos exigem que o leitor os junte mentalmente | Rejeitada. Resolveria o conflito destruindo o valor do artefato |

---

## Consequências

### Positivas

- O resultado entregue é **reproduzível** e atribuível a uma execução conhecida.
- Cada agente é **testado por quem o escreveu**, antes da integração — o defeito aparece cedo e com o autor disponível para corrigir.
- O STATUS.md deixa de ser fonte de conflito de merge, sem perder a propriedade de ser retrato único do presente.
- A separação entre "validar" e "executar oficialmente" dá a cada autor autonomia sem custo de divergência.

### Negativas / Trade-offs aceitos

- **Bruno se torna ponto de passagem** para a execução final e para a consolidação do STATUS.md. Se ficar indisponível, essas duas etapas param. Mitigação: a suplência registrada em `docs/team-responsibilities.md` designa André como suplente do STATUS.md.
- **Custo de consolidação recorrente.** Reportar via PR e consolidar depois é mais trabalhoso que editar direto. Aceito: é menos trabalhoso que resolver conflito no mesmo arquivo repetidamente.
- **A distinção depende de disciplina.** Nada impede tecnicamente alguém de tratar uma execução local como oficial. A regra se sustenta por convenção, não por trava.
- **Latência na atualização do estado.** O STATUS.md reflete o presente com o atraso da consolidação, não em tempo real.

---

## Impacto em Outros Documentos

- [x] `docs/team-responsibilities.md` — já descreve as duas regras nas seções "Escritor Único do STATUS.md" e "Modelo de Execução dos Agentes"
- [x] `STATUS.md` — registrar este ADR na seção "ADRs recentes"
- [ ] `CLAUDE.md` — sem alteração necessária: a seção 8 permanece válida, este ADR apenas define **quem** executa a atualização
- [ ] `docs/quality.md` — Bruno deve considerar, ao escrever o checklist de revisão, um item verificando que o autor validou o próprio agente localmente

---

## Referências

- [docs/team-responsibilities.md](../team-responsibilities.md) — seções "Escritor Único do STATUS.md", "Modelo de Execução dos Agentes" e "Onde os Agentes Vivem"
- [CLAUDE.md](../../CLAUDE.md) — seção 7 (regras para ADRs) e seção 8 (atualização de STATUS)
- [ADR-0001](0001-adocao-do-modelo-de-governanca.md) — modelo de governança que este ADR complementa
