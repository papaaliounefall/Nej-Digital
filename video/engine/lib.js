// Outils d'animation partagés par toutes les scènes.
// Tout est fonction du temps t (en secondes) : aucune animation CSS, aucun
// requestAnimationFrame dans les scènes → chaque image est reproductible.

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, p) => a + (b - a) * p;
/** Progression 0→1 de t entre a et b. */
export const prog = (t, a, b) => clamp((t - a) / (b - a));

export const ease = {
  linear: p => p,
  inCubic: p => p * p * p,
  outCubic: p => 1 - Math.pow(1 - p, 3),
  inOutCubic: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  outQuart: p => 1 - Math.pow(1 - p, 4),
  outExpo: p => (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  inExpo: p => (p === 0 ? 0 : Math.pow(2, 10 * p - 10)),
  inOutExpo: p => (p === 0 ? 0 : p === 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
  outBack: p => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  inOutSine: p => -(Math.cos(Math.PI * p) - 1) / 2,
  // Courbe « cinéma » : départ franc, arrivée très douce.
  cine: p => 1 - Math.pow(1 - p, 3.6)
};

/** Progression easée. */
export const ep = (t, a, b, e = ease.outCubic) => e(prog(t, a, b));

/** Enveloppe entrée / tenue / sortie (0→1→0). */
export function inOut(t, a, b, fadeIn = 0.4, fadeOut = 0.4, eIn = ease.outCubic, eOut = ease.inCubic) {
  if (t < a || t > b) return 0;
  const i = fadeIn > 0 ? eIn(prog(t, a, a + fadeIn)) : 1;
  const o = fadeOut > 0 ? 1 - eOut(prog(t, b - fadeOut, b)) : 1;
  return Math.min(i, o);
}

/** Interpolation par images clés : kf(t, [[t0, v0], [t1, v1], ...], easing). */
export function kf(t, keys, e = ease.inOutCubic) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return lerp(v0, v1, e((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Création d'élément DOM concise. */
export function el(tag, opts = {}, parent) {
  const n = document.createElement(tag);
  if (opts.cls) n.className = opts.cls;
  if (opts.html != null) n.innerHTML = opts.html;
  if (opts.text != null) n.textContent = opts.text;
  if (opts.style) Object.assign(n.style, opts.style);
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}

/** Applique opacité + transform en une fois (évite les reflows inutiles). */
export function put(node, { o, x = 0, y = 0, s = 1, r = 0, blur = 0, extra = '' } = {}) {
  if (o != null) {
    node.style.opacity = o.toFixed(4);
    node.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
  }
  node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)}) rotate(${r.toFixed(3)}deg) ${extra}`;
  node.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
}

/** Découpe un texte en mots animables. `*mot*` = mis en valeur (bleu NEJ). */
export function splitWords(container, text, wordCls = 'w') {
  const words = [];
  let accent = false;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let w = raw;
    const start = w.startsWith('*');
    const end = w.endsWith('*') || /\*[.,…:!?]$/.test(w);
    if (start) accent = true;
    w = w.replace(/\*/g, '');
    const span = el('span', { cls: wordCls + (accent ? ' accent' : '') }, container);
    el('span', { cls: 'wi', text: w }, span);
    container.appendChild(document.createTextNode(' '));
    words.push(span);
    if (end) accent = false;
  }
  return words;
}

export const BRAND = {
  bg: '#0A0B0E', bgHero: '#080B12', card: '#111827', border: '#1F2937', border2: '#374151',
  blue: '#3B82F6', blueDeep: '#2563EB', logoBlue: '#007DFE', text: '#F9FAFB', cream: '#F5F5F2',
  muted: '#9CA3AF', muted2: '#8B93A1', globeLine: '#3a5a8c', globeAfrica: '#8fc3ff', glow: '#5aa2ff'
};
