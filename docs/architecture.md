# Arquitetura do Projeto Nexo

> Documento vivo, de responsabilidade do agente **Frontend Architect** (André — ver [team-responsibilities.md](team-responsibilities.md)). Deve ser preenchido e mantido atualizado à medida que decisões de arquitetura são tomadas. Decisões estruturais registradas aqui **devem** ter um ADR correspondente em `docs/adr/`.

Este documento **não deve** conter escolhas de stack, bibliotecas ou convenções de código — isso pertence a [engineering-principles.md](engineering-principles.md). Aqui vive a arquitetura da solução: como os componentes se relacionam, como os dados fluem, quais fronteiras existem.

**Escopo:** a arquitetura da frente de **frontend** do Nexo. Backend e mobile são conduzidos por outras equipes; o que pertence a elas deve aparecer aqui apenas como **fronteira e premissa**, nunca como decisão nossa.

---

## 1. Visão Geral da Arquitetura

_(Descrição de alto nível da arquitetura escolhida e por que ela atende aos objetivos do projeto definidos em CLAUDE.md.)_

---

## 2. Componentes / Módulos Principais

_(Lista dos grandes blocos do frontend e a responsabilidade de cada um.)_

| Componente | Responsabilidade | ADR relacionado |
|---|---|---|
| _(a preencher)_ | _(a preencher)_ | _(link)_ |

---

## 3. Fluxo de Dados

_(Como a informação se move entre os componentes. Diagramas são bem-vindos aqui.)_

---

## 4. Fronteiras com Backend e Mobile

_(O que **não** é decisão desta equipe. Para cada item, registrar de quem é a decisão e qual premissa o frontend está adotando enquanto ela não estiver fechada.)_

| Assunto | Equipe responsável | Premissa adotada pelo frontend | Status |
|---|---|---|---|
| _(a preencher)_ | _(backend / mobile)_ | _(a preencher)_ | _(premissa / acordado)_ |

---

## 5. Contrato de Integração e Estratégia de Mock

_(O contrato de dados que o frontend consome, e como ele é mockado enquanto o backend não entrega. O mock é a **proposta de contrato** levada ao backend, não uma suposição privada — ver [team-responsibilities.md](team-responsibilities.md), Bruno e André.)_

Itens que **precisam** estar pinados explicitamente, porque escopo idêntico não impede divergência neles:

| Item | Definição acordada | Status |
|---|---|---|
| Nomes e casing dos campos | _(a preencher)_ | _(premissa / acordado)_ |
| Formato de data e timezone | _(a preencher)_ | _(premissa / acordado)_ |
| Enums (tipo e valores) | _(a preencher)_ | _(premissa / acordado)_ |
| Paginação | _(a preencher)_ | _(premissa / acordado)_ |
| Envelope da resposta | _(a preencher)_ | _(premissa / acordado)_ |
| Formato de erro (shape e códigos) | _(a preencher)_ | _(premissa / acordado)_ |
| Autenticação (header, refresh) | _(a preencher)_ | _(premissa / acordado)_ |
| Nulabilidade / campos opcionais | _(a preencher)_ | _(premissa / acordado)_ |
| Tipo de ID | _(a preencher)_ | _(premissa / acordado)_ |

**Estratégia de mock:** _(a definir — decisão estrutural, exige ADR.)_

---

## 6. Decisões de Arquitetura Relevantes

_(Lista de ADRs que impactam diretamente a arquitetura, com link e resumo de uma linha.)_

- _(a preencher)_

---

## 7. Restrições e Premissas

_(Limitações técnicas, de negócio ou de prazo que moldam as decisões de arquitetura.)_

---

## 8. Riscos Arquiteturais Conhecidos

_(Pontos de atenção que podem gerar dívida técnica ou exigir revisão futura.)_
