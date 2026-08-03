/**
 * Testes da apresentação de erro do fluxo de upload — issue #42.
 *
 * Falha se a mudança for revertida (docs/quality.md, seção 2): assere que a
 * nova tentativa aparece só no caso que a admite e que o callback é chamado.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ErroUpload } from './ErroUpload';
import type { ErroUpload as ErroUploadModel } from '@/lib/erros-upload';

const ERRO_SEM_NOVA_TENTATIVA: ErroUploadModel = {
  codigo: 'validacao',
  titulo: 'Dados do orçamento inválidos',
  mensagem: 'Revise os campos do formulário.',
  podeTentarNovamente: false,
};

const ERRO_COM_NOVA_TENTATIVA: ErroUploadModel = {
  codigo: 'upload-nao-concluido',
  titulo: 'O arquivo ainda não chegou por completo',
  mensagem: 'Seus dados foram preservados.',
  podeTentarNovamente: true,
};

describe('ErroUpload', () => {
  it('exibe título e mensagem do erro', () => {
    render(<ErroUpload erro={ERRO_SEM_NOVA_TENTATIVA} />);

    expect(screen.getByText('Dados do orçamento inválidos')).toBeInTheDocument();
    expect(screen.getByText('Revise os campos do formulário.')).toBeInTheDocument();
  });

  it('anuncia o erro para tecnologia assistiva', () => {
    render(<ErroUpload erro={ERRO_SEM_NOVA_TENTATIVA} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('não oferece nova tentativa em erro que não a admite', () => {
    render(<ErroUpload erro={ERRO_SEM_NOVA_TENTATIVA} onTentarNovamente={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument();
  });

  it('oferece nova tentativa no upload não concluído e chama o callback', async () => {
    const onTentarNovamente = vi.fn();
    render(<ErroUpload erro={ERRO_COM_NOVA_TENTATIVA} onTentarNovamente={onTentarNovamente} />);

    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(onTentarNovamente).toHaveBeenCalledTimes(1);
  });

  it('não mostra botão sem callback, mesmo em erro que admite nova tentativa', () => {
    render(<ErroUpload erro={ERRO_COM_NOVA_TENTATIVA} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
