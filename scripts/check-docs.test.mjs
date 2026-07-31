#!/usr/bin/env node
/**
 * Testes do check-docs.
 *
 * Usa `node:test`, que acompanha o Node desde a v18 — sem `package.json` e sem
 * dependência, o que importa porque este script roda antes de a aplicação
 * existir.
 *
 * Estratégia: o `check-docs` resolve a raiz do projeto a partir da própria
 * localização, então cada caso monta uma árvore temporária com uma cópia do
 * script em `scripts/` e os arquivos do cenário ao lado. Isso isola o teste da
 * árvore real e deixa cada caso descrever exatamente o que exercita.
 *
 * Uso:  node --test scripts/check-docs.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, 'check-docs.mjs');

const AGENTE_VALIDO = `---
name: agente-exemplo
description: Agente de exemplo para os testes.
tools: Read, Grep
---

# Agente de exemplo
`;

/**
 * Monta uma árvore temporária com os arquivos dados e roda o check-docs nela.
 * `prefixo` permite exercitar caminho com espaço no nome.
 */
function rodar(arquivos, { prefixo = 'nexo-check-' } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), prefixo));
  const script = join(raiz, 'scripts', 'check-docs.mjs');

  mkdirSync(dirname(script), { recursive: true });
  copyFileSync(SCRIPT, script);

  for (const [caminho, conteudo] of Object.entries(arquivos)) {
    const destino = join(raiz, caminho);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, conteudo, 'utf8');
  }

  try {
    return { codigo: 0, saida: execFileSync(process.execPath, [script], { encoding: 'utf8' }) };
  } catch (erro) {
    return { codigo: erro.status ?? 1, saida: `${erro.stdout ?? ''}${erro.stderr ?? ''}` };
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Definições de agente — o defeito que motivou estas checagens
//
// O PR #18 entregou um agente sem frontmatter: o Claude Code não registra o
// arquivo, o agente não carrega, e nada avisava. Os casos abaixo cobrem tanto
// o defeito quanto os falsos positivos encontrados na revisão do PR #20 — que
// são igualmente graves, porque o check-docs é status check obrigatório e um
// falso positivo barra o merge de um arquivo correto.
// ---------------------------------------------------------------------------

test('agente com frontmatter completo passa', () => {
  const { codigo } = rodar({ '.claude/agents/agente-exemplo.md': AGENTE_VALIDO });
  assert.equal(codigo, 0);
});

test('agente sem frontmatter é erro', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': '# Agente\n\nCorpo sem frontmatter.\n',
  });
  assert.equal(codigo, 1);
  assert.match(saida, /sem frontmatter YAML/);
});

test('frontmatter aberto e nunca fechado é erro, ainda que haja régua no corpo', () => {
  // Sem o fechamento, a régua horizontal do corpo faz o bloco "capturado" ser
  // prosa em vez de YAML. Antes da correção do PR #20, este caso passava.
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': [
      '---',
      'name: agente-exemplo',
      '',
      'Esqueci de fechar o frontmatter e escrevi o corpo direto.',
      '',
      '---',
      '',
      'Continuação do corpo.',
      '',
    ].join('\n'),
  });
  assert.equal(codigo, 1);
  assert.match(saida, /sem frontmatter YAML/);
});

test('name entre aspas passa — YAML válido não pode ser reprovado', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': AGENTE_VALIDO.replace(
      'name: agente-exemplo',
      'name: "agente-exemplo"',
    ),
  });
  assert.equal(codigo, 0, saida);
});

test('name com comentário inline passa', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': AGENTE_VALIDO.replace(
      'name: agente-exemplo',
      'name: agente-exemplo # igual ao nome do arquivo',
    ),
  });
  assert.equal(codigo, 0, saida);
});

test('frontmatter com CRLF passa', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': AGENTE_VALIDO.replace(/\n/g, '\r\n'),
  });
  assert.equal(codigo, 0, saida);
});

