# Nexo — Interfaces Web

Repositório da equipe de **frontend** do projeto Nexo. Contém as interfaces web da plataforma e a documentação de governança que orienta os agentes de desenvolvimento da equipe.

> **Nenhuma tecnologia ou stack foi definida ainda.** Essa é uma decisão da equipe, a ser registrada em ADR antes de qualquer implementação. Ver [docs/engineering-principles.md](docs/engineering-principles.md).

> **O entregável é software funcionando.** O Nexo é um projeto real, com utilização prevista pelos organizadores. A prática com agentes é o método; o resultado esperado é a aplicação rodando, publicada e navegável — ver a Definition of Done de projeto no [CLAUDE.md](CLAUDE.md), seção 1.2.1.

**URL do ambiente:** _(a definir — ver [#14](https://github.com/labsitio/nexus-orc-web/issues/14))_

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
