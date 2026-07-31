# ADR-0006: Build, Deploy e Hospedagem das Interfaces Web

## Status

**Aceito** em 2026-07-31, na revisão do `qa-reviewer` (Bruno). Convenção dos ADRs 0001-0005: ratificado no merge, não deixado como "Proposto".

## Data

2026-07-31

## Autor(es)

André Luiz Ferreira (Frontend Architect & Stack)

---

## Contexto

O frontend do Nexo compreende **duas aplicações web distintas** ([ADR-0005](0005-estrategia-mock.md), `architecture.md` seção 1):

1. **Portal de Upload** (Fase 01) — interface pública para fornecedores enviarem orçamentos
2. **Painel do Gestor** (Fase 02/03) — dashboard interno autenticado para acompanhamento

Ambas consomem a mesma API REST do backend, mas com públicos, ciclos de vida e autenticação distintos. A Fase 01 tem entrega até 02/08; a Fase 02 pode ocorrer depois.

O escopo do CLAUDE.md seção 1.1 deixa claro que **build, deploy e hospedagem são responsabilidade desta equipe** — não são "infraestrutura do backend" como estava escrito errado antes. A seção 1.2.1 reforça: o entregável final é o projeto **rodando**, não apenas código.

A issue [#14](https://github.com/labsitio/nexus-orc-web/issues/14) requer decisão sobre:
- Como as duas aplicações são empacotadas (um repositório ou dois)
- Como são construídas (um build ou dois)
- Como são publicadas (um domínio ou dois)
- Como variáveis de ambiente e segredos são gerenciados

Referências:
- `docs/architecture.md` — duas aplicações, componentes, fluxo de dados
- `docs/engineering-principles.md` — stack: Next.js 14, React 18, TypeScript, Vitest
- `ADR-0004` — Stack decidida
- `ADR-0005` — Estratégia de mock
- Escopo sugerido: CloudFront + S3 (hospedagem)

---

## Decisão

**Build, deploy e hospedagem seguem modelo de monorepo com deployments independentes:**

1. **Repositório único** com estrutura `/apps/upload` e `/apps/dashboard`, compartilhando `shared/` (componentes, hooks, tipos comuns)

2. **Dois builds Next.js independentes** — um por aplicação, com configurações de build e otimizações específicas

3. **Dois workflows GitHub Actions** — `.github/workflows/deploy-upload.yml` e `.github/workflows/deploy-dashboard.yml` — cada qual acionado por mudanças no seu diretório (`/apps/upload/**` e `/apps/dashboard/**`)

4. **Dois S3 buckets + CloudFront distributions** — um por aplicação, para hospedagem estática + distribuição global

5. **Dois domínios** — `upload.nexo.dev` (Fase 01) e `dashboard.nexo.dev` (Fase 02+), com possibilidade de sufixos por ambiente (`staging`, `prod`)

6. **Variáveis de ambiente e segredos gerenciados por GitHub Secrets + GitHub Actions** — injetados em tempo de build, sem hardcode

7. **Autenticação com AWS via OIDC Provider** — GitHub Actions assume role AWS sem chaves salvas em repositório

---

## Alternativas Consideradas

| Alternativa | Prós | Contras | Motivo da rejeição |
|---|---|---|---|
| **Uma aplicação Next.js com rotas `/upload` e `/dashboard`** | Menos duplicação de código; um build e um deploy | Fase 01 fica bloqueada esperando Painel pronto; torna mais difícil divergências futuras de stack ou autenticação entre as duas | A separação física é mais valiosa que a economia de duplicação aqui; MVP da Fase 01 é ganho real em 02/08 |
| **Dois repositórios separados** (`nexus-orc-upload`, `nexus-orc-dashboard`) | Isolamento completo; deploy totalmente independente | Fragmenta CI/CD, versionamento, testes e convenções; duplica configuração de stack | Um monorepo com dois apps é meio termo melhor: isolamento lógico sem fragmentação operacional |
| **AppSync + GraphQL em lugar de API Gateway REST** | Subscriptions para real-time nativo | Já decidido em ADR-0004 que real-time será polling REST; muda tecnologia acordada | Não aplica; ADR-0004 é decisão anterior e aceita |
| **Um único S3 bucket com prefixos `/upload` e `/dashboard`** | Menos recursos AWS; configuração mais simples | Torna compartilhamento de políticas e invalidação de cache mais complexo; menos claro operacionalmente | Dois buckets são mais simples e claro; custo é negligenciável para MVP |

---

## Consequências

### Positivas

- **Fase 01 é independente:** Portal de Upload (Fase 01) pode sair em 02/08 sem depender do Painel (Fase 02). Ciclos de vida desacoplados.
- **Cada app com suas dependências e build:** Portal Upload pode ser mais simples (nenhuma autenticação complex); Painel pode ter features avançadas (busca, filtros, realtime polling) sem afetá-la.
- **Domínios claros:** `upload.nexo.dev` para fornecedor público, `dashboard.nexo.dev` para gestor interno — alinhado com públicos distintos.
- **Segurança em CI/CD:** OIDC com AWS elimina necessidade de chaves IAM em repositório.
- **Reutilização:** Componentes `shared/` (Button, Card, Form, hooks comuns) são compartilhados sem duplicação de código.

### Negativas / Trade-offs aceitos

- **Duplicação em GitHub Actions:** Dois workflows similares (`.github/workflows/deploy-*.yml`) — mantém sincronizados manualmente se padrão mudar.
  - *Mitigação:* Usar ações reutilizáveis (composite actions) em `.github/actions/` para lógica comum.
- **Monorepo pode crescer:** Se ambas crescerem exponencialmente, CI pode ficar lento (um change em `/apps/upload` roda testes de ambas por padrão).
  - *Mitigação:* Configurar CI jobs com `paths` para rodar testes apenas da app afetada (já proposto acima); reavalia se growth justificar divisão depois.
- **Configuração de ambiente duplicada:** Variáveis de cada app precisam ser registradas em GitHub Secrets separadamente.
  - *Mitigação:* Documentar em README a lista de variáveis por app; usar GitHub Environments para separar secrets por stage (dev, staging, prod).

---

## Impacto em Outros Documentos

- [x] `docs/architecture.md` — **Já atualizado** (seção 1: duas aplicações)
- [x] `docs/engineering-principles.md` — Sem impacto de decisão build/deploy aqui; stack já decidida em ADR-0004
- [ ] `docs/quality.md` — **Precisa atualizar:** seção sobre testes de CI/CD e coverage por app
- [ ] `STATUS.md` — **Obrigatório:** registrar ADR-0006 em "ADRs recentes" e marcar #14 como tendo registrada a decisão estrutural
- [ ] `README.md` — **Precisa criar/atualizar:** instruções de build local, deploy, variáveis por app
- [ ] `.github/workflows/` — **Precisa criar:** `deploy-upload.yml`, `deploy-dashboard.yml`, possível composite action `build-and-deploy/`

---

## Próximos Passos (Implementação)

1. **Issue #14** — implementar os workflows GitHub Actions, configuração de S3 + CloudFront, README com variáveis de ambiente
2. **Antes disso:** criar andaime Next.js (monorepo com `/apps/upload` e `/apps/dashboard`), `package.json` com scripts de build por app
3. **GitHub Secrets** — registrar variáveis de staging e prod (URLs de API, IDs de Cognito, etc.) — **sem valores hardcoded**
4. **Testes:** verificar que um `git push` na `main` dispara deploy automático e ambiente fica acessível

---

## Referências

- [Issue #14](https://github.com/labsitio/nexus-orc-web/issues/14) — Build, deploy e hospedagem
- [ADR-0004](0004-stack-frontend.md) — Stack decidida (Next.js, React, TypeScript)
- [ADR-0005](0005-estrategia-mock.md) — Estratégia de mock
- [`docs/architecture.md`](../architecture.md) — Arquitetura de duas aplicações
- [GitHub OIDC Provider com AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [AWS CloudFront + S3](https://aws.amazon.com/cloudfront/)
