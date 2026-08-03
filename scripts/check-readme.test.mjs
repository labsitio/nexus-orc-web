#!/usr/bin/env node
/**
 * Testes do README como instrução executável — issue #51.
 *
 * A Definition of Done de projeto (CLAUDE.md, seção 1.2.1) exige que o README
 * explique como rodar em passos que funcionam numa máquina limpa. O risco real
 * não é o README nascer errado: é ele **envelhecer** em silêncio. Renomear um
 * script no `package.json`, mudar a porta de um app ou trocar o nome de uma
 * variável de ambiente não quebra nada hoje, e o comando documentado passa a
 * mentir para quem clona o repositório — que é justamente quem não tem como
 * descobrir o comando certo.
 *
 * Estes testes fecham essa lacuna: cada comando `npm run` citado no README é
 * conferido contra o `package.json` do workspace correspondente, e cada arquivo
 * invocado por `node` é conferido contra o disco. Diferente do
 * `check-docs.test.mjs`, aqui não há árvore temporária: o objeto sob teste é o
 * README real deste repositório.
 *
 * Usa `node:test`, sem dependência de instalação — mesma escolha do
 * `check-docs` (docs/quality.md, seção 2).
 *
 * Uso:  node --test scripts/check-readme.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const README = readFileSync(join(RAIZ, 'README.md'), 'utf8');

/** Workspaces declarados na raiz — a fonte de verdade de quais apps existem. */
const WORKSPACES = JSON.parse(readFileSync(join(RAIZ, 'package.json'), 'utf8')).workspaces;

function scriptsDoWorkspace(workspace) {
  const pkg = join(RAIZ, workspace, 'package.json');
  assert.ok(existsSync(pkg), `workspace "${workspace}" não tem package.json`);
  return JSON.parse(readFileSync(pkg, 'utf8')).scripts ?? {};
}

// ---------------------------------------------------------------------------
// Os comandos documentados existem de fato
// ---------------------------------------------------------------------------

test('todo comando npm run --workspace do README existe no package.json daquele workspace', () => {
  const comandos = [...README.matchAll(/npm run ([\w:-]+) --workspace=([\w./-]+)/g)];

  assert.ok(
    comandos.length >= 4,
    'esperado ao menos um comando de dev, test e build por app — o README perdeu a seção de execução local?',
  );

  for (const [, script, workspace] of comandos) {
    assert.ok(
      WORKSPACES.includes(workspace),
      `README manda rodar em "${workspace}", que não é workspace declarado na raiz`,
    );
    assert.ok(
      script in scriptsDoWorkspace(workspace),
      `README manda rodar "npm run ${script} --workspace=${workspace}", mas o script "${script}" não existe nesse package.json`,
    );
  }
});

test('cada workspace de aplicação tem dev, test e build documentados', () => {
  const documentados = new Map();
  for (const [, script, workspace] of README.matchAll(/npm run ([\w:-]+) --workspace=([\w./-]+)/g)) {
    if (!documentados.has(workspace)) documentados.set(workspace, new Set());
    documentados.get(workspace).add(script);
  }

  // `shared/` é biblioteca interna, não sobe sozinha — só os apps entram aqui.
  for (const app of WORKSPACES.filter((w) => w.startsWith('apps/'))) {
    const scripts = documentados.get(app);
    assert.ok(scripts, `o README não diz como rodar "${app}"`);
    for (const esperado of ['dev', 'test', 'build']) {
      assert.ok(
        scripts.has(esperado),
        `o README não documenta "npm run ${esperado} --workspace=${app}"`,
      );
    }
  }
});

test('todo arquivo invocado por node no README existe', () => {
  for (const [, caminho] of README.matchAll(/node (?:--test )?((?:scripts|apps|shared)\/[\w./-]+)/g)) {
    assert.ok(existsSync(join(RAIZ, caminho)), `README invoca "${caminho}", que não existe`);
  }
});

test('a instalação documentada é npm ci na raiz, coerente com o lockfile único', () => {
  assert.match(README, /```bash\r?\nnpm ci\r?\n```/, 'o README não documenta `npm ci` na raiz');
  assert.ok(
    existsSync(join(RAIZ, 'package-lock.json')),
    '`npm ci` exige lockfile, e não há package-lock.json na raiz',
  );
});

test('o modo watch do Vitest é endereçado, e não deixa a verificação em execução infinita', () => {
  const linhasDeTeste = [...README.matchAll(/npm run test --workspace=[\w./-]+([^\n]*)/g)];
  for (const [linha, resto] of linhasDeTeste) {
    assert.match(
      resto,
      /--run/,
      `"${linha.trim()}" roda em watch por padrão — o README precisa passar "-- --run" para execução única`,
    );
  }
});

// ---------------------------------------------------------------------------
// As seções que a Definition of Done de projeto exige
// ---------------------------------------------------------------------------

test('as seções exigidas pela DoD de projeto estão no README', () => {
  for (const secao of [
    'URL do ambiente',
    'Como rodar localmente',
    'Variáveis de ambiente',
    'Dado de demonstração',
    'Mock e troca pela API real',
  ]) {
    assert.ok(README.includes(`## ${secao}`), `o README não tem a seção "${secao}"`);
  }
});

test('a URL publicada está registrada ou a limitação está declarada', () => {
  const secao = README.split('## URL do ambiente')[1]?.split('\n## ')[0] ?? '';

  const temUrl = /https?:\/\/(?!localhost)[\w.-]+/.test(secao);
  const temLimitacao = /não publicada/i.test(secao) && /Limitação declarada/i.test(secao);

  assert.ok(
    temUrl || temLimitacao,
    'a seção "URL do ambiente" não registra URL publicada nem declara a limitação — a DoD de projeto aceita as duas, não aceita silêncio',
  );

  if (!temUrl) {
    assert.match(
      secao,
      /#14|issues\/14/,
      'limitação declarada sem apontar de quem depende — referencie a issue do deploy (#14)',
    );
  }
});

test('nenhum valor de segredo aparece ao lado dos nomes de variável', () => {
  // Nome de variável documentado é obrigatório; valor é proibido. O `check-docs`
  // pega o formato de token e de access key; aqui o alvo é a atribuição, que é
  // a forma pela qual um valor real entraria neste arquivo sem parecer segredo.
  const nomes = [
    'NEXT_PUBLIC_API_BASE_URL',
    'AWS_DEPLOY_ROLE_ARN_UPLOAD',
    'AWS_S3_BUCKET_UPLOAD',
    'AWS_CLOUDFRONT_DISTRIBUTION_ID_UPLOAD',
    'AWS_REGION',
  ];

  for (const nome of nomes) {
    assert.ok(README.includes(nome), `o README não documenta a variável "${nome}"`);
    assert.doesNotMatch(
      README,
      new RegExp(`${nome}\\s*=\\s*\\S`),
      `"${nome}" aparece com valor atribuído no README — nome sim, valor nunca`,
    );
  }
});
