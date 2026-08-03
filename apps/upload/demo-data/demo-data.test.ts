/**
 * Verifica o dado de demonstração (issue #50): falha se os arquivos forem
 * removidos, ou se deixarem de passar nas mesmas validações do formulário
 * real (issue #39) — critério de aceite explícito da #50
 * (docs/quality.md, seção 2).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validarCnpjCpf,
  validarNomeContato,
  validarReferenciaExterna,
  validarArquivo,
  TIPOS_CONTEUDO_ACEITOS,
} from '../src/lib/validacao-formulario-upload';

const AQUI = dirname(fileURLToPath(import.meta.url));
const CAMINHO_PDF = resolve(AQUI, 'orcamento-exemplo.pdf');
const CAMINHO_DADOS = resolve(AQUI, 'dados-formulario-exemplo.json');

describe('dado de demonstração — arquivos existem', () => {
  it('orcamento-exemplo.pdf existe e não está vazio', () => {
    expect(existsSync(CAMINHO_PDF)).toBe(true);
    expect(readFileSync(CAMINHO_PDF).length).toBeGreaterThan(0);
  });

  it('orcamento-exemplo.pdf é um PDF de verdade (magic bytes %PDF)', () => {
    const conteudo = readFileSync(CAMINHO_PDF);
    expect(conteudo.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });

  it('dados-formulario-exemplo.json existe e é JSON válido', () => {
    expect(existsSync(CAMINHO_DADOS)).toBe(true);
    expect(() => JSON.parse(readFileSync(CAMINHO_DADOS, 'utf8'))).not.toThrow();
  });
});

describe('dado de demonstração — aceito pelas validações reais do formulário (#39)', () => {
  const dados = JSON.parse(readFileSync(CAMINHO_DADOS, 'utf8'));

  it('CNPJ/CPF de demonstração passa na validação de formato', () => {
    expect(validarCnpjCpf(dados.cnpjCpf)).toBeUndefined();
  });

  it('nome de contato de demonstração passa na validação de obrigatoriedade', () => {
    expect(validarNomeContato(dados.nomeContato)).toBeUndefined();
  });

  it('referência externa de demonstração é aceita (opcional, sempre válida)', () => {
    expect(validarReferenciaExterna(dados.referenciaExterna)).toBeUndefined();
  });

  it('arquivo de demonstração é aceito como tipo de conteúdo válido', () => {
    const conteudo = readFileSync(CAMINHO_PDF);
    const arquivo = new File([conteudo], 'orcamento-exemplo.pdf', {
      type: 'application/pdf',
    });
    expect(TIPOS_CONTEUDO_ACEITOS).toContain(arquivo.type);
    expect(validarArquivo(arquivo)).toBeUndefined();
  });
});

describe('dado de demonstração — falha se ficar inválido (prova do critério de aceite)', () => {
  it('CNPJ com quantidade errada de dígitos seria rejeitado (contraste, não é o dado real)', () => {
    expect(validarCnpjCpf('123')).toBeDefined();
  });

  it('arquivo de tipo não aceito seria rejeitado (contraste, não é o dado real)', () => {
    const arquivoInvalido = new File(['x'], 'orcamento.txt', { type: 'text/plain' });
    expect(validarArquivo(arquivoInvalido)).toBeDefined();
  });
});
