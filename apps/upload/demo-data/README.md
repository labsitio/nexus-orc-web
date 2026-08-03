# Dado de demonstração — Portal de Upload

> Issue [#50](https://github.com/labsitio/nexus-orc-web/issues/50). Serve à **demonstração da entrega**, não à suíte automatizada — dado de teste vive em [`apps/upload/src/test/mocks.ts`](../src/test/mocks.ts) e nos arquivos `*.test.ts`. Nenhum dado aqui é pessoal real, CNPJ de empresa real ou segredo — `12.345.678/0001-99` é fictício.

## Arquivos

| Arquivo | Uso na demonstração |
|---|---|
| `orcamento-exemplo.pdf` | Selecionar no campo de arquivo do formulário de envio |
| `dados-formulario-exemplo.json` | CNPJ, nome de contato e referência externa para preencher o formulário |

Um teste automatizado (`demo-data.test.ts`, ao lado deste arquivo) carrega os dois e confirma que passam nas mesmas validações do formulário real (`src/lib/validacao-formulario-upload.ts`) — se alguém remover ou invalidar o dado de demonstração, o teste falha.

## Cenários para mostrar na demonstração

O mock do fluxo de upload ([`#38`](https://github.com/labsitio/nexus-orc-web/issues/38), `apps/upload/src/test/mocks.ts`) já implementa os três estados abaixo — nenhum arquivo adicional é necessário para cada um, só o dado de entrada muda:

1. **Sucesso (caminho principal).** Preencher o formulário com os dados deste diretório e enviar. O mock responde com o `orcamentoId` fixo e status `RECEBIDO`.
2. **Erro (400 — campo obrigatório ausente).** Deixar o nome do arquivo vazio na chamada de gerar URL — o mock responde com Problem Details (`type: .../problems/validacao`), exibido em português na tela.
3. **Erro (404 — não encontrado).** Confirmar upload com um `orcamentoId` diferente do fixo (qualquer UUID que não seja `018f2f6a-7c2e-7b1a-9c3d-1a2b3c4d5e6f`) — demonstra que "não existe" e "existe em outro tenant" são deliberadamente indistinguíveis (spec do backend).

**Estado terminal que não é erro:** `RECEBIDO` (retornado por `confirmar-upload` no caminho de sucesso) é o estado terminal da Fase 01 — o pipeline de classificação/extração/validação continua depois, mas do ponto de vista do Portal de Upload o envio terminou com sucesso. Não confundir com uma tela de erro.

## Fora de escopo desta issue

Popular o backend real (não existe endpoint de carga), roteiro de apresentação/slides, gerador de massa de dados em volume — ver a issue #50 para a lista completa.
