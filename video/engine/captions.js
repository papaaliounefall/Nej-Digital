// Sous-titres synchronisés sur la narration.
// - Découpage automatique en blocs de 2 lignes max (~44 caractères), aux ponctuations de préférence.
// - Les mots s'allument au rythme de la voix (répartition proportionnelle à la longueur).
// - Les répliques "display": "title" sont portées par la typographie de la scène : pas de sous-titre.
// - Position : centrée à x=500, bas à 470 px du bas → hors des boutons et de la légende TikTok.
import { el, splitWords, prog, ease, clamp } from './lib.js';

const MAX = 44;

function chunkText(text) {
  const phrases = text.match(/[^,;:…]+[,;:…]*\*?\s*/g).map(s => s.trim()).filter(Boolean);
  const out = [];
  let cur = '';
  for (const p of phrases) {
    if (!cur) cur = p;
    else if ((cur + ' ' + p).replace(/\*/g, '').length <= MAX) cur += ' ' + p;
    else { out.push(cur); cur = p; }
  }
  if (cur) out.push(cur);
  // Phrase trop longue → coupe au mot le plus proche du milieu
  return out.flatMap(c => {
    const plain = c.replace(/\*/g, '');
    if (plain.length <= MAX + 8) return [c];
    const words = c.split(' ');
    let best = 1, bestDiff = 1e9, acc = 0;
    for (let i = 0; i < words.length - 1; i++) {
      acc += words[i].replace(/\*/g, '').length + 1;
      const d = Math.abs(acc - plain.length / 2);
      if (d < bestDiff) { bestDiff = d; best = i + 1; }
    }
    // L'emphase *…* ne doit pas être coupée entre deux blocs
    let a = words.slice(0, best).join(' '), b = words.slice(best).join(' ');
    if ((a.match(/\*/g) || []).length % 2 === 1) { a += '*'; b = '*' + b; }
    return [a, b];
  });
}

export function mountCaptions(stage, story, lineById) {
  const root = el('div', { attrs: { id: 'captions' } }, stage);
  const blocks = [];
  for (const n of story.narration) {
    if (n.display !== 'caption') continue;
    const line = lineById[n.id];
    const chunks = chunkText(n.text);
    const weights = chunks.map(c => c.replace(/\*/g, '').length + 6);
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = line.start;
    chunks.forEach((c, i) => {
      const dur = line.duration * weights[i] / total;
      const node = el('div', { cls: 'cap' }, root);
      const words = splitWords(node, c);
      const lens = words.map(w => w.textContent.length + 2);
      const lt = lens.reduce((a, b) => a + b, 0);
      let wa = 0;
      const wt = lens.map(l => { const s = acc + dur * (wa / lt); wa += l; return s; });
      blocks.push({ node, words, wt, start: acc, end: acc + dur, last: i === chunks.length - 1, lineEnd: line.end });
      acc += dur;
    });
  }
  blocks.forEach((b, i) => {
    const next = blocks[i + 1];
    // Un bloc reste affiché jusqu'au suivant s'il est proche, sinon 0,45 s après la fin de la réplique
    // (jamais deux blocs à l'écran en même temps : le précédent sort juste avant l'entrée du suivant)
    b.hide = b.last ? (next && next.start - b.lineEnd < 0.6 ? next.start - 0.03 : b.lineEnd + 0.45) : next.start - 0.03;
    if (next) b.hide = Math.min(b.hide, next.start - 0.03);
  });

  return {
    update(t) {
      for (const b of blocks) {
        const visible = t >= b.start - 0.02 && t < b.hide;
        if (!visible) { b.node.style.visibility = 'hidden'; continue; }
        const pin = ease.outCubic(prog(t, b.start - 0.02, b.start + 0.14));
        const pout = prog(t, b.hide - 0.12, b.hide);
        b.node.style.visibility = 'visible';
        b.node.style.opacity = (pin * (1 - pout)).toFixed(3);
        b.node.style.transform = `translate(-50%, ${((1 - pin) * 14).toFixed(1)}px)`;
        b.words.forEach((w, k) => {
          const on = clamp((t - b.wt[k] + 0.04) / 0.12);
          w.style.opacity = (0.38 + 0.62 * on).toFixed(3);
        });
      }
    }
  };
}
