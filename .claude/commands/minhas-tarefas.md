---
description: Identifica quem está usando e lista as responsabilidades, agentes e próximos passos da sua frente
allowed-tools: Bash(git config:*), Bash(whoami), Read, Glob, Grep, mcp__github__list_issues, mcp__github__issue_read
---

## Identidade desta máquina

- `git config user.name`: !`git config user.name`
- `git config user.email`: !`git config user.email`
- usuário do sistema: !`whoami`

## Sua tarefa

Descobrir qual frente a pessoa que está usando esta sessão ocupa, e dizer a ela exatamente o que precisa fazer.

**1. Identificar a frente.** Compare a identidade acima com a **Tabela de Identidades** em `docs/team-responsibilities.md`. A coluna "Sinais de identificação" lista, para cada frente, variantes de nome, e-mails e o usuário do GitHub — **basta um sinal casar**. Compare ignorando acentos e diferença de maiúsculas (`Andre`, `andré` e `André Luiz Ferreira` são a mesma pessoa). Se o `user.name` do Git não resolver, tente o e-mail e o usuário do sistema.

Se ainda assim não houver correspondência clara, **não escolha por eliminação nem assuma**: mostre a identidade encontrada, liste as frentes disponíveis e pergunte qual é a dela.

**2. Ler o necessário.** Da frente identificada, leia:
- `docs/team-responsibilities.md` — a seção dela, mais "Onde os Agentes Vivem", "Mapa de Donos por Documento" e "Kickoff"
- `STATUS.md` — próximas tasks, bloqueios e riscos
- `CLAUDE.md` — seções 1 a 1.3 e 3.1, se precisar de contexto de escopo

**2.1. Buscar perguntas de outras equipes direcionadas a esta pessoa.** Liste as issues abertas de `labsitio/nexus-orc-web` com a label da frente identificada — `para:bruno`, `para:andre` ou `para:kassio`. São perguntas que o agente de Integração não conseguiu responder com o que está registrado e escalou para decisão humana (ver `docs/integracao-protocolo.md`).

Se a consulta ao GitHub falhar por falta de MCP configurado, **diga isso explicitamente** em vez de omitir a seção — do contrário a pessoa conclui que não há pendência quando pode haver. Aponte a issue [#9](https://github.com/labsitio/nexus-orc-web/issues/9) como o que resolve.

**3. Responder nesta ordem**, de forma direta e sem repetir os documentos por extenso:

1. **Quem você é e qual é sua frente** — uma linha, confirmando a identificação e como ela foi feita.
2. **Perguntas de outras equipes esperando você** — se houver alguma do passo 2.1, vem **antes de tudo**. Cada uma com: a pergunta, quem perguntou, o link da issue de origem e o que falta decidir. São bloqueio do outro lado: enquanto não respondidas, outra equipe está parada ou avançando com premissa errada. Se não houver, uma linha dizendo isso.
3. **Sua próxima ação concreta** — a primeira entrega do Kickoff da frente. Comece por aqui: é o que a pessoa quer saber.
4. **Seus documentos** — de quais arquivos ela é dona e de quais é suplente.
5. **Agentes que ela precisa criar** — nome, caminho do arquivo em `.claude/agents/` e o propósito de cada um.
6. **Tasks do STATUS.md que são dela** — apenas as da frente identificada, na ordem de prioridade do arquivo.
7. **Bloqueios e riscos que afetam a frente dela** — só os relevantes, dizendo se dependem dela ou de outra pessoa.
8. **O que NÃO é dela** — os documentos de outras frentes que ela não deve alterar, e a quem recorrer. Uma linha.

**4. Encerrar oferecendo o próximo passo.** Pergunte se quer começar pela próxima ação identificada.

## Regras

- Se algum documento citado não existir, diga qual falta em vez de inventar o conteúdo.
- Não altere nenhum arquivo neste comando: ele é somente leitura e orientação.
- Se a frente da pessoa tiver entregas já concluídas (visível no STATUS.md), não as repita como pendentes.
