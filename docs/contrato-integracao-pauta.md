# Pauta — Contrato de integração com o time de backend

**Issue:** [#1](https://github.com/labsitio/nexus-orc-web/issues/1) · **Data da reunião:** \_\_\_\_ / \_\_\_\_
**Participam pelo frontend:** Bruno Martins (Tech Lead) e André Luiz Ferreira (Frontend Architect)

> **Divisão na sala:** Bruno conduz, André decide o conteúdo técnico. Um fala, o outro preenche as linhas **Acordado** — se as duas pessoas conduzirem, o registro é o que se perde.

---

## Estado: o contrato já existe

O backend **já publicou o contrato**, antes de escrever código, e endereçado explicitamente a nós:

| Artefato | Onde |
|---|---|
| Especificação (fonte da verdade) | [`docs/openapi.yaml`](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml) — OpenAPI 3.1, versão `0.1.0-provisional` |
| Guia de leitura para o frontend | [`docs/api-contrato-frontend.md`](https://github.com/labsitio/nexus-orc-back/blob/main/docs/api-contrato-frontend.md) |
| Contato de arquitetura | jonas.sousa@labsit.io |

O repositório deles está em fase de **especificação** (Spec-Driven Development, specs 001–005 e 007). Não há implementação ainda — o contrato é derivado de `plan.md`, não de API rodando. E o próprio documento distingue o que é **firme** do que é **suposição do arquiteto**, o que é raro e muito útil.

**Consequência para esta reunião:** a maior parte do que eu havia listado como "decidir" já está decidido. O tempo deve ir para as **lacunas estruturais** do bloco 2, que são de outra ordem de gravidade.

---

## Bloco 1 — Já respondido pelo contrato: só confirmar

Nada aqui precisa de discussão. Ler, confirmar que segue valendo e transcrever para a seção 5 de [architecture.md](architecture.md) com status `acordado`.

| Item | Definição do backend |
|---|---|
| **Casing** | `camelCase`, com nomes de campo **em português** (`orcamentoId`, `nomeArquivo`, `precoUnitario`, `tamanhoPagina`) |
| **Datas** | ISO 8601 UTC com sufixo `Z` (`2026-07-30T14:05:00Z`); datas puras em `YYYY-MM-DD` |
| **Enums** | String em `MAIUSCULA_SNAKE`, todos enumerados no schema |
| **Erro** | RFC 7807 Problem Details — `type` (URI), `title`, `status`, `detail`, `instance`. O **`type` é o código estável** (`https://nexo.internal/problems/estado-invalido`); não existe campo `code` |
| **Tipo de ID** | UUID **v7**, gerado exclusivamente pelo Gateway de Ingestão |
| **Nulabilidade** | `nullable: true` explícito. Regra forte em `CampoExtraido`: `extraido: false` ⟺ `valor: null` — o agente **nunca inventa valor** |
| **Autenticação** | JWT do Cognito User Pool. **Tenant nunca é header, query ou body** — vem da claim verificada `custom:tenant_id`. Papéis (`comprador-responsavel`, `compliance-admin`) vêm de grupos Cognito |
| **Semântica de 404** | 404 pode significar "não existe" **ou** "existe em outro tenant" — deliberadamente indistinguível. Tratar sempre como não encontrado, nunca inferir existência |
| **409** | Estado mudou entre a tela carregar e o usuário agir. Recarregar status antes de reexibir o formulário — é comportamento correto, não bug |
| **Idempotência** | `Idempotency-Key` em `confirmar-upload`, janela de 24h. Gerar a chave **uma vez por tentativa do usuário** (no clique do botão), para retry de rede não duplicar orçamento. Os demais POSTs não são idempotentes |
| **Versionamento** | Prefixo `/v1` no path |
| **Fonte da verdade** | `docs/openapi.yaml` no repositório do backend |

**Duas inconsistências que o contrato assume como reais** — não tentar unificar por conta própria, mas vale perguntar se serão alinhadas:

- **Paginação em dois padrões:** `pagina`/`tamanhoPagina` na busca (spec 004) e `cursor`/`limit` na exportação de auditoria (spec 007). Vêm de specs que não coordenaram entre si.
- **Sem envelope padronizado:** busca retorna `{resultados, pagina, tamanhoPagina, totalAproximado}`, auditoria retorna `{itens, proximoCursor}`, endpoints de status retornam o objeto direto.

**Acordado / segue valendo:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Bloco 2 — Lacunas estruturais: o foco da reunião

Estes três itens não são detalhe de contrato. São **ausência de backend** para o nosso produto principal.

### 2.1 Não existe endpoint para listar orçamentos

**O problema.** O Portal Web de Acompanhamento é a nossa entrega da Fase 02 e 03, e sua tela principal é uma **lista de orçamentos em processamento**, com status, alertas e pendências. Não existe endpoint que retorne essa lista.

O que existe:

| Endpoint | Por que não resolve |
|---|---|
| `GET /orcamentos/{id}/status` (×5, um por BC) | Exige saber o id de antemão. Não lista |
| `POST /orcamentos/busca` | Só retorna orçamentos com `origemValidacao` `VALIDADO` ou `VALIDADO_COM_RESSALVA` — ou seja, **apenas o que já terminou**. O painel precisa mostrar o que está em andamento |
| `GET /auditoria/orcamentos/export` | Trilha de eventos por tenant, cursor-paginada, desenhada para compliance. Não é lista de orçamentos com estado atual |
| `GET /orcamentos/{id}` (consolidado) | **PROVISÓRIO e sem dono confirmado.** E ainda assim é por id, não lista |

**Perguntar:** existe plano de um endpoint de listagem de orçamentos com filtro por estado e paginação? Se não, isso precisa de spec no backend — não é algo que o frontend contorne.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 2.2 Não existe Bounded Context de Acompanhamento

O contrato do backend declara isso com todas as letras: *"não existe spec/plan de um Bounded Context 'Acompanhamento' completo"*. Uma spec 006 (Portal do Gestor) é citada nas notas de revisão de 001/002/005 como tendo existido e sido **removida ou reduzida** — não está no repositório.

O `GET /orcamentos/{orcamentoId}` consolidado foi criado pelo arquiteto deles justamente para tapar essa lacuna, mas é marcado como PROVISÓRIO, **sem dono confirmado**, e sujeito a mudança ou remoção.

A alternativa "firme" é o frontend orquestrar **5 chamadas por orçamento**. Para uma tela de um orçamento, é aceitável. Para uma lista de 50, são 250 requisições.

**Perguntar:**
- O endpoint consolidado será implementado? Por quem, e com qual shape?
- Ou uma spec de Acompanhamento vai ser criada? Em que prazo?
- Se nenhum dos dois, qual é a orientação deles para a tela principal do painel?

**Por que isso é grave:** o nosso produto principal depende de um BC que ninguém especificou. Não é risco de integração — é risco de escopo. Se sair da reunião sem resposta, precisa escalar para os organizadores.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 2.3 Filas de revisão humana não têm endpoint de listagem

Cada um dos 5 BCs tem o estado `PENDENTE_REVISAO_HUMANA` e um POST de decisão. O contrato diz que *"o mecanismo de apresentação da fila (tela de triagem) é responsabilidade do consumidor externo de frontend"* — mas **não existe `GET` que liste o que está pendente de revisão**.

Sem isso, não há como montar a fila de triagem: o gestor só descobriria uma pendência se já soubesse o id do orçamento.

É a mesma raiz do 2.1 e do 2.2, e vale tratar como um único pedido.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Bloco 3 — Decisões abertas de contrato

### 3.1 Status em tempo real: não existe push

O nosso escopo exige **status em tempo real e alertas**. O contrato do backend é explícito: *"Não existe, hoje, um único WebSocket/SSE de status — o frontend deve fazer polling"*. E: *"Um mecanismo de push não está especificado em nenhum plan.md; se o frontend precisar disso, é uma feature nova a especificar via Spec Kit"*.

Nenhuma spec define intervalo de polling. A única referência temporal é a meta de pipeline: **p95 ≤ 5 minutos por etapa**.

**Decidir:**
- Aceitamos polling? Com que intervalo? (Com p95 de 5 min por etapa, polling agressivo é desperdício)
- Push entra como feature nova a especificar? Quem abre a spec, e em que fase?
- Se ficar em polling: existe endpoint de "mudanças desde X"? Sem isso, o painel relista tudo a cada ciclo.

**Nota para a nossa arquitetura:** isso afeta diretamente a decisão de stack ([#2](https://github.com/labsitio/nexus-orc-web/issues/2)). Sem AppSync/GraphQL do lado deles, não há subscription para consumir, e a suposição que eu havia registrado como provável cai.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 3.2 Autenticação do portal do fornecedor

Este é o item que o contrato **não cobre** e que muda a nossa arquitetura.

Todo endpoint exige JWT do Cognito. Mas o nosso escopo tem duas interfaces com públicos diferentes:

- **Portal de upload** — usado por **fornecedor externo** (Fase 01)
- **Painel de acompanhamento** — usado por **gestor interno** (Fase 02/03)

O contrato fala de papéis internos (`comprador-responsavel`, `compliance-admin`) e de tenant por claim, mas nada sobre fornecedor.

**Decidir:**
- O fornecedor externo tem conta no Cognito? Mesmo User Pool com grupo distinto, ou pool separado?
- Se tem conta: existe fluxo de cadastro/convite de fornecedor? Quem o implementa?
- Ou o "portal de upload" é operado internamente, por alguém de compras enviando em nome do fornecedor? Isso mudaria o público da tela e simplificaria muito.

**Por que importa:** define se entregamos duas aplicações com autenticação separada ou uma com autorização por papel. É decisão de arquitetura, não de tela de login. E a resposta "o fornecedor faz login" implica um fluxo de onboarding que não está no escopo de ninguém hoje.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 3.3 Ambientes, URL base e CORS

O `openapi.yaml` traz apenas placeholders (`api.dev.nexo.internal`, `api.staging.nexo.internal`, `api.nexo.internal`) e diz explicitamente: *"nenhum ambiente real foi definido em specs/plans"*.

**Decidir:** quais ambientes existirão, quando, e se o CORS vai contemplar a origem do nosso frontend (CloudFront).

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 3.4 Quando existe algo consumível

O backend está em fase de especificação, sem implementação. **Pergunta mais útil da reunião para planejamento:** em que data existe qualquer coisa respondendo, ainda que stub com dado fixo?

Até lá dependemos 100% de mock derivado do `openapi.yaml`.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Bloco 4 — O que o backend pede que nós confirmemos

A seção 8 do contrato deles lista seis pontos. Chegamos com posição em todos — o que torna a reunião recíproca em vez de só extrativa. **As posições abaixo são propostas para André confirmar ou substituir.**

### 4.0 O problema comum aos pontos 2 e 3: itens não têm identidade

Antes de responder aos seis, uma observação que resolve dois deles de uma vez.

No schema `ItemOrcamento`, um item tem apenas `descricao`, `quantidade` e `precoUnitario` — **nenhum identificador**. Por isso o contrato precisou referenciar item por posição no array: `caminho: "itens[0].precoUnitario"` na revisão de extração, e `referenciaItem: "itens[0]"` nas inconsistências de validação.

Referência por índice é frágil de um jeito específico e perigoso: se a ordem ou a quantidade de itens mudar entre o `GET` que alimentou a tela e o `POST` da decisão humana, a correção **é aplicada no item errado, silenciosamente**. Não dá erro. Numa tela de revisão de preços, isso significa corrigir o preço da caixa de papelão no item do palete.

**Nossa proposta:** cada item ganha um `itemId` estável (UUID) na resposta de extração, e as referências passam a usá-lo. Resolve os pontos 2 e 3 juntos e elimina a classe de bug.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4.1 Corpo de `POST /orcamentos/upload-url`

**Nossa posição:** manter `canal` **no corpo**, como eles assumiram. É o cliente que sabe por onde está enviando, e inferir do JWT obrigaria o token a codificar canal — o que quebra se o mesmo fornecedor usar portal e API. Sugerimos que o backend **valide** o canal contra o permitido para aquela credencial, em vez de inferi-lo.

`nomeArquivo` e `tipoConteudo` são necessários para gerar a URL presigned — mantemos. `referenciaExterna` opcional está bom.

**O que precisamos e não está no contrato:** **tamanho máximo de arquivo e lista de MIME types aceitos.** Sem isso, a validação só acontece no S3, no `PUT`, e o erro que chega ao usuário é opaco — o frontend precisa barrar antes de enviar, com mensagem clara.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4.2 `camposConfirmados` em `.../extracao/revisao-humana`

**Nossa posição:** estrutura tipada por item, não string livre — `{ itemId, campo, valor, indisponivel }`, conforme o 4.0. Para campos de `condicoesComerciais`, que não são lista, uma chave nomeada resolve sem ambiguidade.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4.3 Shape de `dadosCorrigidos` em `.../validacao/decisao-humana`

**Nossa posição:** **o mesmo shape do 4.2.** Corrigir dado na validação e confirmar campo na extração são, da perspectiva da UI, a mesma operação — o usuário edita campos de itens. Dois shapes diferentes para isso nos obrigam a manter dois modelos de edição e dois formulários, sem ganho nenhum.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4.4 `GET /orcamentos/{id}` consolidado será implementado?

**Nossa posição: sim, precisamos — mas o endpoint de listagem é mais urgente.**

Se for possível entregar apenas um dos dois, queremos a **listagem**. Motivo: sem listagem não existe porta de entrada para o painel — a tela principal não tem como ser construída. Já o consolidado por id é otimização: dá para viver orquestrando 5 chamadas na tela de detalhe de **um** orçamento, o que é aceitável.

O inverso não vale: ter o consolidado e não ter listagem não nos permite construir nada.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4.5 Intervalo de polling, ou plano de push

**Nossa posição: reformular a pergunta.** O intervalo importa menos do que **quantas chamadas cada ciclo custa**.

- Na tela de **detalhe** de um orçamento, com p95 ≤ 5 min por etapa, polling a cada 15–30 s é mais que suficiente e barato.
- Na tela de **lista**, o problema não é o intervalo: é que sem endpoint de listagem, acompanhar 50 orçamentos custa 250 requisições por ciclo. Aí nenhum intervalo é aceitável.

Ou seja: **com um endpoint de listagem, polling resolve e push é conveniência. Sem ele, push não nos salva** — continuaríamos sem saber o que listar.

**Pedido concreto:** parâmetro de "mudanças desde X" no endpoint de listagem, para o painel não retransferir o acervo inteiro a cada ciclo.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4.6 Tenant: sempre um por JWT?

**Nossa posição: um tenant por JWT, sem seletor de contexto.** O escopo descreve o usuário como "o gestor da rede varejista" — uma rede, um gestor. Multi-tenant só aparece na Fase 03, e como **isolamento**, não como troca de contexto pelo usuário.

**Mas precisamos que fique decidido, não em aberto.** Se depois virar multi-conta com troca de contexto, muda navegação, cache e invalidação de dados no cliente — é retrabalho grande para uma decisão que custa nada agora.

**Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Fora do escopo desta conversa

- Modelagem interna do backend, orquestração do pipeline e prompts dos agentes de IA do produto.
- Escolha de stack do frontend — decisão nossa, exige ADR ([#2](https://github.com/labsitio/nexus-orc-web/issues/2)). Confirmação de tecnologia pelo backend é **entrada** para essa decisão, não substituto dela.
- Contrato do app mobile — é da equipe de [nexus-orc-mobile](https://github.com/labsitio/nexus-orc-mobile). Mas **vale verificar** se compartilham o vocabulário de status e o pool de autenticação; se sim, a decisão do 3.2 afeta as três equipes.

## Dois riscos que o backend já documentou e nós herdamos

Não são para decidir na reunião, mas precisamos saber que existem:

- **Busca semântica não filtra por permissão individual.** Dentro do mesmo tenant, qualquer usuário autenticado encontra qualquer orçamento validado. Declarado na spec 004 como aceitável em single-tenant (Fase 01/02) e a revisar antes da Fase 03. Afeta o que expomos na tela de busca.
- **Exportação de auditoria é JSON paginado**, por decisão explícita (ADR-006). CSV e PDF são **responsabilidade nossa**. Nosso escopo pede "relatórios de auditoria exportáveis" — então gerar o arquivo é trabalho do frontend, e precisa entrar no backlog.

---

## O que sai daqui

| O quê | Onde | Quem |
|---|---|---|
| Itens do Bloco 1, transcritos como `acordado` | seção 5 de [architecture.md](architecture.md) | **André** |
| Decisões dos Blocos 2 e 3 | seção 5 de [architecture.md](architecture.md) + ADR se estrutural | **André** |
| Estratégia de mock derivada do `openapi.yaml` deles | ADR próprio | **André** |
| Lacunas do Bloco 2 que ficarem sem resposta | risco em [STATUS.md](../STATUS.md) e, se necessário, escalonamento aos organizadores | **Bruno** |
| Data do 3.4 | [STATUS.md](../STATUS.md) e issue [#11](https://github.com/labsitio/nexus-orc-web/issues/11) | **Bruno** |
| Resumo comentado | issue [#1](https://github.com/labsitio/nexus-orc-web/issues/1) | **Bruno** |
