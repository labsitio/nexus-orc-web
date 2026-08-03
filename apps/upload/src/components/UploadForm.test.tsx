import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadForm } from './UploadForm';

const preencherCampoTexto = async (rotulo: RegExp, valor: string) => {
  const campo = screen.getByLabelText(rotulo);
  await userEvent.clear(campo);
  await userEvent.type(campo, valor);
};

const arquivoValido = () =>
  new File(['conteudo'], 'orcamento.pdf', { type: 'application/pdf' });

describe('UploadForm', () => {
  it('mantém o botão de envio desabilitado enquanto o formulário está vazio', () => {
    render(<UploadForm />);
    expect(screen.getByRole('button', { name: /enviar orçamento/i })).toBeDisabled();
  });

  it('não renderiza campo de canal — é fixo e não escolhido pelo usuário', () => {
    render(<UploadForm />);
    expect(screen.queryByLabelText(/canal/i)).not.toBeInTheDocument();
  });

  it('exibe erro em português junto ao campo de CNPJ/CPF, ao vivo, sem precisar submeter', async () => {
    render(<UploadForm />);
    const campo = screen.getByLabelText(/cnpj ou cpf/i);

    await userEvent.type(campo, '123');
    await userEvent.tab();

    expect(
      await screen.findByText('CNPJ deve ter 14 dígitos ou CPF deve ter 11 dígitos.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar orçamento/i })).toBeDisabled();
  });

  it('exibe erro em português quando o arquivo não é PDF nem imagem', async () => {
    render(<UploadForm />);
    const input = screen.getByLabelText(/arquivo do orçamento/i);
    const arquivoInvalido = new File(['x'], 'planilha.xlsx', {
      type: 'application/vnd.ms-excel',
    });
    // applyAccept: false — queremos exercitar a validação client-side mesmo
    // para um arquivo que o atributo `accept` do input já tenta filtrar no
    // seletor nativo do navegador (defesa em profundidade, não confiar só
    // no `accept`).
    const usuario = userEvent.setup({ applyAccept: false });

    await usuario.upload(input, arquivoInvalido);

    expect(
      await screen.findByText('Formato não aceito. Envie um PDF ou uma imagem (PNG ou JPEG).'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar orçamento/i })).toBeDisabled();
  });

  it('habilita o botão de envio somente quando todos os campos obrigatórios são válidos', async () => {
    render(<UploadForm />);
    const botao = screen.getByRole('button', { name: /enviar orçamento/i });

    await preencherCampoTexto(/cnpj ou cpf/i, '12345678901');
    expect(botao).toBeDisabled();

    await preencherCampoTexto(/nome do contato/i, 'Maria Souza');
    expect(botao).toBeDisabled();

    await userEvent.upload(screen.getByLabelText(/arquivo do orçamento/i), arquivoValido());

    expect(botao).toBeEnabled();
  });

  it('chama onSubmit com o payload do contrato (canal, nomeArquivo, tipoConteudo) e desabilita o botão no primeiro clique, prevenindo duplo disparo', async () => {
    const onSubmit = vi.fn();
    render(<UploadForm onSubmit={onSubmit} />);
    const botao = screen.getByRole('button', { name: /enviar orçamento/i });
    const arquivo = arquivoValido();

    await preencherCampoTexto(/cnpj ou cpf/i, '12345678901');
    await preencherCampoTexto(/nome do contato/i, 'Maria Souza');
    await preencherCampoTexto(/referência externa/i, 'PED-123');
    await userEvent.upload(screen.getByLabelText(/arquivo do orçamento/i), arquivo);

    expect(botao).toBeEnabled();
    await userEvent.click(botao);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      {
        canal: 'PORTAL_WEB',
        nomeArquivo: 'orcamento.pdf',
        tipoConteudo: 'application/pdf',
        referenciaExterna: 'PED-123',
      },
      arquivo,
    );
    expect(botao).toBeDisabled();

    // Simula um segundo clique/disparo — não pode chamar onSubmit de novo.
    await userEvent.click(botao);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('omite referenciaExterna do payload quando o campo é deixado em branco (opcional)', async () => {
    const onSubmit = vi.fn();
    render(<UploadForm onSubmit={onSubmit} />);

    await preencherCampoTexto(/cnpj ou cpf/i, '12345678901');
    await preencherCampoTexto(/nome do contato/i, 'Maria Souza');
    await userEvent.upload(screen.getByLabelText(/arquivo do orçamento/i), arquivoValido());

    await userEvent.click(screen.getByRole('button', { name: /enviar orçamento/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.not.objectContaining({ referenciaExterna: expect.anything() }),
      expect.anything(),
    );
  });
});
