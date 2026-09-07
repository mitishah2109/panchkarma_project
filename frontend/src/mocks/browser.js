import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Browser MSW worker. Started from main.jsx only when VITE_USE_MOCKS=true.
 *
 * Requires the service worker script at public/mockServiceWorker.js — generate
 * it once with:  npm run mock:init
 */
export const worker = setupWorker(...handlers);
