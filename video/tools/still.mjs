// Captures fixes de la vidéo à des instants donnés (contrôle visuel rapide).
//   node tools/still.mjs 1.5 5.2 12        → output/stills/t001.50.png …
//   node tools/still.mjs --sheet 0 90 1.5  → planche contact (une image toutes les 1,5 s)
//   ajouter --slots pour afficher les emplacements médias
import { chromium } from './lib/playwright.mjs';
import { startServer } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'output', 'stills');
mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const slots = args.includes('--slots');
let times = args.filter(a => !a.startsWith('--')).map(Number);
const sheet = args.includes('--sheet');
if (sheet) { const [a, b, step] = times; times = []; for (let t = a; t <= b + 1e-6; t += step) times.push(+t.toFixed(3)); }

const port = 5191 + Math.floor(Math.random() * 500);
const server = await startServer(port);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
page.on('pageerror', e => console.log('[page error]', e.message));
await page.goto(`http://127.0.0.1:${port}/video/engine/index.html?render=1${slots ? '&slots=1' : ''}`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
const files = [];
for (const t of times) {
  await page.evaluate(t => window.__seek(t), t);
  const f = join(OUT, `t${t.toFixed(2).padStart(6, '0')}${slots ? '-slots' : ''}.png`);
  await page.screenshot({ path: f });
  files.push(f);
}
await browser.close(); server.close();
if (sheet) {
  const { execFileSync } = await import('node:child_process');
  const cols = 6;
  const out = join(OUT, `sheet-${times[0]}-${times.at(-1)}${slots ? '-slots' : ''}.jpg`);
  execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw
fs=sys.argv[3:]; cols=int(sys.argv[2]); w,h=270,480
rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*(h+28)),(20,20,20)); d=ImageDraw.Draw(S)
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((w,h)); x,y=(i%cols)*w,(i//cols)*(h+28)
    S.paste(im,(x,y+28)); d.text((x+6,y+6),f.split('/t')[-1].split('.png')[0].split('-')[0]+' s',fill=(255,200,0))
S.save(sys.argv[1],quality=88)`, out, String(cols), ...files]);
  console.log(out);
} else files.forEach(f => console.log(f));
