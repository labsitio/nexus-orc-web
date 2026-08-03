/**
 * MSW no navegador — o que faltava para o fluxo ser clicável.
 *
 * `src/test/mocks.ts` já define os handlers derivados do contrato do backend
 * (ADR-0005), mas eram consumidos só por `msw/node`, sob os testes. Na
 * aplicação em execução nada interceptava as chamadas, então o `POST /v1/...`
 * batia no servidor e voltava 404 — o fluxo passava nos testes e falhava na
 * tela.
 *
 * Aqui os mesmos handlers passam a valer no navegador, via service worker
 * (`public/mockServiceWorker.js`). Uma fonte só de verdade para os dois
 * ambientes: mudar o mock continua sendo mudar `mocks.ts`.
 */

import { setupWorker } from 'msw/browser';
import { uploadHandlers } from './mocks';

export const worker = setupWorker(...uploadHandlers);