test('name divergente do nome do arquivo é erro', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': AGENTE_VALIDO.replace(
      'name: agente-exemplo',
      'name: outro-nome',
    ),
  });
  assert.equal(codigo, 1);
  assert.match(saida, /difere do nome do arquivo/);
});

test('campo obrigatório ausente é erro, um por campo', () => {
  for (const campo of ['name', 'description', 'tools']) {
    const semCampo = AGENTE_VALIDO.split('\n')
      .filter((l) => !l.startsWith(`${campo}:`))
      .join('\n');
    const { codigo, saida } = rodar({ '.claude/agents/agente-exemplo.md': semCampo });
    assert.equal(codigo, 1, `${campo}: deveria falhar`);
    assert.match(saida, new RegExp(`sem "${campo}:"`));
  }
});

test('campo obrigatório vazio é erro', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': AGENTE_VALIDO.replace('tools: Read, Grep', 'tools:'),
  });
  assert.equal(codigo, 1);
  assert.match(saida, /"tools:" vazio/);
});

test('README.md em .claude/agents não é tratado como agente', () => {
  // Reprovar o README quebraria o push de todos, e ele não é agente.
  const { codigo, saida } = rodar({
    '.claude/agents/agente-exemplo.md': AGENTE_VALIDO,
    '.claude/agents/README.md': '# Agentes deste projeto\n\nUm arquivo por agente.\n',
  });
  assert.equal(codigo, 0, saida);
});

test('agente em subpasta também é verificado', () => {
  const { codigo, saida } = rodar({
    '.claude/agents/produto/agente-exemplo.md': '# Sem frontmatter\n',
  });
  assert.equal(codigo, 1, saida);
  assert.match(saida, /sem frontmatter YAML/);
});

// ---------------------------------------------------------------------------
// Links relativos
// ---------------------------------------------------------------------------

test('link relativo para arquivo inexistente é erro', () => {
  const { codigo, saida } = rodar({ 'README.md': '[morto](./nao-existe.md)\n' });
  assert.equal(codigo, 1);
  assert.match(saida, /link aponta para arquivo inexistente/);
});

test('link dentro de code span não é verificado', () => {
  const { codigo, saida } = rodar({ 'README.md': 'Exemplo: `[morto](./nao-existe.md)`\n' });
  assert.equal(codigo, 0, saida);
});

// ---------------------------------------------------------------------------
// Avisos
// ---------------------------------------------------------------------------

test('placeholder real é contado como aviso, e não bloqueia', () => {
  const { codigo, saida } = rodar({ 'docs/vazio.md': '## Seção\n\n_(a preencher)_\n' });
  assert.equal(codigo, 0);
  assert.match(saida, /1 campo\(s\) ainda "a preencher"/);
});

test('placeholder citado em code span não é contado', () => {
  const { codigo, saida } = rodar({
    'docs/vazio.md': 'Documento com placeholder `_(a preencher)_` é considerado vazio.\n',
  });
  assert.equal(codigo, 0);
  assert.doesNotMatch(saida, /a preencher/);
});

// ---------------------------------------------------------------------------
// Segredos
// ---------------------------------------------------------------------------

test('token do GitHub versionado é erro', () => {
  const { codigo, saida } = rodar({ 'notas.md': `token: ghp_${'a'.repeat(36)}\n` });
  assert.equal(codigo, 1);
  assert.match(saida, /REVOGUE/);
});

// ---------------------------------------------------------------------------
// Resolução da raiz
// ---------------------------------------------------------------------------

test('roda a partir de caminho com espaço no nome', () => {
  // `new URL(import.meta.url).pathname` devolve o caminho percent-encoded, o
  // que fazia o script morrer com ENOENT em `Bruno%20Martins`. Vale também para
  // o nome curto 8.3 do Windows (`BRUNOM~1` → `BRUNOM%7E1`).
  const { codigo, saida } = rodar(
    { '.claude/agents/agente-exemplo.md': AGENTE_VALIDO },
    { prefixo: 'nexo check com espaco ' },
  );
  assert.equal(codigo, 0, saida);
});
