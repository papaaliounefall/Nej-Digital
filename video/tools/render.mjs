// Rendu image par image de la vidéo (1080×1920, 30 i/s) → segments H.264.
// Chaque image est calculée par window.__seek(t) dans Chromium headless, capturée,
// puis envoyée à ffmpeg. Plusieurs navigateurs travaillent en parallèle.
//
//   node tools/render.mjs                  rendu complet (output/frames-video.mp4)
//   node tools/render.mjs --from 20 --to 38 --out output/s3.mp4   extrait
//   options : --workers 3  --no-captions  --slots
import { chromium } from './lib/playwright.mjs';
import { startServer } from './serve.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpus } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const story = JSON.parse(readFileSync(join(ROOT, 'config/story.json'), 'utf8'));
const EXPORT = JSON.parse(readFileSync(join(ROOT, 'config/export.json'), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const flag = k => process.argv.includes('--' + k);

const FPS = story.video.fps;
const from = Number(arg('from', 0)), to = Number(arg('to', story.video.duration));
const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
const workers = Number(arg('workers', Math.max(1, Math.min(4, cpus().length - 1))));
const out = join(ROOT, arg('out', 'output/frames-video.mp4'));
const query = ['render=1', flag('no-captions') ? 'captions=0' : '', flag('slots') ? 'slots=1' : ''].filter(Boolean).join('&');
const tmp = join(ROOT, 'output', '.segments');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const port = 5300 + Math.floor(Math.random() * 400);
const server = await startServer(port);
const browser = await chromium.launch();
const total = f1 - f0;
const per = Math.ceil(total / workers);
let done = 0;
const t0 = Date.now();

async function renderRange(w, a, b) {
  const page = await browser.newPage({ viewport: { width: story.video.width, height: story.video.height } });
  page.on('pageerror', e => console.error(`[w${w}]`, e.message));
  await page.goto(`http://127.0.0.1:${port}/video/engine/index.html?${query}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const seg = join(tmp, `seg${String(w).padStart(2, '0')}.mp4`);
  const v = EXPORT.video;
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', v.preset, '-crf', String(v.crf), '-profile:v', v.profile, '-level', v.level, '-pix_fmt', v.pixFmt,
    '-maxrate', v.maxrate, '-bufsize', v.bufsize, '-g', String(FPS * 2), '-r', String(FPS),
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const closed = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  for (let f = a; f < b; f++) {
    await page.evaluate(t => window.__seek(t), f / FPS);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(jpg)) await new Promise(r => ff.stdin.once('drain', r));
    done++;
    if (done % 60 === 0) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\r${done}/${total} images · ${(done / el).toFixed(1)} i/s · reste ~${Math.round((total - done) / (done / el))} s   `);
    }
  }
  ff.stdin.end();
  await closed;
  await page.close();
  return seg;
}

try {
  const jobs = [];
  for (let w = 0; w < workers; w++) {
    const a = f0 + w * per, b = Math.min(f1, a + per);
    if (a < b) jobs.push(renderRange(w, a, b));
  }
  const segs = await Promise.all(jobs);
  writeFileSync(join(tmp, 'list.txt'), segs.map(s => `file '${s}'`).join('\n'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-c', 'copy', out], { stdio: 'inherit' })
    .on('close', c => (c === 0 ? res() : rej(new Error('concat ' + c)))));
  console.log(`\n✓ ${out}  (${total} images en ${Math.round((Date.now() - t0) / 1000)} s)`);
} finally {
  await browser.close();
  server.close();
  rmSync(tmp, { recursive: true, force: true });
}
