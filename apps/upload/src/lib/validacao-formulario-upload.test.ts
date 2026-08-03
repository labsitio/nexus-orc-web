import { describe, it, expect } from 'vitest';
import {
  normalizarDocumento,
  validarArquivo,
  validarCnpjCpf,
  validarNomeContato,
  validarReferenciaExterna,
} from './validacao-formulario-upload';

describe('normalizarDocumento', () => {
  it('remove máscara e mantém apenas dígitos', () => {
    expect(normalizarDocumento('12.345.678/0001-90')).toBe('12345678000190');
  });
});

describe('validarCnpjCpf', () => {
  it('rejeita valor vazio', () => {
    expect(validarCnpjCpf('')).toBe('Informe o CNPJ ou CPF do fornecedor.');
  });

  it('rejeita quantidade de dígitos diferente de 11 ou 14', () => {
    expect(validarCnpjCpf('123')).toBe(
      'CNPJ deve ter 14 dígitos ou CPF deve ter 11 dígitos.',
    );
  });

  it('aceita CPF com 11 dígitos', () => {
    expect(validarCnpjCpf('123.456.789-01')).toBeUndefined();
  });

  it('aceita CNPJ com 14 dígitos', () => {
    expect(validarCnpjCpf('12.345.678/0001-90')).toBeUndefined();
  });
});

describe('validarNomeContato', () => {
  it('rejeita vazio ou só espaços', () => {
    expect(validarNomeContato('')).toBe('Informe o nome do contato.');
    expect(validarNomeContato('   ')).toBe('Informe o nome do contato.');
  });

  it('aceita nome preenchido', () => {
    expect(validarNomeContato('Maria Souza')).toBeUndefined();
  });
});

describe('validarArquivo', () => {
  it('rejeita ausência de arquivo', () => {
    expect(validarArquivo(null)).toBe('Selecione o arquivo do orçamento.');
  });

  it('rejeita tipo não aceito', () => {
    const arquivo = new File(['conteudo'], 'planilha.xlsx', {
      type: 'application/vnd.ms-excel',
    });
    expect(validarArquivo(arquivo)).toBe(
      'Formato não aceito. Envie um PDF ou uma imagem (PNG ou JPEG).',
    );
  });

  it('aceita PDF', () => {
    const arquivo = new File(['conteudo'], 'orcamento.pdf', {
      type: 'application/pdf',
    });
    expect(validarArquivo(arquivo)).toBeUndefined();
  });

  it('aceita imagem PNG ou JPEG', () => {
    const png = new File(['conteudo'], 'orcamento.png', { type: 'image/png' });
    const jpeg = new File(['conteudo'], 'orcamento.jpg', { type: 'image/jpeg' });
    expect(validarArquivo(png)).toBeUndefined();
    expect(validarArquivo(jpeg)).toBeUndefined();
  });
});

describe('validarReferenciaExterna', () => {
  it('nunca retorna erro — campo opcional', () => {
    expect(validarReferenciaExterna('')).toBeUndefined();
    expect(validarReferenciaExterna('PED-123')).toBeUndefined();
  });
});
