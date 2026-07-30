# ADR-0001: Adoção do modelo de governança documental com ADRs, STATUS e backlog no GitHub

## Status

Proposto

> Depende da aprovação do responsável humano pela estrutura de governança criada em 2026-07-30. Ao ser aceito, atualizar este campo para **Aceito** e refletir a mudança na seção "ADRs recentes" do [STATUS.md](../../STATUS.md).

## Data

2026-07-30

## Autor(es)

Claude, atuando como Tech Lead (o agente Tech Lead formal ainda não foi criado — ver [docs/team-responsibilities.md](../team-responsibilities.md), Bruno). Solicitado por bruno.seibert@labsit.io.

---

## Contexto

A frente de **frontend** do projeto **Nexo** será conduzida por uma equipe de três integrantes, responsáveis por criar e operar cinco agentes de IA especializados (Tech Lead, Frontend Architect, Frontend Developer, QA & Reviewer, Product Planner). Isso cria três problemas que não existem — ou são muito mais brandos — em um time exclusivamente humano:

1. **Agentes não compartilham memória de conversa.** Um agente que inicia uma sessão não sabe o que outro decidiu na sessão anterior, a menos que a decisão esteja escrita em algum lugar previsível.
2. **Agentes tendem a implementar em vez de perguntar.** Sem regras explícitas de parada, um agente diante de ambiguidade normalmente escolhe uma opção plausível e segue, produzindo trabalho que precisa ser refeito.
3. **Cinco frentes trabalhando em paralelo divergem silenciosamente.** Decisões de arquitetura podem contradizer decisões de stack sem que ninguém perceba até a integração.

No momento desta decisão, o projeto não tem código, não tem stack definida, não tem arquitetura definida e não tem backlog. Portanto, é o momento de menor custo possível para fixar o processo de trabalho: nenhuma decisão anterior precisa ser desfeita.

A necessidade deste ADR foi identificada em uma revisão crítica da própria estrutura de governança: pelo critério da seção 7 do CLAUDE.md, adotar um modelo de processo é uma decisão estrutural e dificilmente reversível, logo exige registro formal. Sem este ADR, o processo se sustentaria apenas por convenção — e um processo que exige ADR para tudo, mas não tem ADR para si mesmo, é incoerente.

- **Issue relacionada:** _(a criar — backlog no GitHub ainda não configurado, ver Bloqueios em STATUS.md)_

---

## Decisão

Adotar um modelo de governança **documental, versionado no repositório e de leitura obrigatória**, composto por quatro mecanismos que se realimentam:

1. **[CLAUDE.md](../../CLAUDE.md) como contrato de processo.** Define fluxo de trabalho, governança, Definition of Done, Stop Conditions e um checklist obrigatório antes de qualquer agente responder a uma solicitação. Não contém decisões técnicas (stack, arquitetura, princípios de engenharia) — essas pertencem aos documentos de frente.
2. **Um documento vivo por frente de trabalho** em `docs/` (`architecture.md`, `engineering-principles.md`, `quality.md`, `planning.md`), cada um com um dono único definido em `docs/team-responsibilities.md`. O documento é a fonte da verdade da frente; nenhum agente altera o documento de outra frente sem coordenação do Tech Lead.
3. **ADRs numerados sequencialmente** em `docs/adr/` para toda decisão estrutural e dificilmente reversível. ADRs superados são marcados como **Superseded** e nunca apagados.
4. **[STATUS.md](../../STATUS.md) como estado presente do projeto**, atualizado ao final de toda sessão de trabalho relevante. Reflete o presente, não o histórico — histórico vive no GitHub.

Complementarmente: o **GitHub, acessado via MCP, é o backlog oficial**. Toda task relevante existe como issue antes de ser iniciada. STATUS.md e ADRs referenciam issues por número/link, mas não as substituem.

O ciclo pretendido é fechado: **decisão → ADR → STATUS.md → próxima task planejada → nova decisão.** Nenhum agente ou humano deve depender de memória de conversa para saber o estado do projeto.

---

## Alternativas Consideradas

