# Nexo — Interfaces Web

Repositório da equipe de **frontend** do projeto Nexo. Contém as interfaces web da plataforma e a documentação de governança que orienta os agentes de desenvolvimento da equipe.

> **Nenhuma tecnologia ou stack foi definida ainda.** Essa é uma decisão da equipe, a ser registrada em ADR antes de qualquer implementação. Ver [docs/engineering-principles.md](docs/engineering-principles.md).

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
| [docs/adr/](docs/adr/) | Architecture Decision Records |
| [escopo/](escopo/) | Documentos de escopo recebidos dos organizadores — fonte do escopo |

## Regras que valem para todos

- Toda task relevante existe como **issue no GitHub** antes de ser iniciada.
- Toda decisão estrutural e dificilmente reversível vira **ADR** antes de ser implementada.
- Todo documento tem **dono único** e suplente — ver o mapa em `docs/team-responsibilities.md`.
- Trabalho em **branch + Pull Request**, nunca push direto na `main`: o PR é onde a revisão de qualidade acontece.
- **Teste automatizado é obrigatório** no Definition of Done — é critério de avaliação do exercício.
