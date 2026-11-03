// SCÈNE 1 — LE HOOK (0 → 7,5 s)
// Idée : le carré bleu du logo NEJ est le point de départ de tout. Il apparaît seul
// dans le noir, clignote comme un curseur, « écrit » la première phrase, puis
// rejoint sa place dans le E pendant que le logo se révèle. On plonge ensuite à
// travers ce carré : on entre dans l'histoire.
import { el, put, prog, ep, ease, kf, inOut, splitWords, BRAND } from '../engine/lib.js';

export default {
  id: 's1-hook',
  pre: 0, post: 0.9,
  async mount(root, ctx) {
    const { cue, line, W } = ctx;
    const n01 = line('n01'), n02 = line('n02');

    // --- Titre 1 ---
    const TY = 700, FS = 94;
    const title = el('div', { cls: 'abs title', style: { left: '90px', top: TY + 'px', width: '920px', fontSize: FS + 'px', textAlign: 'left', whiteSpace: 'nowrap' } }, root);
    const words = ['Toute grande', 'aventure commence', '*quelque part.*'].flatMap(txt => splitWords(el('div', {}, title), txt));
    words.forEach(w => { w.style.overflow = 'hidden'; w.style.verticalAlign = 'top'; w.style.paddingBottom = '0.12em'; w.style.marginBottom = '-0.12em'; });

    // --- Logo + kicker ---
    const LOGO_W = 760;
    const group = el('div', { cls: 'abs', style: { left: 0, top: 0, width: W + 'px', height: '1920px', transformOrigin: '0 0' } }, root);
    const kicker = el('div', { cls: 'abs kicker', style: { left: '0', width: W + 'px', textAlign: 'center', top: '732px', fontSize: '32px' } }, group);
    kicker.innerHTML = "Voici l'histoire de";
    const logo = ctx.makeLogo(group, LOGO_W);
    const LX = (W - LOGO_W) / 2, LY = 830;
    logo.root.style.left = LX + 'px'; logo.root.style.top = LY + 'px';
    const shine = el('div', { cls: 'abs', style: { inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)', mixBlendMode: 'overlay', pointerEvents: 'none' } }, logo.root);
    logo.letters.appendChild(shine);
    const [sqE, sqJ] = logo.squares;

    // --- Le carré-curseur (devient le carré du E) ---
    const caret = el('div', { cls: 'abs', style: { left: 0, top: 0, background: ctx.brand.logoBlue, boxShadow: '0 0 40px rgba(0,125,254,0.55)' } }, root);
    const glow = el('div', { cls: 'abs', style: { left: '290px', top: '660px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,125,254,0.22), rgba(0,125,254,0) 65%)' } }, root);

    // Positions mesurées après chargement des polices
    let wordPos = [];
    const measure = () => {
      wordPos = words.map(w => ({ x: 90 + w.offsetLeft + w.offsetWidth, top: w.offsetTop }));
    };

    const [ecx, ecy, ew] = logo.squareCenter(0);
    const eH = (ctx.brand.boxes.squares[0][3] - ctx.brand.boxes.squares[0][1]) * logo.height;
    const E_X = LX + ecx, E_Y = LY + ecy;               // centre du carré du E à l'écran
    const CARET = 44;

    return {
      ready: async () => { measure(); },
      update(t) {
        if (!wordPos.length) measure();
        const tS = cue('s1_square'), tL = cue('s1_logo'), tZ = cue('s1_zoom');
        const wStart = n01.start - 0.05, stagger = 0.13;

        // Titre : apparition mot à mot, sortie floue vers le haut
        const exitA = n02.start - 0.45;
        words.forEach((w, i) => {
          const a = wStart + i * stagger;
          const pin = ep(t, a, a + 0.55, ease.outExpo);
          const pout = ep(t, exitA + i * 0.03, exitA + i * 0.03 + 0.4, ease.inCubic);
          w.firstChild.style.transform = `translateY(${((1 - pin) * 105).toFixed(1)}%)`;
          put(w, { o: 1 - pout, y: -40 * pout, blur: 10 * pout });
        });

        // Curseur : apparaît, clignote, suit l'écriture, puis rejoint le E
        const born = ep(t, tS, tS + 0.45, ease.outBack);
        const blink = t < wStart ? ((t - tS) % 0.7 < 0.4 ? 1 : 0.15) : 1;
        let cx = 540, cy = 900, cw = CARET, ch = CARET;
        // Index du dernier mot révélé
        let k = -1;
        words.forEach((w, i) => { if (t >= wStart + i * stagger + 0.08) k = i; });
        if (k >= 0 && wordPos[k]) {
          const p = wordPos[k];
          const lineTop = TY + p.top;
          cx = p.x + 18 + CARET / 2; cy = lineTop + FS * 0.6;
        } else { cx = 90 + CARET / 2; cy = TY + FS * 0.6; }
        // Avant l'écriture, le carré est au centre puis glisse au début de la ligne
        if (t < wStart) {
          const pm = ep(t, wStart - 0.35, wStart, ease.inOutCubic);
          cx = 540 + (90 + CARET / 2 - 540) * pm; cy = 900 + (TY + FS * 0.6 - 900) * pm;
        }
        // Glissement vers le E du logo
        const pE = ep(t, tL - 0.4, tL + 0.05, ease.inOutCubic);
        const lastX = cx, lastY = cy;
        cx = lastX + (E_X - lastX) * pE; cy = lastY + (E_Y - lastY) * pE;
        cw = CARET + (ew - CARET) * pE; ch = CARET + (eH - CARET) * pE;
        caret.style.width = cw + 'px'; caret.style.height = ch + 'px';
        const caretOn = t < tL + 0.05;
        put(caret, { o: caretOn ? born * blink : 0, x: cx - cw / 2, y: cy - ch / 2, s: 0.4 + 0.6 * born });
        put(glow, { o: caretOn ? 0.9 * born * (1 - pE) : 0, x: cx - 540, y: cy - 910 });

        // Logo : lettres balayées, J tombe en place, DIGITAL s'ouvre, reflet
        const pL = ep(t, tL, tL + 0.75, ease.outExpo);
        const pD = ep(t, tL + 0.55, tL + 1.2, ease.outExpo);
        logo.reveal(pL, pD);
        sqE.style.opacity = t >= tL + 0.05 ? 1 : 0;
        const pJ = ep(t, cue('s1_dot') - 0.3, cue('s1_dot'), ease.outBack);
        put(sqJ, { o: prog(t, cue('s1_dot') - 0.3, cue('s1_dot') - 0.15), y: -90 * (1 - pJ) });
        shine.style.transform = `translateX(${(-120 + 240 * ep(t, tL + 0.9, tL + 1.6, ease.inOutCubic)).toFixed(1)}%)`;
        put(logo.root, { o: t >= tL - 0.05 ? 1 : 0, s: 1 + 0.03 * prog(t, tL, tZ) });
        const kIn = ep(t, n02.start - 0.05, n02.start + 0.6, ease.outCubic);
        put(kicker, { o: kIn * (1 - prog(t, tZ - 0.2, tZ + 0.15)), y: 18 * (1 - kIn) });

        // Plongée dans le carré du E (raison : on entre dans la marque → l'histoire commence)
        const pz = ep(t, tZ, ctx.scene('s1-hook').end, ease.inExpo);
        const s = 1 + 38 * pz;
        group.style.transformOrigin = `${E_X}px ${E_Y}px`;
        group.style.transform = `scale(${s.toFixed(3)})`;
        group.style.opacity = (1 - prog(t, 7.28, 7.62)).toFixed(3);
        ctx.bg.grid = 0.35 + 0.65 * prog(t, 6.8, 7.6);
        ctx.bg.dust = 0.4 + 0.6 * prog(t, tL, tL + 1);
      }
    };
  }
};
