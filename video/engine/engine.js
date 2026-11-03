// Moteur de la vidéo NEJ Digital.
// - charge le récit (config/*.json) et les vraies ressources du site ;
// - monte les scènes (../scenes/*.js) dans une scène 1080×1920 ;
// - expose window.__seek(t) : rendu exact de l'image au temps t (utilisé par tools/render.mjs) ;
// - en aperçu navigateur : lecture temps réel avec le mix audio.
import { el, put, prog, ep, ease, kf, rng, splitWords, BRAND, inOut, clamp } from './lib.js';
import { mountCaptions } from './captions.js';

import s1 from '../scenes/s1-hook.js';
import s2 from '../scenes/s2-debuts.js';
import s3 from '../scenes/s3-difficultes.js';
import s4 from '../scenes/s4-construction.js';
import s5 from '../scenes/s5-vision.js';
import s6 from '../scenes/s6-conclusion.js';

const SCENES = [s1, s2, s3, s4, s5, s6];
const params = new URLSearchParams(location.search);
const RENDER = params.has('render');
const SHOW_SLOTS = params.get('slots') === '1';
const NO_CAPTIONS = params.get('captions') === '0';
if (RENDER) document.body.classList.add('render');

const base = new URL('..', import.meta.url).href;            // /video/
const repo = new URL('../..', import.meta.url).href;         // racine du dépôt (site)
const getJSON = async p => (await fetch(p, { cache: 'no-cache' })).json();
const getText = async p => (await fetch(p, { cache: 'no-cache' })).text();

const [story, cuesCfg, media, history, brand] = await Promise.all([
  getJSON(base + 'config/story.json'), getJSON(base + 'config/cues.json'), getJSON(base + 'config/media.json'),
  getJSON(base + 'config/history.json'), getJSON(base + 'assets/brand/brand.json')
]);
let timings = [];
try { timings = await getJSON(base + 'assets/audio/vo/timings.json'); } catch { /* pas encore généré */ }

const W = story.video.width, H = story.video.height;
const stage = document.getElementById('stage');
const cueMap = Object.fromEntries(cuesCfg.cues.map(c => [c.id, c.t]));
const cue = id => { if (!(id in cueMap)) throw new Error('Repère inconnu : ' + id); return cueMap[id]; };
const sceneById = Object.fromEntries(story.scenes.map(s => [s.id, s]));
const lineById = Object.fromEntries(story.narration.map(n => {
  const tm = timings.find(x => x.id === n.id);
  return [n.id, { ...n, end: tm ? tm.end : n.start + 3, duration: tm ? tm.duration : 3 }];
}));

// ---------- Préchargement des images (vraies ressources) ----------
const pending = [];
function img(src, opts = {}, parent) {
  const n = el('img', opts, parent);
  pending.push(new Promise(res => { n.onload = res; n.onerror = () => { console.warn('Image manquante', src); res(); }; }));
  n.decoding = 'sync';
  n.src = src;
  return n;
}

// ---------- Logo officiel animable (calques vectorisés depuis public/icon-512.png) ----------
function makeLogo(parent, width) {
  const h = width / brand.aspect;
  const root = el('div', { cls: 'abs', style: { width: width + 'px', height: h + 'px', left: 0, top: 0, transformOrigin: '50% 50%' } }, parent);
  const lettersWrap = el('div', { cls: 'abs', style: { inset: 0 } }, root);
  const letters = img(base + 'assets/brand/logo-letters.svg', { cls: 'abs', style: { left: 0, top: 0, width: '100%', height: '100%' } }, lettersWrap);
  const digitalWrap = el('div', { cls: 'abs', style: { inset: 0 } }, root);
  img(base + 'assets/brand/logo-digital.svg', { cls: 'abs', style: { left: 0, top: 0, width: '100%', height: '100%' } }, digitalWrap);
  const squares = brand.boxes.squares.map(([x0, y0, x1, y1]) => el('div', {
    cls: 'abs', style: { left: x0 * width + 'px', top: y0 * h + 'px', width: (x1 - x0) * width + 'px', height: (y1 - y0) * h + 'px', background: brand.logoBlue, transformOrigin: '50% 50%' }
  }, root));
  // Les carrés sont dans le calque lettres de l'image d'origine ? Non : séparés, on les superpose.
  return {
    root, width, height: h, letters: lettersWrap, digital: digitalWrap, squares,
    /** Révélation gauche→droite des lettres (0..1) et de la ligne DIGITAL (0..1). */
    reveal(pL, pD) {
      lettersWrap.style.clipPath = `inset(-5% ${(100 - pL * 100).toFixed(2)}% -5% 0)`;
      const half = (1 - pD) * 50;
      digitalWrap.style.clipPath = `inset(0 ${half.toFixed(2)}% 0 ${half.toFixed(2)}%)`;
    },
    /** Centre (dans le repère du logo) d'un carré. */
    squareCenter(i) {
      const [x0, y0, x1, y1] = brand.boxes.squares[i];
      return [((x0 + x1) / 2) * width, ((y0 + y1) / 2) * h, (x1 - x0) * width];
    }
  };
}

