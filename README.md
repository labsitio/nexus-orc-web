# Nexo — Interfaces Web

Repositório da equipe de **frontend** do projeto Nexo. Contém as interfaces web da plataforma e a documentação de governança que orienta os agentes de desenvolvimento da equipe.

> **Stack:** TypeScript, Next.js 14 (App Router) + React 18, Vitest + React Testing Library, Tailwind CSS, hospedagem em CloudFront + S3. Decidida no [ADR-0004](docs/adr/0004-stack-frontend.md); a organização em monorepo de dois apps vem do [ADR-0006](docs/adr/0006-build-deploy-hospedagem.md). Convenções em [docs/engineering-principles.md](docs/engineering-principles.md).

> **O entregável é software funcionando.** O Nexo é um projeto real, com utilização prevista pelos organizadores. A prática com agentes é o método; o resultado esperado é a aplicação rodando, publicada e navegável — ver a Definition of Done de projeto no [CLAUDE.md](CLAUDE.md), seção 1.2.1.

## URL do ambiente

| Aplicação | URL |
|---|---|
| Portal de upload (`apps/upload`) | **não publicada** |
| Painel do gestor (`apps/dashboard`) | **não publicada** |

**Limitação declarada, e o que falta.** Os workflows de deploy existem e estão versionados
(`.github/workflows/deploy-upload.yml` e `deploy-dashboard.yml`), e os dois apps buildam como
site estático (`output: 'export'`). O que não existe é o **destino**: bucket S3, distribuição
CloudFront, role IAM e os secrets do repositório. O passo a passo está pronto em
[docs/runbooks/deploy-aws-setup.md](docs/runbooks/deploy-aws-setup.md) e **nada dele foi
executado**, porque depende de uma conta AWS confirmada para o projeto — o que está fora do
alcance desta equipe. Acompanhado em [#14](https://github.com/labsitio/nexus-orc-web/issues/14).

Enquanto isso, o caminho para ver as duas aplicações rodando é local, e está na seção abaixo.

---

## O que é o Nexo

Plataforma de dados para redes varejistas, construída do zero e nativa em AWS, que recebe orçamentos enviados por fornecedores por quatro canais (portal web, API REST, SFTP e app mobile) e os processa automaticamente com agentes de IA sobre Amazon Bedrock — identificando fornecedor e formato, extraindo itens, preços e condições, validando consistência e indexando para busca semântica.

O projeto é conduzido por **três equipes em paralelo**, uma por plataforma:

| Equipe | Repositório |
|---|---|
| Backend | [nexus-orc-back](https://github.com/labsitio/nexus-orc-back) |
| **Frontend (este)** | [nexus-orc-web](https://github.com/labsitio/nexus-orc-web) |
| Mobile | [nexus-orc-mobile](https://github.com/labsitio/nexus-orc-mobile) |

## Escopo deste repositório

As duas interfaces web do produto:

1. **Portal Web de Acompanhamento (Painel do Gestor)** — acompanhamento do ciclo de vida de cada orçamento, com status em tempo real, alertas, busca, filtros e exportação de relatórios de auditoria.
2. **Portal web de upload** — envio manual de orçamento pelo fornecedor sem integração automatizada.

São dois produtos distintos no mesmo repositório: públicos diferentes, fases diferentes do roadmap e modelos de autenticação provavelmente diferentes.

---

## Como rodar localmente

**Pré-requisito:** Node.js 20 ou superior (o CI usa a 22) e o `npm` que vem com ele. Nada além disso — não é preciso conta AWS, credencial nem serviço externo, porque o frontend roda contra mock (ver [Mock e troca pela API real](#mock-e-troca-pela-api-real)).

O repositório é um **monorepo com npm workspaces**: um único `package-lock.json` na raiz cobre os dois apps e o `shared/`. Instale uma vez, na raiz:

```bash
npm ci
```

> `npm ci` (não `npm install`) é o comando certo aqui: ele instala exatamente o que está no lockfile.

### Subir cada aplicação

Cada app sobe em porta própria, e são independentes: dá para rodar um, o outro, ou os dois ao mesmo tempo em terminais separados.

| Aplicação | Comando | Endereço |
|---|---|---|
| Portal de upload do fornecedor | `npm run dev --workspace=apps/upload` | http://localhost:3000 |
| Painel do gestor | `npm run dev --workspace=apps/dashboard` | http://localhost:3001 |

**O que já dá para ver no navegador, dito com precisão.** No portal de upload: o formulário de envio, com validação de CNPJ/CPF, contato e arquivo acontecendo no navegador, e o tratamento de erro do formato do backend. **O envio em si ainda não sai da tela** — a chamada HTTP de duas etapas é a [#40](https://github.com/labsitio/nexus-orc-web/issues/40), em aberto, então clicar em "Enviar orçamento" com o formulário válido apenas marca o botão como "Enviando..." e para ali. Não há requisição, nem protocolo de confirmação. A tela de confirmação de envio existe como componente testado desde a [#41](https://github.com/labsitio/nexus-orc-web/issues/41) (`ConfirmacaoEnvio.tsx`), mas só aparece quando a #40 a ligar ao formulário — hoje a página monta `UploadForm` sem `onSubmit`. O painel do gestor tem apenas o andaime e a página inicial; as telas de acompanhamento são Fase 02 — ver [#43](https://github.com/labsitio/nexus-orc-web/issues/43).

Ou seja: o item "fluxo principal navegável de ponta a ponta" da Definition of Done de projeto (**[CLAUDE.md](CLAUDE.md), seção 1.2.1**) **não está cumprido**, e a lacuna é a #40 — não o deploy.

### Rodar os testes

O Vitest roda em **modo watch por padrão**. Para uma execução única, que é o que serve para verificar a entrega, passe `--run`:

```bash
npm run test --workspace=apps/upload -- --run
npm run test --workspace=apps/dashboard -- --run
```

Os testes de governança do repositório usam `node:test` e não dependem de instalação nenhuma:

```bash
node --test scripts/check-docs.test.mjs scripts/check-readme.test.mjs
node scripts/check-docs.mjs
```

### Gerar o build de produção

```bash
npm run build --workspace=apps/upload
npm run build --workspace=apps/dashboard
```

Cada app é exportado como site estático (`output: 'export'`, conforme o [ADR-0006](docs/adr/0006-build-deploy-hospedagem.md)) na própria pasta `out/` — é esse diretório que os workflows de deploy publicam no S3.

---

## Variáveis de ambiente

**Nenhuma variável é necessária para rodar localmente.** Vale registrar por que, para ninguém procurar um `.env` que não existe: o app em execução não chama API nenhuma ainda (ver a #40 acima), e o mock — que é servido por MSW **apenas sob os testes**, via `msw/node`, não no navegador — atende em caminho relativo (`/v1`), sem host externo.

Duas famílias de variáveis existem no projeto, e elas não se confundem:

**1. Execução da aplicação** — reservada, ainda não consumida por código de app:

| Nome | Aplicação | O que significa |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | upload, dashboard | URL base da API do backend. É o ponto único de troca do mock pela API real (ver [#15](https://github.com/labsitio/nexus-orc-web/issues/15)). Enquanto não existir API consumível, o mock ignora esta variável e usa `/v1` |

**2. Publicação (CI/CD)** — são **secrets do repositório no GitHub**, lidos pelos workflows de deploy. Não vão para `.env`, não são usados em desenvolvimento e nenhum valor real aparece neste repositório: `AWS_DEPLOY_ROLE_ARN_UPLOAD`, `AWS_DEPLOY_ROLE_ARN_DASHBOARD`, `AWS_S3_BUCKET_UPLOAD`, `AWS_S3_BUCKET_DASHBOARD`, `AWS_CLOUDFRONT_DISTRIBUTION_ID_UPLOAD`, `AWS_CLOUDFRONT_DISTRIBUTION_ID_DASHBOARD` e `AWS_REGION`. O significado de cada um e como obtê-los está em [docs/runbooks/deploy-aws-setup.md](docs/runbooks/deploy-aws-setup.md), seção 5.

Também existe o `GITHUB_MCP_PAT`, que é da **sua máquina** e não da aplicação — ver [Integração com o GitHub via MCP](#integração-com-o-github-via-mcp). Segredo nunca é versionado: sempre variável de ambiente ou secret do GitHub.

---

## Dado de demonstração

Entregue pela [#50](https://github.com/labsitio/nexus-orc-web/issues/50). Não é preciso semear banco nem rodar script — o dado existe em duas formas, com finalidades que não se confundem:

| Onde | O que é | Para que serve |
|---|---|---|
| [`apps/upload/demo-data/`](apps/upload/demo-data/) | `orcamento-exemplo.pdf` e `dados-formulario-exemplo.json` (CNPJ fictício, contato, referência) | Preencher e enviar o formulário **no navegador**, durante a demonstração. Ver o [README do diretório](apps/upload/demo-data/README.md) para os três cenários — sucesso, erro 400 e erro 404 |
| `apps/upload/src/test/mocks.ts` | Fixtures determinísticas do mock: a mesma chamada devolve sempre a mesma resposta, com `orcamentoId` fixo | Alimenta a **suíte de testes**, não a aplicação no navegador |

Um teste (`apps/upload/demo-data/demo-data.test.ts`) submete o dado de demonstração às mesmas validações do formulário real: se alguém o remover ou invalidar, a suíte falha.

Enquanto a #40 não fechar, o que se demonstra no navegador é o preenchimento e a validação — o envio para ali (ver acima). A evidência de que o contrato do backend é atendido está nos testes (`npm run test --workspace=apps/upload -- --run`).

## Mock e troca pela API real

O frontend **não é exercitado contra o backend real** — decisão registrada no [ADR-0005](docs/adr/0005-estrategia-mock.md). O mock não é invenção nossa: deriva do `openapi.yaml` publicado pelo backend, e os campos que eles marcam como PROVISÓRIO ficam concentrados no bloco `FIXTURES` de `apps/upload/src/test/mocks.ts`.

**Concentrados, não isolados** — a diferença importa para quem for plugar a API real: o shape PROVISÓRIO de `POST /orcamentos/upload-url` aparece hoje em três pontos (o bloco de fixtures, o tipo `GerarUploadUrlRequest` em `apps/upload/src/types/upload.ts` e a montagem do payload em `UploadForm.tsx`). Uma mudança de shape do lado deles alcança os três. Reduzir isso a um ponto único é trabalho a fazer, não estado atual.

O plano de troca pela API real, com data, é a [#15](https://github.com/labsitio/nexus-orc-web/issues/15) — em aberto. O ponto de troca previsto é a variável `NEXT_PUBLIC_API_BASE_URL` da tabela acima.

---

## Por onde começar

1. Leia o [CLAUDE.md](CLAUDE.md), seções 1 a 1.3 — escopo, critérios de avaliação e o aviso sobre os **dois sentidos de "agente"** neste projeto (os 5 agentes de IA do produto são do backend; os 5 agentes de desenvolvimento são a ferramenta desta equipe).
2. Leia o [STATUS.md](STATUS.md) para saber o estado presente, os bloqueios e os riscos.
3. Rode `/minhas-tarefas` — o comando identifica você pela identidade do Git e lista sua frente, próxima ação, documentos, agentes a criar e tasks. Ver [docs/team-responsibilities.md](docs/team-responsibilities.md).

## Comandos da equipe

| Comando | O que faz |
|---|---|
| `/minhas-tarefas` | Identifica você pela identidade do Git e lista sua frente, próxima ação, documentos, agentes a criar e tasks |
| `/implementar <nº da issue>` | Leva uma issue de descrição a Pull Request seguindo as convenções: carrega o contexto necessário, exige plano antes do código, obriga teste automatizado e preenche o template de PR |

Os dois são versionados em `.claude/commands/`, então valem para todo mundo depois de um `git pull`.

### Sincronização com a main

Ao abrir o Claude Code na pasta do repositório, um hook verifica se a `main` do remoto tem commit novo e avisa. **Não altera nada por conta própria** — oferece atualizar.

Se você quiser que a atualização seja automática, defina uma variável de ambiente uma única vez:

```
setx NEXO_AUTO_SYNC sempre
```

Mesmo nesse modo, a atualização só acontece quando é **segura**: estando na `main`, com a árvore de trabalho limpa e sendo fast-forward. Numa branch de trabalho o hook sempre só avisa, porque trazer a main para dentro dela é merge ou rebase — pode dar conflito ou reescrever commit, e isso exige sua decisão.

### Proteção da branch main

Todo trabalho entra por Pull Request. Além da regra no [CLAUDE.md](CLAUDE.md) (seção 2), há duas camadas:

1. **Proteção no GitHub** — bloqueio no servidor, exige `admin` no repositório para ser configurada. Ver [#10](https://github.com/labsitio/nexus-orc-web/issues/10).
2. **Hook local `pre-push`** — versionado em `.githooks/`, funciona sem permissão nenhuma. **Ative uma vez por máquina:**

```bash
git config core.hooksPath .githooks
```

O hook recusa push direto na `main` e mostra os comandos para mover o trabalho para uma branch. É proteção do lado do cliente, contornável com `--no-verify` — e isso é intencional: o objetivo é impedir quem empurra na main **sem perceber**, não quem decide fazê-lo.

### Verificação de consistência

Roda no CI a cada Pull Request:

```bash
node scripts/check-docs.mjs
```

Acusa link quebrado, referência a seção inexistente do CLAUDE.md, termo legado de renomeação e segredo versionado. Avisa — sem bloquear — sobre campos ainda `a preencher` e ADRs em estado *Proposto*.

## Integração com o GitHub via MCP

Não é necessária para começar a trabalhar — só para os agentes operarem issues e pull requests sozinhos. Enquanto não estiver configurada, o backlog é mantido manualmente pelo navegador.

O `.mcp.json` deste repositório já define o servidor. O que falta é **cada integrante criar o seu próprio token**, porque o OAuth automático não funciona com este servidor: ele não suporta *dynamic client registration*, e a autenticação falha com `Incompatible auth server: does not support dynamic client registration`.

**1. Criar um Personal Access Token (classic)** em GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token (classic):

| Campo | Valor |
|---|---|
| Note | `nexo-mcp` (ou outro nome que você reconheça depois) |
| Expiration | até o fim do exercício — evite "No expiration" |
| Escopo `repo` | **marcar** — é o único obrigatório; cobre issues e pull requests em repositório privado |
| Escopo `read:project` | marcar **se** o backlog usar GitHub Projects (ver CLAUDE.md, seção 9). Fica aninhado sob `project` |

Nenhum outro escopo é necessário. Em particular:

- **`read:org` não é preciso** para o nosso uso. Ele só habilita ferramentas que leem membros e equipes da organização. Está aninhado sob `admin:org` → `write:org` → `read:org`, caso venha a ser necessário.
- **Não marque** `delete_repo`, `admin:*`, `workflow` nem `admin:repo_hook`. O MCP não usa e são escopos destrutivos ou de alto privilégio.

> **Por que classic e não fine-grained.** O token fine-grained é mais restrito e seria preferível, mas sobre repositório de organização ele costuma exigir **aprovação de um admin** da `labsitio` antes de funcionar, o que travaria o onboarding. O custo de usar classic é que o escopo `repo` dá acesso a **todos** os repositórios que a sua conta alcança, não só ao `nexus-orc-web` — então trate o token como credencial sensível e defina uma data de expiração. Se preferir o caminho restrito, o fine-grained equivalente é: Resource owner `labsitio`, apenas o repo `nexus-orc-web`, com Metadata (read), Contents (read), Issues (read/write) e Pull requests (read/write).

**2. Definir a variável de ambiente** no seu terminal (Windows):

```
setx GITHUB_MCP_PAT "cole-seu-token-aqui"
```

Feche e reabra o terminal e o Claude Code — variáveis definidas com `setx` só valem para processos novos.

**Nunca** cole o token em chat, issue, PR ou arquivo do repositório. A variável de ambiente existe exatamente para ele não precisar ser escrito em lugar nenhum versionado.

**3. Aprovar o servidor do projeto.** Na primeira vez, o servidor definido pelo `.mcp.json` fica como `Pending approval` — é proteção do Claude Code contra repositório injetar servidor arbitrário. A aprovação só acontece numa **sessão interativa de terminal**, não pelo painel do app. Em um terminal do Windows, na pasta do repositório:

```
claude
```

Aprove o servidor quando ele perguntar, e feche.

**4. Verificar:**

```
claude mcp list
```

A linha do `github` deve aparecer como `√ Connected`.

### Armadilhas conhecidas

Todas já enfrentadas e resolvidas — se você travar, provavelmente é uma destas:

| Sintoma | Causa | Solução |
|---|---|---|
| `SDK auth failed: Incompatible auth server: does not support dynamic client registration` | O servidor não suporta o OAuth automático do Claude Code | É esperado. Use token, como descrito acima — não insista no OAuth |
| `Connected` no terminal, mas as ferramentas não aparecem no app | `setx` só afeta processos criados depois dele | Feche e reabra o Claude Code |
| `Pending approval` que não sai | O painel de MCP do app não consegue aprovar servidor de projeto | Rode `claude` num terminal interativo e aprove por lá |
| Existem dois `/mcp` no menu | Um é para **connectors** da conta claude.ai, outro para **servers** de projeto | O nosso é o de **servers** |
| `/mcp reconnect github` responde que o comando não existe | Fora do terminal, o `/mcp` não aceita nome de servidor | Use `/mcp` sem argumento, ou o terminal |
| `remote: Repository not found` no `git push` | O Git está usando outra conta sua que ficou em cache no Windows Credential Manager. O GitHub responde 404 (não 403) para repo privado sem permissão, o que engana | `git config credential.https://github.com.username SEU-USUARIO` |

---

## Mapa da documentação

| Documento | Conteúdo |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Governança: fluxo de trabalho, Definition of Done, stop conditions, regras de ADR |
| [STATUS.md](STATUS.md) | Estado presente do projeto — feature e task atuais, bloqueios, riscos |
| [docs/team-responsibilities.md](docs/team-responsibilities.md) | Divisão entre os integrantes, donos de cada documento e agentes a criar |
| [docs/architecture.md](docs/architecture.md) | Arquitetura das interfaces web, fronteiras e contrato de integração |
| [docs/engineering-principles.md](docs/engineering-principles.md) | Stack, bibliotecas e convenções de código |
| [docs/quality.md](docs/quality.md) | Critérios de aceite, Definition of Done técnica e checklist de revisão |
| [docs/planning.md](docs/planning.md) | Processo de planejamento e fluxo do backlog |
| [docs/contrato-integracao-pauta.md](docs/contrato-integracao-pauta.md) | Pauta e registro do contrato acordado com a equipe de backend |
| [docs/integracao-protocolo.md](docs/integracao-protocolo.md) | Como as três equipes trocam perguntas por issue e label, e como pergunta sem resposta chega à pessoa certa |
| [docs/adr/](docs/adr/) | Architecture Decision Records |
| [escopo/](escopo/) | Documentos de escopo recebidos dos organizadores — fonte do escopo |

## Regras que valem para todos

- Toda task relevante existe como **issue no GitHub** antes de ser iniciada.
- Toda decisão estrutural e dificilmente reversível vira **ADR** antes de ser implementada.
- Todo documento tem **dono único** e suplente — ver o mapa em `docs/team-responsibilities.md`.
- Trabalho em **branch + Pull Request**, nunca push direto na `main`: o PR é onde a revisão de qualidade acontece.
- **Teste automatizado é obrigatório** no Definition of Done — é critério de avaliação do exercício.
