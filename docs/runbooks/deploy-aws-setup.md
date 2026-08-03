# Runbook: Setup da conta AWS para deploy do frontend (S3 + CloudFront + OIDC)

> **Nada neste documento foi executado.** É o passo a passo operacional e
> manual que alguém com acesso real a uma conta AWS precisa seguir, uma única
> vez por ambiente, para que os workflows `.github/workflows/deploy-upload.yml`
> e `.github/workflows/deploy-dashboard.yml` (código já versionado) tenham
> onde publicar. Segue o mesmo precedente do time de backend: infraestrutura
> como código fica no repositório; execução real contra conta AWS fica em
> runbook, para ser rodada por quem tiver credenciais — não pelo agente.
>
> Nenhum destes comandos deve ser executado antes de existir uma conta AWS
> confirmada para o projeto (ver bloqueio em `STATUS.md` / issue #13).

Referências de decisão: [ADR-0006](../adr/0006-build-deploy-hospedagem.md),
[docs/engineering-principles.md](../engineering-principles.md).

---

## 0. Pré-requisitos

- Acesso a uma conta AWS real, com permissão para criar buckets S3,
  distribuições CloudFront, IAM roles/policies e um OIDC Identity Provider.
- AWS CLI configurado localmente com credenciais dessa conta (`aws configure`
  ou perfil nomeado).
- Confirmação de qual(is) ambiente(s) existir(ão) de fato — o texto abaixo
  assume um ambiente único (`prod`) por simplicidade; se houver `staging`,
  repita as seções 1–5 trocando o sufixo e registrando secrets adicionais
  (ver seção 6, "Múltiplos ambientes").
- Um repositório GitHub existente: `labsitio/nexus-orc-web`, branch `main`.

Nomes de bucket e domínios abaixo são **sugestões coerentes com o ADR-0006**
(`upload.nexo.dev`, `dashboard.nexo.dev`) — ajuste se o domínio real definido
for outro.

---

## 1. Criar os dois buckets S3

Um bucket por app, sem acesso público direto (o CloudFront acessa via Origin
Access Control, seção 2).

```bash
aws s3api create-bucket \
  --bucket nexo-web-upload-prod \
  --region us-east-1

aws s3api create-bucket \
  --bucket nexo-web-dashboard-prod \
  --region us-east-1
```

Bloquear acesso público em ambos:

```bash
aws s3api put-public-access-block \
  --bucket nexo-web-upload-prod \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

aws s3api put-public-access-block \
  --bucket nexo-web-dashboard-prod \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

---

## 2. Criar as duas distribuições CloudFront (com Origin Access Control)

Para cada bucket:

1. Criar um **Origin Access Control (OAC)** apontando para o bucket S3
   (console: CloudFront → Origin access control settings → Create).
2. Criar a distribuição CloudFront:
   - Origin: o bucket S3 correspondente, associado ao OAC criado.
   - Default root object: `index.html`.
   - Custom error responses: `403 → /index.html` (200) e `404 → /index.html`
     (200) — necessário porque o Next.js exporta rotas como arquivos
     estáticos e o roteamento client-side precisa cair em `index.html` em
     caminhos não encontrados diretamente no bucket.
   - Viewer protocol policy: redirect HTTP → HTTPS.
3. Depois de criada a distribuição, atualizar a **bucket policy** do S3 para
   permitir apenas o principal `cloudfront.amazonaws.com` com a distribuição
   como `SourceArn` (o console oferece essa policy automaticamente ao
   associar o OAC — copiar e aplicar via `aws s3api put-bucket-policy`).
4. (Opcional, se o domínio `nexo.dev` já estiver provisionado) Emitir um
   certificado ACM em `us-east-1` para `upload.nexo.dev` / `dashboard.nexo.dev`
   e associá-lo à distribuição, criando o registro DNS (Route 53 ou outro
   provedor) apontando para o domínio da distribuição CloudFront. Enquanto o
   domínio não estiver decidido, é aceitável publicar apenas no domínio
   padrão `*.cloudfront.net` e atualizar o README depois.

Anotar, para cada distribuição, o **Distribution ID** — vai para os secrets
na seção 5.

---

## 3. Criar o OIDC Identity Provider da AWS (se ainda não existir)

Verificar primeiro se já existe na conta (times de outras frentes do mesmo
projeto/organização podem já tê-lo criado):

```bash
aws iam list-open-id-connect-providers
```

Se não houver um provider para `token.actions.githubusercontent.com`, criar:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

(O thumbprint acima é o publicado pela GitHub/AWS para este provider; validar
o valor atual na documentação da AWS antes de usar, pois pode ser
substituído.)

---

## 4. Criar as duas IAM Roles que o GitHub Actions assume via OIDC

Uma role por app, cada uma restrita ao próprio bucket e à própria
distribuição — mesmo princípio de least privilege usado pelo backend nas
roles Lambda dele (nunca uma role ampla cobrindo os dois apps).

### 4.1. Trust policy (idêntica nas duas, ajustando o nome da role)

Restringe quem pode assumir a role: só o repositório
`labsitio/nexus-orc-web`, só a branch `main`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:labsitio/nexus-orc-web:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### 4.2. Permissions policy — role do Portal de Upload

Somente o bucket e a distribuição do upload:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::nexo-web-upload-prod",
        "arn:aws:s3:::nexo-web-upload-prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID_UPLOAD>"
    }
  ]
}
```

### 4.3. Permissions policy — role do Painel do Gestor

Mesma estrutura, trocando para o bucket e a distribuição do dashboard:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::nexo-web-dashboard-prod",
        "arn:aws:s3:::nexo-web-dashboard-prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID_DASHBOARD>"
    }
  ]
}
```

Nunca usar `s3:*` ou `cloudfront:*` amplo — cada role só enxerga o próprio
bucket e a própria distribuição.

Criar as roles (exemplo para a de upload; repetir para dashboard):

```bash
aws iam create-role \
  --role-name nexo-web-deploy-upload \
  --assume-role-policy-document file://trust-policy-upload.json

