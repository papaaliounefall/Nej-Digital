// Charge Playwright : d'abord la dépendance locale (npm i -D playwright),
// sinon l'installation globale de la machine (CommonJS / NODE_PATH).
import { createRequire } from 'node:module';

let pw;
try {
  pw = await import('playwright');
} catch {
  pw = createRequire(import.meta.url)('playwright');
}
export const chromium = pw.chromium ?? pw.default?.chromium;