// ---------- Fond commun : bleu nuit du site, grille légère, poussière en parallaxe ----------
const bg = el('div', { cls: 'layer', style: { background: `radial-gradient(120% 70% at 50% 38%, #0C1322 0%, ${BRAND.bgHero} 55%, #05070C 100%)` } }, stage);
const gridCv = el('canvas', { cls: 'layer', attrs: { width: W, height: H } }, bg);
{
  const g = gridCv.getContext('2d');
  g.strokeStyle = 'rgba(59,130,246,0.06)'; g.lineWidth = 1;
  for (let x = 0; x <= W; x += 90) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke(); }
  for (let y = 0; y <= H; y += 90) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
}
const dustCv = el('canvas', { cls: 'layer', attrs: { width: W, height: H } }, bg);
const dust = (() => { const r = rng(7); return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, z: 0.3 + r() * 0.7, s: 0.6 + r() * 1.8, ph: r() * 6.28 })); })();
function drawDust(t, cam) {
  const g = dustCv.getContext('2d');
  g.clearRect(0, 0, W, H);
  for (const d of dust) {
    const x = ((d.x - cam.x * d.z * 0.6 + t * 6 * d.z) % W + W) % W;
    const y = ((d.y - cam.y * d.z * 0.6 - t * 10 * d.z) % H + H) % H;
    const a = 0.10 + 0.22 * d.z * (0.6 + 0.4 * Math.sin(t * 0.8 + d.ph));
    g.fillStyle = `rgba(143,195,255,${a.toFixed(3)})`;
    g.beginPath(); g.arc(x, y, d.s * d.z, 0, Math.PI * 2); g.fill();
  }
}

// ---------- Conteneur des scènes ----------
const scenesLayer = el('div', { cls: 'layer' }, stage);

// ---------- Contexte partagé avec les scènes ----------
const ctx = {
  W, H, stage, story, history, brand, media, base, repo, cue, scene: id => sceneById[id], line: id => lineById[id],
  img, makeLogo, getText, getJSON, showSlots: SHOW_SLOTS, camera: { x: 0, y: 0 }, bg: { grid: 1, dust: 1, tint: 0 }
};

const mounted = [];
for (const def of SCENES) {
  const root = el('div', { cls: 'scene', attrs: { 'data-scene': def.id } }, scenesLayer);
  const sc = sceneById[def.id];
  const api = await def.mount(root, ctx);
  mounted.push({ def, sc, root, api, pre: def.pre ?? 0.6, post: def.post ?? 0.8 });
}

// ---------- Chapitres (kicker au style du site, haut gauche, zone sûre) ----------
const chapters = [
  { scene: 's2-debuts', n: '01', label: 'Les débuts' },
  { scene: 's3-difficultes', n: '02', label: 'Le chemin' },
  { scene: 's4-construction', n: '03', label: 'La construction' },
  { scene: 's5-vision', n: '04', label: 'La vision' }
].map(c => {
  const node = el('div', { cls: 'abs kicker', style: { left: '90px', top: '236px' } }, stage);
  node.innerHTML = `<b>${c.n}</b><span class="sep">/</span>${c.label}`;
  const bar = el('div', { cls: 'abs', style: { left: '90px', top: '282px', height: '3px', width: '64px', background: BRAND.blue, transformOrigin: '0 50%' } }, stage);
  return { ...c, node, bar, sc: sceneById[c.scene] };
});
function updateChapters(t) {
  for (const c of chapters) {
    const a = c.sc.start + 0.35, b = c.sc.end - 0.25;
    const o = inOut(t, a, b, 0.6, 0.45);
    put(c.node, { o, x: (1 - ep(t, a, a + 0.8, ease.outExpo)) * -30 });
    put(c.bar, { o, extra: `scaleX(${ep(t, a + 0.15, a + 1.1, ease.outExpo).toFixed(3)})` });
  }
}

