# Protocolo de integração entre as três equipes

> Documento de responsabilidade de **Bruno Martins** (Tech Lead, Integração & Qualidade). Define como backend, frontend e mobile trocam perguntas e respostas de forma assíncrona, sem depender de alguém avisar.
>
> **As labels precisam ser idênticas nos três repositórios.** Enquanto não houver confirmação das outras duas equipes, este documento é proposta.

---

## Por que não é conversa em arquivo

Cada equipe tem um **agente de Integração** que varre os repositórios das outras procurando pendências direcionadas a ela. O canal são **issues com label**, não arquivo, por três motivos:

- Issue tem thread, autor, data e link permanente. Arquivo tem diff, que é ruim de ler como conversa.
- Issue notifica quem está subscrito. Arquivo exige que alguém vá conferir.
- Arquivo compartilhado entre três repositórios diverge em três cópias na primeira semana.

O arquivo continua tendo papel: registrar o **estado consolidado** do que foi decidido (`docs/contrato-integracao-pauta.md`), que é o que os agentes leem como contexto. Conversa e estado são coisas diferentes.

---

## Máquina de estados

A pergunta nasce **no repositório de quem pergunta** e é rotulada com quem deve responder.

```
      equipe A cria issue no repo de A
                    │
                    ▼
     integracao:aguardando-<equipe-B>        ← é a vez de B
                    │
        agente de integração de B varre,
        lê a pergunta e consulta os
        agentes da própria equipe
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
  sabe a resposta          não sabe / exige decisão
        │                        │
        ▼                        ▼
 integracao:respondido    integracao:escalado
   (+ comentário)          (+ comentário dizendo
        │                   quem vai decidir)
        ▼                        │
 agente de A retoma              ▼
                          issue de roteamento
                          interno no repo de B
```

### Labels do protocolo — iguais nos três repositórios

| Label | Significado | Quem aplica |
|---|---|---|
| `integracao:aguardando-frontend` | É a vez da equipe de frontend responder | quem pergunta |
| `integracao:aguardando-backend` | É a vez da equipe de backend responder | quem pergunta |
| `integracao:aguardando-mobile` | É a vez da equipe de mobile responder | quem pergunta |
| `integracao:respondido` | Foi respondido; quem perguntou deve reler | quem responde |
| `integracao:escalado` | Quem deveria responder **não sabe**; há pessoa decidindo | quem responde |

**Regra invariante: no máximo uma label `aguardando-*` por vez.** É ela que diz de quem é a bola. Ao responder, remove-se a `aguardando-*` e adiciona-se `respondido` — nunca as duas juntas.

> **Nomenclatura, e por que não `respondido-frontend`.** "Respondido-frontend" é ambíguo: pode significar "o frontend respondeu" ou "o frontend foi respondido". Duas equipes lendo de formas opostas travam o fluxo em silêncio. `aguardando-<equipe>` diz de quem é a vez sem ambiguidade possível, e `respondido` não precisa de sufixo porque o comentário mostra quem respondeu.

O estado **`escalado`** existe para que quem perguntou saiba a diferença entre "estão pensando" e "foi ignorado". Sem ele, uma pergunta sem resposta é indistinguível de uma pergunta perdida.

---

## O que o nosso agente de Integração faz

Definição em `.claude/agents/integracao.md`, frente de Bruno.

1. **Varre** os repositórios [nexus-orc-back](https://github.com/labsitio/nexus-orc-back) e [nexus-orc-mobile](https://github.com/labsitio/nexus-orc-mobile) por issues com `integracao:aguardando-frontend`.
2. **Lê** a pergunta e busca a resposta **nos nossos documentos** — `docs/architecture.md`, `docs/engineering-principles.md`, `docs/contrato-integracao-pauta.md`, ADRs aceitos.
3. **Se a resposta já está registrada:** comenta na issue **citando onde está** (arquivo e seção), troca a label para `integracao:respondido`.
4. **Se não está registrada:** aplica `integracao:escalado`, comenta dizendo quem vai decidir, e **abre issue de roteamento no nosso repositório** (ver abaixo).
5. Faz o caminho inverso para as nossas perguntas: cria a issue aqui, rotula `aguardando-<equipe>`, e acompanha até `respondido`.

### Guardrail que não pode ser flexibilizado

**O agente responde apenas o que já está decidido e registrado. Ele nunca decide.**

Responder uma pergunta de contrato é tomar decisão em nome da equipe, e frequentemente decisão estrutural — "usamos camelCase", "aceitamos polling", "conseguimos absorver isso". Pela seção 7 do [CLAUDE.md](../CLAUDE.md), decisão estrutural exige ADR. Um agente que improvisa resposta compromete a equipe com algo que ninguém aprovou, **e a outra equipe vai implementar em cima disso**.

Na dúvida entre responder e escalar, **escala**. O custo de escalar é uma issue a mais; o custo de responder errado é código construído sobre premissa falsa em outro repositório.

---

## Roteamento interno: como a pergunta chega à pessoa certa

Este é o elo que faz o protocolo não morrer no agente. Quando ele não sabe a resposta, cria issue **no nosso repositório** com:

- **Título:** `[Integração] <pergunta resumida>`
- **Label de frente:** `para:bruno`, `para:andre` ou `para:kassio`
- **Label `integracao:escalado`**
- **Corpo:** a pergunta original, o link para a issue de origem, o que já foi procurado nos nossos documentos, e o que especificamente falta decidir

### A quem direcionar

| Assunto da pergunta | Label | Pessoa |
|---|---|---|
| Contrato de dados, arquitetura, stack, mock, mecanismo de tempo real | `para:andre` | André Luiz Ferreira |
| Critério de aceite, teste, definição de pronto | `para:bruno` | Bruno Martins |
| Escopo, prioridade, ordem de entrega, o que entra em qual fase | `para:kassio` | Kássio Sá |
| Prazo, negociação, qualquer coisa que envolva compromisso entre equipes | `para:bruno` | Bruno Martins |

Na dúvida, `para:bruno` — a coordenação entre frentes é dele, e ele redireciona.

### Como aparece no `/minhas-tarefas`

O comando consulta as issues abertas do nosso repositório com a label da frente de quem invocou, e as lista em seção própria — **antes** das tasks de rotina, porque pergunta de outra equipe tem custo de espera do outro lado.

**Isso torna o GitHub MCP um pré-requisito**, não uma conveniência: sem ele o comando não consegue consultar issue nenhuma. Ver issue [#9](https://github.com/labsitio/nexus-orc-web/issues/9).

---

## Pendências deste protocolo

- [ ] **Confirmar as labels com backend e mobile.** Precisam ser idênticas nos três repositórios; nome divergente quebra o filtro em silêncio.
- [ ] **Criar as labels** nos três repositórios.
- [ ] **Verificar permissão de escrita cruzada.** O nosso agente precisa conseguir comentar e alterar label nos repositórios das outras equipes. Token com escopo `repo` só alcança repositório onde a conta é collaborator — se não for, o agente lê mas não responde, e o protocolo funciona só de um lado.
- [ ] **Acordar cadência de varredura.** O agente não roda sozinho: alguém o invoca. Sem combinar frequência, uma equipe responde em minutos e a outra em dois dias.
- [ ] **Definir o que acontece em `escalado` sem resposta.** Se ninguém decide, a pergunta fica parada com aparência de estar em andamento. Proposta: prazo acordado, após o qual escala para o grupo.
