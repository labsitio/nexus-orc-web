---
description: Identifica quem está usando e lista as responsabilidades, agentes e próximos passos da sua frente
allowed-tools: Bash(git config:*), Bash(whoami), Read, Glob, Grep
---

## Identidade desta máquina

- `git config user.name`: !`git config user.name`
- `git config user.email`: !`git config user.email`
- usuário do sistema: !`whoami`

## Sua tarefa

Descobrir qual frente a pessoa que está usando esta sessão ocupa, e dizer a ela exatamente o que precisa fazer.

**1. Identificar a frente.** Compare a identidade acima com a **Tabela de Identidades** em `docs/team-responsibilities.md`. Compare **por primeiro nome, ignorando acentos e diferença de maiúsculas** (`Andre`, `andré` e `André Luiz Ferreira` são a mesma pessoa). Se o `user.name` do Git não resolver, tente o e-mail e o usuário do sistema.

Se ainda assim não houver correspondência clara, **não escolha por eliminação nem assuma**: mostre a identidade encontrada, liste as frentes disponíveis e pergunte qual é a dela.

**2. Ler o necessário.** Da frente identificada, leia:
- `docs/team-responsibilities.md` — a seção dela, mais "Onde os Agentes Vivem", "Mapa de Donos por Documento" e "Kickoff"
- `STATUS.md` — próximas tasks, bloqueios e riscos
- `CLAUDE.md` — seções 1 a 1.3 e 3.1, se precisar de contexto de escopo

**3. Responder nesta ordem**, de forma direta e sem repetir os documentos por extenso:

1. **Quem você é e qual é sua frente** — uma linha, confirmando a identificação e como ela foi feita.
2. **Sua próxima ação concreta** — a primeira entrega do Kickoff da frente. Comece por aqui: é o que a pessoa quer saber.
3. **Seus documentos** — de quais arquivos ela é dona e de quais é suplente.
4. **Agentes que ela precisa criar** — nome, caminho do arquivo em `.claude/agents/` e o propósito de cada um.
5. **Tasks do STATUS.md que são dela** — apenas as da frente identificada, na ordem de prioridade do arquivo.
6. **Bloqueios e riscos que afetam a frente dela** — só os relevantes, dizendo se dependem dela ou de outra pessoa.
7. **O que NÃO é dela** — os documentos de outras frentes que ela não deve alterar, e a quem recorrer. Uma linha.

**4. Encerrar oferecendo o próximo passo.** Pergunte se quer começar pela próxima ação identificada.

## Regras

- Se algum documento citado não existir, diga qual falta em vez de inventar o conteúdo.
- Não altere nenhum arquivo neste comando: ele é somente leitura e orientação.
- Se a frente da pessoa tiver entregas já concluídas (visível no STATUS.md), não as repita como pendentes.