// ---------- Emplacements médias réels ----------
const slots = media.slots.map(s => {
  const [x, y, w, h] = s.box;
  let node = null, video = null;
  if (s.file) {
    node = el('div', { cls: 'media-slot', style: { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' } }, scenesLayer);
    const src = base + 'assets/footage/' + s.file;
    if (/\.(mp4|webm|mov)$/i.test(s.file)) {
      video = el('video', { attrs: { muted: '', playsinline: '', preload: 'auto' } }, node);
      video.src = src; video.muted = true;
    } else img(src, {}, node);
  } else if (SHOW_SLOTS) {
    node = el('div', { cls: 'slot', style: { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' } }, scenesLayer);
    node.innerHTML = `<div>EMPLACEMENT ${s.id}<small>${s.label}</small><small>assets/footage/ → config/media.json</small></div>`;
  }
  return { ...s, node, video };
});
async function updateSlots(t) {
  const waits = [];
  for (const s of slots) {
    if (!s.node) continue;
    const o = inOut(t, s.start, s.end, 0.35, 0.35);
    put(s.node, { o, s: 1 + 0.04 * prog(t, s.start, s.end) });
    if (s.video && o > 0) {
      const target = Math.max(0, t - s.start);
      if (Math.abs(s.video.currentTime - target) > 0.01) {
        waits.push(new Promise(r => { s.video.onseeked = r; s.video.currentTime = target; setTimeout(r, 2000); }));
      }
    }
  }
  await Promise.all(waits);
}

// ---------- Sous-titres ----------
const captions = NO_CAPTIONS ? { update() {} } : mountCaptions(stage, story, lineById);

// ---------- Grain + vignette (texture cinéma, discrète) ----------
const vignette = el('div', { cls: 'layer', style: { background: 'radial-gradient(130% 85% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' } }, stage);
const grainCv = el('canvas', { cls: 'layer', attrs: { width: 540, height: 960 }, style: { width: W + 'px', height: H + 'px', opacity: 0.07, mixBlendMode: 'overlay', imageRendering: 'pixelated' } }, stage);
const grainFrames = Array.from({ length: 6 }, (_, k) => {
  const c = document.createElement('canvas'); c.width = 540; c.height = 960;
  const g = c.getContext('2d'); const d = g.createImageData(540, 960); const r = rng(100 + k);
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0); return c;
});
const fadeBlack = el('div', { cls: 'layer', style: { background: '#000', pointerEvents: 'none' } }, stage);

// ---------- Rendu d'une image ----------
async function seek(t) {
  ctx.camera.x = 0; ctx.camera.y = 0; ctx.bg.grid = 1; ctx.bg.dust = 1;
  for (const m of mounted) {
    const active = t >= m.sc.start - m.pre && t <= m.sc.end + m.post;
    m.root.style.display = active ? 'block' : 'none';
    if (active) await m.api.update(t);
  }
  gridCv.style.opacity = (0.9 * ctx.bg.grid).toFixed(3);
  gridCv.style.transform = `translate3d(${(-ctx.camera.x * 0.25).toFixed(1)}px, ${(-ctx.camera.y * 0.25).toFixed(1)}px, 0)`;
  dustCv.style.opacity = ctx.bg.dust.toFixed(3);
  drawDust(t, ctx.camera);
  updateChapters(t);
  await updateSlots(t);
  captions.update(t);
  const gk = Math.floor(t * story.video.fps / 2) % grainFrames.length;
  grainCv.getContext('2d').drawImage(grainFrames[gk], 0, 0);
  // Ouverture au noir (0 → 0,5 s) et légère fermeture finale
  const fb = Math.max(1 - prog(t, 0, 0.5), prog(t, story.video.duration - 0.45, story.video.duration));
  fadeBlack.style.opacity = fb.toFixed(3);
}

await document.fonts.ready;
await Promise.all(pending);
for (const m of mounted) if (m.api.ready) await m.api.ready();
await seek(Number(params.get('t') || 0));
window.__seek = seek;
window.__duration = story.video.duration;
window.__fps = story.video.fps;
window.__ready = true;

// ---------- Aperçu interactif ----------
if (!RENDER) {
  const fit = () => { const s = Math.min(innerWidth / W, (innerHeight - 50) / H); stage.style.transform = `scale(${s})`; };
  fit(); addEventListener('resize', fit);
  const playBtn = document.getElementById('play'), scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), voBox = document.getElementById('vo');
  scrub.max = story.video.duration;
  const audio = new Audio();
  const setAudio = () => { const at = audio.currentTime; audio.src = base + (voBox.checked ? 'output/audio/mix_vo.wav' : 'output/audio/mix_music.wav'); audio.currentTime = at; };
  setAudio(); voBox.onchange = setAudio;
  let playing = false, t0 = 0, start = 0;
  const loop = async () => {
    if (!playing) return;
    const t = start + (performance.now() - t0) / 1000;
    if (t >= story.video.duration) { playing = false; playBtn.textContent = '▶︎ Lecture'; return; }
    await seek(t); scrub.value = t; tc.textContent = t.toFixed(2) + ' s';
    requestAnimationFrame(loop);
  };
  playBtn.onclick = () => {
    playing = !playing; playBtn.textContent = playing ? '❚❚ Pause' : '▶︎ Lecture';
    if (playing) { start = Number(scrub.value); t0 = performance.now(); audio.currentTime = start; audio.play().catch(() => {}); loop(); } else audio.pause();
  };
  scrub.oninput = () => { playing = false; audio.pause(); playBtn.textContent = '▶︎ Lecture'; seek(Number(scrub.value)); tc.textContent = Number(scrub.value).toFixed(2) + ' s'; };
}