aws iam put-role-policy \
  --role-name nexo-web-deploy-upload \
  --policy-name nexo-web-deploy-upload-permissions \
  --policy-document file://permissions-upload.json
```

Anotar o **Role ARN** de cada uma — vai para os secrets na seção 5.

---

## 5. Registrar os secrets no GitHub

Em GitHub → repositório `nexus-orc-web` → Settings → Secrets and variables →
Actions → New repository secret. Nomes **exatos** esperados pelos workflows
já versionados (`.github/workflows/deploy-upload.yml` e
`deploy-dashboard.yml`):

| Secret | Valor |
|---|---|
| `AWS_DEPLOY_ROLE_ARN_UPLOAD` | ARN da role IAM do Portal de Upload (seção 4.2) |
| `AWS_DEPLOY_ROLE_ARN_DASHBOARD` | ARN da role IAM do Painel do Gestor (seção 4.3) |
| `AWS_S3_BUCKET_UPLOAD` | Nome do bucket do Portal de Upload (ex: `nexo-web-upload-prod`) |
| `AWS_S3_BUCKET_DASHBOARD` | Nome do bucket do Painel do Gestor (ex: `nexo-web-dashboard-prod`) |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID_UPLOAD` | Distribution ID da distribuição do upload |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID_DASHBOARD` | Distribution ID da distribuição do dashboard |
| `AWS_REGION` | Região usada pelo AWS CLI dentro do workflow (ex: `us-east-1`) |

Depois de registrados, a etapa "Configurar credenciais AWS via OIDC" de cada
workflow deixa de ser um placeholder e passa a assumir a role real.

---

## 6. Múltiplos ambientes (se necessário)

Se `staging` e `prod` coexistirem (a confirmar — ver issue #13 e bloqueio em
`STATUS.md`), repetir as seções 1–5 por ambiente e usar
[GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
para manter os dois conjuntos de secrets isolados, em vez de sufixar todos os
nomes de secret manualmente. Isso é mudança nos workflows (`environment:` por
job) e fica fora desta entrega — registrar como task própria se/quando os
ambientes forem confirmados.

---

## 7. Validação depois de configurado

Só é possível depois que a issue #35 (andaime Next.js, `apps/upload` e
`apps/dashboard`) existir:

1. Fazer um `git push` na `main` alterando algo em `apps/upload/**` (ou
   `apps/dashboard/**`).
2. Confirmar no GitHub Actions que o workflow correspondente roda e termina
   verde.
3. Abrir a URL do CloudFront (ou o domínio customizado, se configurado) e
   confirmar que o conteúdo publicado é o esperado.
4. Registrar a URL resultante no `README.md` (seção "URL do ambiente") — essa
   edição é do dono do README (Bruno), coordenar antes de alterar.
