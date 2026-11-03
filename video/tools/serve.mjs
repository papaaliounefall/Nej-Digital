// Serveur statique minimal pour l'aperçu et le rendu de la vidéo.
// Racine = le dépôt du site (lecture seule), afin que la vidéo puisse lire
// directement les vraies ressources : /public/*.webp, /src/data/*.json, etc.
//
//   npm run preview            → http://localhost:5190/video/engine/index.html
//   ?t=12.5                    → fige l'aperçu à 12,5 s
//   ?slots=1                   → affiche les emplacements de médias réels à fournir
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.wav': 'audio/wav', '.mp3': 'audio/mpeg'
};

export function startServer(port = 5190) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    const file = join(REPO_ROOT, rel);
    if (!file.startsWith(REPO_ROOT)) { res.writeHead(403).end(); return; }
    try {
      const st = statSync(file);
      if (!st.isFile()) throw new Error('not a file');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-cache' });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404).end('404');
    }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 5190);
  await startServer(port);
  console.log(`Aperçu : http://localhost:${port}/video/engine/index.html  (?t=secondes, ?slots=1)`);
}
