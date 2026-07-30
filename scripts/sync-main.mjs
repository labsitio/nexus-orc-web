#!/usr/bin/env node
/**
 * Verifica se a cópia local está atrasada em relação à `main` do remoto.
 *
 * Roda no hook SessionStart (ver .claude/settings.json). Saída em JSON, lida
 * pelo Claude Code: `systemMessage` aparece para a pessoa, `additionalContext`
 * entra no contexto do modelo para ele poder oferecer a atualização.
 *
 * Modo, pela variável de ambiente NEXO_AUTO_SYNC:
 *   (não definida) ou "perguntar" → apenas informa. Padrão.
 *   "sempre"                      → atualiza sozinho quando for seguro.
 *
 * O que conta como seguro para atualizar sozinho: estar na `main`, com árvore
 * de trabalho limpa, e a atualização ser fast-forward. Fora disso o script
 * nunca mexe em nada — trazer a main para dentro de uma branch de trabalho é
 * merge ou rebase, pode dar conflito ou reescrever commit de outra pessoa, e
 * isso não se faz sem consentimento.
 */

import { execFileSync } from 'node:child_process';

const git = (...args) => {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 20000,
    }).trim();
  } catch {
    return null;
  }
};

const emitir = (payload) => {
  process.stdout.write(JSON.stringify(payload));
  process.exit(0);
};

const silencio = () => emitir({ suppressOutput: true });

// Fora de um repositório Git, ou sem remoto, não há nada a fazer.
if (git('rev-parse', '--is-inside-work-tree') !== 'true') silencio();
if (!git('remote', 'get-url', 'origin')) silencio();

// Busca sem tocar na árvore de trabalho. Se a rede falhar, sai calado — não é
// erro que valha interromper o início de uma sessão.
if (git('fetch', 'origin', 'main', '--quiet') === null) silencio();

const branch = git('rev-parse', '--abbrev-ref', 'HEAD') ?? '(desconhecida)';
const atras = Number(git('rev-list', '--count', 'HEAD..origin/main') ?? '0');

if (!atras) silencio();

const limpa = git('status', '--porcelain') === '';
const commits = git('log', '--oneline', '--no-decorate', '-5', 'HEAD..origin/main') ?? '';
const plural = atras === 1 ? 'commit' : 'commits';
const modo = (process.env.NEXO_AUTO_SYNC ?? 'perguntar').toLowerCase();

// --- Caminho automático: só na main, limpa e em fast-forward -----------------
if (modo === 'sempre' && branch === 'main' && limpa) {
  if (git('merge', '--ff-only', 'origin/main') !== null) {
    emitir({
      systemMessage: `main atualizada automaticamente: ${atras} ${plural} novo(s) trazido(s) do remoto.`,
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext:
          `A branch main local estava ${atras} ${plural} atrás e foi atualizada por fast-forward no início desta sessão. ` +
          `Commits trazidos:\n${commits}`,
      },
    });
  }
}

// --- Caminho informativo ----------------------------------------------------
const motivo =
  branch !== 'main'
    ? `você está na branch \`${branch}\`, e trazer a main para dentro dela é merge ou rebase — precisa da sua decisão`
    : !limpa
      ? 'há alteração não commitada na árvore de trabalho'
      : 'o modo automático não está ativado';

const comando =
  branch === 'main'
    ? 'git pull --ff-only origin main'
    : `git fetch origin main && git merge origin/main   # ou: git rebase origin/main`;

emitir({
  systemMessage: `A main do remoto está ${atras} ${plural} à frente da sua cópia local.`,
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext:
      `A branch \`main\` do remoto está ${atras} ${plural} à frente da cópia local desta máquina. ` +
      `Não foi atualizada automaticamente porque ${motivo}.\n\n` +
      `Commits pendentes:\n${commits}\n\n` +
      `Comando para atualizar: \`${comando}\`\n\n` +
      `Ao iniciar a conversa, ofereça atualizar agora. Se a pessoa disser que quer sempre automático, ` +
      `oriente a definir a variável de ambiente NEXO_AUTO_SYNC=sempre (no Windows: \`setx NEXO_AUTO_SYNC sempre\`, ` +
      `valendo a partir da próxima sessão). Nesse modo a atualização ocorre sozinha apenas quando for segura: ` +
      `na main, com árvore limpa e em fast-forward.`,
  },
});
