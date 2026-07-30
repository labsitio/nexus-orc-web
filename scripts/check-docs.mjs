#!/usr/bin/env node
/**
 * Checagem de consistência da documentação do Nexo.
 *
 * Verifica as classes de defeito que já ocorreram de fato neste repositório:
 * link relativo apontando para arquivo inexistente, referência a seção do
 * CLAUDE.md que deixou de existir após renumeração, termo legado que sobrou de
 * uma renomeação, e segredo versionado por acidente.
 *
 * Uso:  node scripts/check-docs.mjs
 * Saída: código 1 se houver ERRO; 0 se houver apenas AVISO ou nada.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const RAIZ = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

const IGNORAR_DIR = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'out']);

const erros = [];
const avisos = [];

// ---------------------------------------------------------------------------
// Coleta de arquivos
// ---------------------------------------------------------------------------

function listar(dir, filtro, acc = []) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR_DIR.has(nome)) continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) listar(caminho, filtro, acc);
    else if (filtro(nome)) acc.push(caminho);
  }
  return acc;
}

const arquivosMd = listar(RAIZ, (n) => n.endsWith('.md'));
const arquivosTexto = listar(RAIZ, (n) => /\.(md|json|ya?ml|mjs|js|ts|tsx|sh)$/.test(n) || n === 'CODEOWNERS');

const rel = (p) => relative(RAIZ, p).replace(/\\/g, '/');

/**
 * Este arquivo contém, por necessidade, os próprios padrões que procura — logo
 * casaria consigo mesmo nas buscas de termo legado e de segredo. Excluído delas.
 */
const arquivosVarredura = arquivosTexto.filter((p) => rel(p) !== 'scripts/check-docs.mjs');

/** Remove blocos e spans de código, para não acusar exemplo como se fosse link real. */
function semCodigo(texto) {
  return texto
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
}

// ---------------------------------------------------------------------------
// 1. Links relativos quebrados
// ---------------------------------------------------------------------------

for (const arquivo of arquivosMd) {
  const conteudo = semCodigo(readFileSync(arquivo, 'utf8'));
  const base = dirname(arquivo);

  for (const m of conteudo.matchAll(/\[[^\]]*\]\(([^)\s]+)/g)) {
    const alvo = m[1];
    if (/^(https?:|mailto:|#)/.test(alvo)) continue;

    const semAncora = alvo.split('#')[0];
    if (!semAncora) continue;

    if (!existsSync(join(base, decodeURIComponent(semAncora)))) {
      erros.push(`${rel(arquivo)}: link aponta para arquivo inexistente → ${alvo}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Referências a seções do CLAUDE.md que não existem
//    Foi o defeito mais recorrente: inserir uma seção desloca a numeração e as
//    referências passam a apontar para o lugar errado, silenciosamente.
// ---------------------------------------------------------------------------

const claudeMd = join(RAIZ, 'CLAUDE.md');
if (existsSync(claudeMd)) {
  const secoes = new Set();
  for (const linha of readFileSync(claudeMd, 'utf8').split('\n')) {
    const m = linha.match(/^#{2,4}\s+(\d+(?:\.\d+)*)\./);
    if (m) secoes.add(m[1]);
  }

  const padroes = [
    /CLAUDE\.md[^.\n]{0,40}?seç(?:ão|ões)\s+(\d+(?:\.\d+)*)/gi,
    /seç(?:ão|ões)\s+(\d+(?:\.\d+)*)\s+do\s+CLAUDE\.md/gi,
  ];

  for (const arquivo of arquivosMd) {
    const conteudo = semCodigo(readFileSync(arquivo, 'utf8'));
    for (const padrao of padroes) {
      for (const m of conteudo.matchAll(padrao)) {
        if (!secoes.has(m[1])) {
          erros.push(`${rel(arquivo)}: referencia a seção ${m[1]} do CLAUDE.md, que não existe`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Termos legados
//    "Pessoa 1/2/3" ficou para trás quando passamos a usar nomes reais.
//    Acrescente aqui qualquer termo que uma renomeação futura deixe obsoleto.
// ---------------------------------------------------------------------------

const LEGADOS = [
  { padrao: /\bPessoa\s+[123]\b/g, motivo: 'substituído pelos nomes reais dos integrantes' },
  { padrao: /\bSoftware Architect\b/g, motivo: 'renomeado para Frontend Architect' },
];

for (const arquivo of arquivosVarredura) {
  const conteudo = readFileSync(arquivo, 'utf8');
  for (const { padrao, motivo } of LEGADOS) {
    const achados = conteudo.match(padrao);
    if (achados) {
      erros.push(`${rel(arquivo)}: termo legado "${achados[0]}" (${motivo}) — ${achados.length}x`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Segredos versionados
// ---------------------------------------------------------------------------

const SEGREDOS = [
  { padrao: /ghp_[A-Za-z0-9]{20,}/, nome: 'token clássico do GitHub' },
  { padrao: /github_pat_[A-Za-z0-9_]{20,}/, nome: 'token fine-grained do GitHub' },
  { padrao: /AKIA[0-9A-Z]{16}/, nome: 'access key da AWS' },
  { padrao: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, nome: 'chave privada' },
];

for (const arquivo of arquivosVarredura) {
  const conteudo = readFileSync(arquivo, 'utf8');
  for (const { padrao, nome } of SEGREDOS) {
    if (padrao.test(conteudo)) {
      erros.push(`${rel(arquivo)}: possível ${nome} versionado — REVOGUE antes de qualquer coisa`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Avisos: pendências que não impedem o merge, mas não devem sumir de vista
// ---------------------------------------------------------------------------

const codeowners = join(RAIZ, '.github/CODEOWNERS');
if (existsSync(codeowners) && /@usuario-/.test(readFileSync(codeowners, 'utf8'))) {
  avisos.push('.github/CODEOWNERS: ainda tem placeholder @usuario- — o GitHub ignora essas regras em silêncio');
}

for (const arquivo of arquivosMd) {
  const n = (readFileSync(arquivo, 'utf8').match(/_\(a preencher\)_/g) || []).length;
  if (n) avisos.push(`${rel(arquivo)}: ${n} campo(s) ainda "a preencher"`);
}

const dirAdr = join(RAIZ, 'docs/adr');
if (existsSync(dirAdr)) {
  for (const nome of readdirSync(dirAdr).filter((n) => /^\d{4}-/.test(n))) {
    const texto = readFileSync(join(dirAdr, nome), 'utf8');
    const m = texto.match(/##\s+Status\s*\n+\s*(.+)/);
    const status = m ? m[1].trim() : '(sem status)';
    if (/proposto/i.test(status)) {
      avisos.push(`docs/adr/${nome}: status "${status}" — pela seção 7 do CLAUDE.md, decisão não ratificada`);
    }
  }
}

// ---------------------------------------------------------------------------
// Relatório
// ---------------------------------------------------------------------------

const rotulo = (n, s, p) => `${n} ${n === 1 ? s : p}`;

if (avisos.length) {
  console.log(`\nAVISOS (${avisos.length}) — não bloqueiam:\n`);
  for (const a of avisos) console.log(`  · ${a}`);
}

if (erros.length) {
  console.log(`\nERROS (${erros.length}):\n`);
  for (const e of erros) console.log(`  ✗ ${e}`);
  console.log(`\n${rotulo(erros.length, 'erro', 'erros')} de consistência. Corrija antes do merge.\n`);
  process.exit(1);
}

console.log(`\n✓ Documentação consistente — ${arquivosMd.length} arquivos .md verificados.\n`);
