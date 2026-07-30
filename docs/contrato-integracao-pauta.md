# Pauta — Contrato de integração com o time de backend

**Issue:** [#1](https://github.com/labsitio/nexus-orc-web/issues/1) · **Responsável:** Bruno Martins · **Data da reunião:** \_\_\_\_ / \_\_\_\_

> **Como usar.** Cada item tem o que precisa ser decidido, a proposta do frontend e por que importa. Preencha a linha **Acordado** durante a conversa. O que sair daqui é transcrito para a seção 5 de [architecture.md](architecture.md) com status `acordado`; o que não fechar volta como `premissa` **com nome e data**, nunca em branco.
>
> **Participam pelo frontend:** Bruno Martins (Tech Lead) e André Luiz Ferreira (Frontend Architect). As propostas abaixo são ponto de partida para agilizar a conversa — André é o responsável técnico pelo contrato e pode confirmá-las ou substituí-las na própria reunião.
>
> **Divisão sugerida na sala:** Bruno conduz a pauta e André decide o conteúdo técnico. Uma pessoa fala, a outra preenche as linhas **Acordado** — se as duas conduzirem, o registro é o que se perde. Ao final, quem registrou envia o documento preenchido para os dois lados.

---

## Por que esta conversa existe

As três equipes recebem o mesmo documento de escopo e trabalham em paralelo, integrando no final. Escopo idêntico garante que cheguemos às mesmas **entidades** — não aos mesmos **detalhes**. Nenhum dos itens abaixo está nos documentos de escopo, e todos quebram integração se ficarem implícitos.

O objetivo não é fechar a API inteira. É fechar o suficiente para o frontend **mockar dados com fidelidade** e não descobrir divergência no dia da integração.

---

## Bloco A — Contrato de dados

### 1. Casing dos campos

- **Decidir:** `camelCase` ou `snake_case` no JSON — e valer para tudo.
- **Proposta:** `camelCase`. O frontend é JS/TS e evita uma camada de mapeamento em cada resposta. Se o backend padronizar `snake_case` por convenção da linguagem, aceitamos — o que não podemos é misturar.
- **Por que importa:** custo baixo de decidir, custo alto de descobrir tarde. Mistura obriga mapeamento manual campo a campo.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 2. Datas e timezone

- **Decidir:** formato e fuso de todo campo de data/hora.
- **Proposta:** ISO 8601 sempre em **UTC com sufixo `Z`** (`2026-07-30T14:32:10Z`). O frontend converte para o fuso do usuário na exibição.
- **Por que importa:** o painel do gestor mostra o timestamp de cada etapa do pipeline. Hora local sem offset torna impossível ordenar eventos de forma confiável.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 3. Enums — tipo e valores

- **Decidir:** enums como string ou inteiro, e a **lista completa** de valores possíveis.
- **Proposta:** string em maiúsculas (`AGUARDANDO_VALIDACAO`), nunca inteiro. Inteiro é ilegível em log e quebra silenciosamente se a ordem mudar.
- **Também precisamos:** a regra para valor desconhecido. Se o backend adicionar um status novo, o frontend não pode quebrar — proposta é renderizar genérico e registrar aviso.
- **Por que importa:** o painel renderiza status, alertas e filtros a partir desses valores.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4. Lista canônica de status do pipeline

- **Decidir:** os valores exatos e a ordem das etapas.
- **Contexto:** o escopo descreve `recebido → fornecedor/formato identificado → extraído → validado → indexado → disponível/arquivado`, mas em prosa. Precisamos dos identificadores literais.
- **Também precisamos:** quais etapas podem ser puladas, quais podem retroceder (exceção volta para revisão manual) e o que é estado terminal.
- **Por que importa:** é a espinha dorsal da tela principal do painel. Sem isso não há timeline.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 5. Paginação

- **Decidir:** `page`/`size` ou cursor.
- **Proposta:** **cursor**, com `pageSize` na requisição e `nextCursor` + `hasNextPage` na resposta.
- **Por que importa:** o acervo cresce e recebe inserções continuamente. Paginação por offset desloca itens entre páginas quando algo é inserido durante a navegação — o gestor veria orçamento repetido ou perderia um.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 6. Envelope da resposta

- **Decidir:** dado cru ou envelopado.
- **Proposta:** coleções em `{ data: [...], meta: { pagination } }`; recurso único como objeto direto. O importante é ser **consistente** — qualquer das duas serve se valer para tudo.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 7. Formato de erro

- **Decidir:** shape do erro e catálogo de códigos.
- **Proposta:** `{ code, message, details?, traceId }`, onde:
  - **`code`** é string estável e legível por máquina (`ORCAMENTO_NAO_ENCONTRADO`). O frontend **não pode** decidir comportamento lendo `message`.
  - **`message`** é para humano e pode mudar sem aviso.
  - **`traceId`** correlaciona com a observabilidade do pipeline (CloudWatch/X-Ray) — é o que permite o gestor abrir um chamado com algo rastreável.
- **Por que importa:** é o item mais esquecido nessas conversas e o que gera mais retrabalho. Sem `code` estável, o frontend acaba comparando texto de mensagem, que quebra na primeira revisão de copy.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 8. Autenticação

- **Decidir:** fluxo, tempo de vida do token e renovação.
- **Contexto que muda a resposta:** temos **dois produtos web com públicos diferentes** — o portal de upload é usado por **fornecedor externo**, e o painel por **gestor interno**. Provavelmente não é o mesmo pool nem o mesmo conjunto de permissões.
- **Decidir explicitamente:** é o mesmo Cognito User Pool com grupos distintos, ou pools separados? Qual o tempo de vida do access token e como é o refresh?
- **Por que importa:** define se são duas aplicações com autenticação separada ou uma com autorização por papel. Muda a arquitetura, não só a tela de login.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 9. Nulabilidade e campos por etapa

- **Decidir:** campo ausente vem como `null` ou é omitido? E **quais campos são garantidos em cada etapa** do pipeline?
- **Proposta:** `null` explícito para ausência conhecida; nunca omitir a chave.
- **Por que importa:** este é sutil e importante. Um orçamento recém-recebido **ainda não tem itens extraídos nem fornecedor identificado**. O frontend precisa saber, por etapa, o que já existe — senão trata dado ausente como erro.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 10. Tipo de identificador

- **Decidir:** int sequencial ou UUID.
- **Proposta:** UUID em string. Precisamos também confirmar que o **id do orçamento é o mesmo** usado como chave de correlação nos eventos e na trilha de auditoria — o escopo fala em correlacionar tudo por identificador de documento.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Bloco B — Status em tempo real

**É o item mais importante da reunião.** O escopo exige status em tempo real e alertas no painel, mas não diz por qual mecanismo. É a decisão mais acoplada entre as duas equipes e a que menos dá para contornar depois.

### 11. Mecanismo de atualização

- **Opções:**
  - **Polling** — simples, funciona com qualquer API REST, custa requisições e tem latência.
  - **Subscription (AppSync/GraphQL sobre WebSocket)** — o escopo menciona AppSync na camada do portal, o que sugere ser o caminho pretendido.
  - **SSE** — meio-caminho, unidirecional.
- **Proposta:** subscription, se o backend já for expor AppSync. Caso contrário, polling com intervalo acordado — e o contrato precisa então prever um endpoint de "mudanças desde X" para não relistar tudo.
- **Decidir também:**
  - Quais eventos são publicados e com que granularidade — cada etapa do pipeline gera evento, ou só mudanças de status relevantes?
  - O que o evento carrega: só o id (e o frontend rebusca) ou o estado completo?
  - Comportamento quando a conexão cai — o frontend precisa reconciliar. Existe forma de pedir o estado atual de um conjunto de orçamentos?
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Bloco C — Operacional

### 12. Fonte da verdade do contrato

- **Decidir:** onde vive a especificação — OpenAPI, schema GraphQL, outro? Quem publica e onde o frontend consome?
- **Por que importa:** se cada lado mantiver a sua versão, divergem. O mock do frontend deveria derivar da mesma fonte que o backend implementa.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 13. Versionamento e mudança de contrato

- **Decidir:** como o contrato evolui sem quebrar quem já consome, e como a mudança é comunicada.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 14. Ambientes, URL base e CORS

- **Decidir:** quais ambientes existirão, as URLs base de cada um, e se o CORS já contempla a origem do frontend.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 15. Quando existe algo consumível

- **Decidir:** a data em que o backend terá **qualquer coisa** respondendo — ainda que stub com dado fixo.
- **Por que importa:** define até quando o frontend depende inteiramente de mock e qual é a janela real de integração. É a pergunta mais útil da reunião para planejamento.
- **Acordado:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Fora do escopo desta conversa

Para não alongar a reunião — são decisões de outra equipe ou de outro momento:

- Modelagem interna de dados do backend, orquestração do pipeline e prompts dos agentes de IA do produto.
- Escolha de stack do frontend — decisão nossa, registrada em ADR ([#2](https://github.com/labsitio/nexus-orc-web/issues/2)).
- Contrato do aplicativo mobile — é da equipe de [nexus-orc-mobile](https://github.com/labsitio/nexus-orc-mobile). **Vale apenas verificar** se o app e o painel compartilham vocabulário de status e o mesmo pool de autenticação; se sim, a decisão do item 8 afeta as três equipes.

---

## O que sai daqui

Com atenção a quem faz cada coisa, porque os documentos têm donos distintos:

| O quê | Onde | Quem |
|---|---|---|
| Itens fechados, com status `acordado` | seção 5 de [architecture.md](architecture.md) | **André** — é dono do documento |
| Itens abertos, como `premissa` com responsável e data | seção 5 de [architecture.md](architecture.md) | **André** |
| Decisões estruturais que saírem da conversa | ADR novo, a partir de `0003` | **André** |
| Data do item 15 e riscos que surgirem | [STATUS.md](../STATUS.md) | **Bruno** — escritor único (ADR-0002) |
| Datas de referência das entregas | issue [#11](https://github.com/labsitio/nexus-orc-web/issues/11) | **Bruno** |
| Resumo comentado, com link para o registro do lado do backend | issue [#1](https://github.com/labsitio/nexus-orc-web/issues/1) | **Bruno** |

**Uma ressalva sobre a stack.** Se o backend confirmar AppSync/GraphQL, isso passa a ser **entrada** para a decisão de stack do frontend ([#2](https://github.com/labsitio/nexus-orc-web/issues/2)) — não a decide. A escolha continua sendo nossa e exige ADR próprio, com as alternativas consideradas. Evitar sair da reunião com stack "decidida de fato" sem registro.
