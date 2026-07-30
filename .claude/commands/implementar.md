---
description: Implementa uma issue do backlog seguindo as convenções, com teste e PR — uso: /implementar 17
allowed-tools: Read, Glob, Grep, Edit, Write, Bash, mcp__github__issue_read, mcp__github__list_issues, mcp__github__create_pull_request, mcp__github__create_branch
---

## Issue solicitada

`$ARGUMENTS`

## Sua tarefa

Levar esta issue de descrição a Pull Request, seguindo as regras do projeto. **Não improvise o processo** — as etapas abaixo existem para que toda implementação saia consistente, independente de quem invocou.

### 1. Carregar contexto — nesta ordem, e só o necessário

1. **A issue** — leia pelo GitHub. Se o número não foi informado, liste as issues abertas e pergunte qual.
2. **`docs/engineering-principles.md`** — stack, convenções de código, organização de pastas, ferramenta de teste. É a fonte das regras de *como* escrever.
3. **`docs/architecture.md`** — apenas as seções relevantes à issue. Se a issue toca integração com backend, leia as seções 4 e 5 (fronteiras e contrato).
4. **`docs/quality.md`** — critérios de aceite e Definition of Done técnica.

Se algum desses documentos estiver vazio ou só com placeholders, **pare e diga qual falta**. Implementar sem convenção definida gera código que terá de ser reescrito — é uma Stop Condition (CLAUDE.md, seção 6).

### 2. Planejar antes de escrever

Antes de qualquer arquivo, apresente em poucas linhas:

- Os arquivos que serão criados ou alterados
- Os testes que serão escritos
- Qualquer decisão estrutural que a implementação exigir

**Se aparecer decisão estrutural não coberta por ADR** — biblioteca nova, padrão de estado, mudança de estrutura de pastas — pare e escale. Não decida em nome de André, que é o dono da arquitetura e da stack.

Aguarde confirmação antes de seguir.

### 3. Implementar

- Siga as convenções de `engineering-principles.md`. Elas ganham de preferência sua.
- **Escreva teste automatizado.** É requisito de avaliação do exercício (CLAUDE.md, seção 1.2), não escolha. Código sem teste não passa a Definition of Done.
- Contra o backend, use apenas endpoints que existem no [contrato deles](https://github.com/labsitio/nexus-orc-back/blob/main/docs/openapi.yaml). Campos marcados como PROVISÓRIO têm maior chance de mudar — isole-os.
- Nenhum segredo em código. Configuração vem de variável de ambiente.

### 4. Verificar antes de abrir o PR

Rode os testes e o build. Se falhar, corrija antes de prosseguir — não abra PR vermelho.

Confira, item por item:

- [ ] O escopo da issue foi atendido integralmente, ou o desvio está documentado
- [ ] Existe teste automatizado cobrindo a mudança, e a suíte passa
- [ ] As convenções de `engineering-principles.md` foram seguidas
- [ ] Critérios de aceite de `docs/quality.md` verificados
- [ ] Nenhuma decisão estrutural tomada sem ADR
- [ ] Nenhum segredo versionado

### 5. Abrir o Pull Request

- **Branch a partir da `main`**, seguindo a convenção do CLAUDE.md (seção 2): `<tipo>/<nº da issue>-<descrição-curta>`, com `tipo` em `feat|fix|docs|chore|test`. Exemplo: `feat/17-formulario-upload`. **Nunca commitar direto na `main`.**
- Preencha o `.github/PULL_REQUEST_TEMPLATE.md`, **inclusive o bloco "Para o STATUS.md"** — é como Bruno consolida o estado do projeto. Se não houver nada a registrar, escreva "nada a registrar".
- Referencie a issue com `Closes #N`.
- Se o PR toca documento de outra frente, diga isso em "Observações" — o CODEOWNERS vai exigir a revisão do dono.

## Regras

- **Não edite o `STATUS.md`.** Bruno é o escritor único (ADR-0002). Reporte pelo bloco no PR.
- Uma issue por PR. Se perceber que a issue é grande demais, diga e proponha a quebra em vez de entregar meia coisa.
- Se travar em ambiguidade real da issue — não em falta de busca —, pare e pergunte. A seção 6 do CLAUDE.md prefere a pergunta ao palpite.
