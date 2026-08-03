import { apiClient } from '@/lib/api-client';

export interface GenerateUploadUrlRequest {
  canal: string;
  nomeArquivo: string;
  tipoConteudo: string;
  referenciaExterna?: string;
}

export interface GenerateUploadUrlResponse {
  orcamentoId: string;
  uploadUrl: string;
  metodo: 'PUT';
  expiraEm: string;
}

export interface ConfirmUploadResponse {
  orcamentoId: string;
  status: string;
  recebidoEm: string;
}

export interface UploadFlowResult {
  orcamentoId: string;
  status: string;
}

export async function generateUploadUrl(
  request: GenerateUploadUrlRequest,
  token: string,
): Promise<GenerateUploadUrlResponse> {
  return apiClient.post<GenerateUploadUrlResponse>('/orcamentos/upload-url', request, {
    token,
  });
}

export async function uploadFileToS3(
  uploadUrl: string,
  file: File,
): Promise<void> {
  await apiClient.putBinary(uploadUrl, file);
}

export async function confirmUpload(
  orcamentoId: string,
  idempotencyKey: string,
  token: string,
): Promise<ConfirmUploadResponse> {
  return apiClient.post<ConfirmUploadResponse>(
    `/orcamentos/${orcamentoId}/confirmar-upload`,
    {},
    {
      token,
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
  );
}

export async function executeUploadFlow(
  file: File,
  request: GenerateUploadUrlRequest,
  token: string,
  idempotencyKey: string,
): Promise<UploadFlowResult> {
  const generateResponse = await generateUploadUrl(request, token);
  const { orcamentoId, uploadUrl } = generateResponse;

  await uploadFileToS3(uploadUrl, file);

  const confirmResponse = await confirmUpload(orcamentoId, idempotencyKey, token);

  return {
    orcamentoId: confirmResponse.orcamentoId,
    status: confirmResponse.status,
  };
}