| Alternativa | Prós | Contras | Motivo da rejeição |
|---|---|---|---|
| **A. Sem governança formal** — decisões tomadas ad hoc no chat, documentadas apenas se alguém lembrar | Zero overhead inicial; velocidade máxima nas primeiras sessões | Decisões se perdem entre sessões; agentes reimplementam ou contradizem escolhas anteriores; nenhuma rastreabilidade | Rejeitada. É o modo de falha exato que a natureza sem-memória dos agentes torna inevitável, e o custo aparece tarde — quando já há código a refazer |
| **B. Governança leve** — apenas um README com convenções e o backlog no GitHub | Baixo overhead; um único documento para manter | Não separa processo de decisão técnica; não há mecanismo para registrar *por que* algo foi decidido, apenas *o que*; nada informa o estado presente a quem retoma o projeto | Rejeitada. Perde o registro de racional (ADRs), que é justamente o que evita rediscussão infinita e permite auditar decisões meses depois |
| **C. Governança inteiramente no GitHub** — wiki, issues e discussions como única fonte da verdade, sem documentos no repositório | Backlog e documentação no mesmo lugar; histórico e comentários nativos | Documentação desacoplada do código que ela governa; não versiona junto com o commit que a implementa; agentes precisam de chamadas de rede para ler o processo, encarecendo cada sessão | Rejeitada como *única* fonte. Adotada parcialmente: o GitHub é a fonte do **backlog**, mas o processo e as decisões vivem versionados no repositório |
| **D. Modelo adotado** — CLAUDE.md + documento por frente + ADRs + STATUS.md, com backlog no GitHub | Estado e racional legíveis sem contexto prévio; separação clara de donos; versionado junto com o código; ciclo autoalimentado | Overhead real de manutenção; risco de documentos desatualizados; consome contexto do agente a cada sessão | **Escolhida.** O overhead é aceito conscientemente (ver trade-offs) porque o custo de decisões perdidas em um time de agentes é maior que o custo de mantê-las escritas |

---

## Consequências

### Positivas

- Qualquer agente ou pessoa consegue retomar o projeto lendo `STATUS.md` + `docs/`, sem depender de histórico de conversa.
- O racional das decisões fica preservado, não apenas o resultado — o que reduz rediscussão e permite revisar uma escolha com conhecimento de por que ela foi feita.
- As Stop Conditions dão a cada agente permissão explícita para **parar e escalar** em vez de assumir. Isso inverte o comportamento padrão de um agente diante de ambiguidade.
- Donos únicos por documento tornam conflitos entre frentes visíveis e endereçáveis pelo Tech Lead, em vez de silenciosos.
- Como não há código ainda, a adoção tem custo de migração zero.

### Negativas / Trade-offs aceitos

- **Overhead documental real.** Toda decisão estrutural custa um ADR, e toda sessão relevante custa uma atualização de STATUS.md. Aceito: é o preço da rastreabilidade entre sessões sem memória compartilhada.
- **Risco de documentação desatualizada.** Documentação que mente é pior que documentação ausente, porque é seguida. Mitigação: a seção 11 do CLAUDE.md determina que desalinhamento entre `docs/`, ADRs e realidade é, por si só, motivo de correção antes de qualquer outra tarefa.
- **Custo de contexto por sessão.** Ler CLAUDE.md + STATUS.md + o documento da frente consome contexto que poderia ir para o trabalho em si. Aceito como custo fixo previsível.
- **Risco de burocracia percebida.** Se a equipe passar a tratar ADRs como formalidade a preencher em vez de decisão a pensar, o mecanismo perde valor sem perder custo. Cabe ao Tech Lead vigiar isso.
- **Dependência do GitHub via MCP.** Se o MCP não estiver configurado ou disponível, o fluxo de planejamento fica bloqueado por construção — nenhuma task pode ser formalmente iniciada. Este bloqueio é real no momento desta decisão e está registrado em STATUS.md.
- **A granularidade de "decisão estrutural" é subjetiva.** A regra "na dúvida, registre" resolve o caso ambíguo em favor do overhead, não da velocidade.

---

## Impacto em Outros Documentos

- [x] `CLAUDE.md` — é o artefato central desta decisão; já criado
- [x] `docs/team-responsibilities.md` — define os donos de cada documento; já criado
- [x] `STATUS.md` — registrar este ADR na seção "ADRs recentes"
- [ ] `docs/architecture.md` — sem impacto de conteúdo; permanece a preencher por André
- [ ] `docs/engineering-principles.md` — sem impacto de conteúdo; permanece a preencher por André
- [ ] `docs/quality.md` — sem impacto de conteúdo; permanece a preencher por Kássio
- [ ] `docs/planning.md` — sem impacto de conteúdo; permanece a preencher por Kássio

---

## Referências

- [CLAUDE.md](../../CLAUDE.md) — contrato de processo definido por esta decisão
- [STATUS.md](../../STATUS.md) — estado presente do projeto, incluindo os bloqueios ativos
- [docs/team-responsibilities.md](../team-responsibilities.md) — divisão das cinco frentes e agentes a criar
- [docs/adr/TEMPLATE.md](TEMPLATE.md) — template usado por este e pelos próximos ADRs
