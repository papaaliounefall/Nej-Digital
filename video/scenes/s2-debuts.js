// SCÈNE 2 — LES DÉBUTS (7,5 → 20 s)
// « Pas de grande structure » : un seul élément à l'écran, le tout premier commit
// réel du dépôt du site. Puis « une idée, une ambition » : un point de lumière qui
// se ramifie en réseau. Enfin « construire quelque chose de différent » : les nœuds
// du réseau se rangent en maquette fil de fer… qui devient la vraie page d'accueil
// mobile du site (capture réelle). De l'idée au produit, sans rien inventer.
import { el, put, prog, ep, ease, kf, inOut, rng, splitWords, clamp, lerp, BRAND } from '../engine/lib.js';
import { icon } from '../engine/icons.js';

// Boîtes de la page d'accueil mobile, en pixels de la capture (1170 px de large).
const BOXES = [
  [57, 73, 294, 162, 'logo'], [723, 75, 984, 158, 'btn'], [1009, 61, 1120, 172, 'line'],
  [48, 411, 937, 500, 'text'], [48, 589, 1089, 931, 'head'], [48, 1038, 1114, 1253, 'text'],
  [48, 1380, 1122, 1523, 'btn'], [48, 1572, 1122, 1722, 'line'], [48, 1918, 1101, 2127, 'text']
];
const SHOT_H = 2200; // on ne montre que le haut de la page (sans le globe)

export default {
  id: 's2-debuts',
  pre: 0.4, post: 0.8,
  async mount(root, ctx) {
    const { cue, line, scene, W, H, history } = ctx;
    const sc = scene('s2-debuts');
    const first = history.commits[0];
    const slotA = ctx.media.slots.find(s => s.id === 'S2-A');

    // --- A. Le premier commit (réel) ---
    const panel = el('div', { cls: 'abs card', style: { left: '130px', top: '800px', width: '820px', padding: '34px 38px', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' } }, root);
    const pLabel = el('div', { cls: 'kicker', style: { fontSize: '20px', letterSpacing: '0.22em', marginBottom: '22px', color: BRAND.muted2 } }, panel);
    pLabel.style.display = 'flex'; pLabel.style.alignItems = 'center'; pLabel.style.gap = '12px';
    pLabel.innerHTML = `${icon('commit', 30, BRAND.blue, 2.2)}<span>Premier commit du site · historique réel</span>`;
    const cmd = el('div', { style: { fontSize: '30px', fontWeight: 600, color: BRAND.muted, marginBottom: '16px' } }, panel);
    const out = el('div', { style: { fontSize: '38px', fontWeight: 700, color: BRAND.text } }, panel);
    const meta = el('div', { style: { fontSize: '26px', fontWeight: 600, color: BRAND.blue, marginTop: '14px' } }, panel);
    const [y, m, d] = first.date.split('-');
    const CMD = '$ git log --reverse';
    const OUT = first.message;
    meta.textContent = `${d}.${m}.${y} · ${first.time} · ${first.hash}`;

    // --- B. Titres « Une idée. » / « Une ambition. » ---
    const t1 = el('div', { cls: 'abs title', style: { left: 0, width: W + 'px', top: '520px', textAlign: 'center', fontSize: '112px', zIndex: 3 } }, root);
    t1.textContent = 'Une idée.';
    const t2 = el('div', { cls: 'abs title accent', style: { left: 0, width: W + 'px', top: '1060px', textAlign: 'center', fontSize: '112px', color: BRAND.blue, zIndex: 3 } }, root);
    t2.textContent = 'Une ambition.';

    // --- C. Téléphone : maquette → vraie capture ---
    const PW = 560, k = PW / 1170, PH = SHOT_H * k, PX = (W - PW) / 2, PY = 300;
    const phoneWrap = el('div', { cls: 'abs', style: { left: 0, top: 0, width: W + 'px', height: H + 'px', perspective: '1800px' } }, root);
    const phone = el('div', { cls: 'abs', style: { left: PX + 'px', top: PY + 'px', width: PW + 'px', height: PH + 'px', transformStyle: 'preserve-3d' } }, phoneWrap);
    const bezel = el('div', { cls: 'abs', style: { left: '-16px', top: '-16px', right: '-16px', bottom: '-16px', border: '3px solid #2A3345', borderRadius: '56px', background: '#05070C', boxShadow: '0 60px 140px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset' } }, phone);
    const screen = el('div', { cls: 'abs', style: { inset: 0, overflow: 'hidden', borderRadius: '40px', background: BRAND.bg } }, phone);
    const shot = ctx.img(ctx.base + 'assets/captures/mobile-home-hero.jpg', { cls: 'abs', style: { left: 0, top: 0, width: PW + 'px' } }, screen);
    const sheen = el('div', { cls: 'abs', style: { inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0) 60%)' } }, screen);
    // fondu bas de la capture (on coupe avant le globe)
    el('div', { cls: 'abs', style: { left: 0, right: 0, bottom: 0, height: '160px', background: `linear-gradient(180deg, rgba(10,11,14,0), ${BRAND.bg})` } }, screen);

    // --- Réseau / fil de fer (canvas plein écran) ---
    const cv = el('canvas', { cls: 'abs', attrs: { width: W, height: H }, style: { left: 0, top: 0 } }, root);
    const g = cv.getContext('2d');
    const CX = 540, CY = 900;
    const R = rng(42);
    const targets = [];
    BOXES.forEach(([x0, y0, x1, y1], bi) => {
      const pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      pts.forEach(([x, yy]) => targets.push({ x: PX + x * k, y: PY + yy * k, box: bi }));
    });
    const nodes = targets.map((tg, i) => {
      const a = R() * Math.PI * 2, r = 120 + Math.pow(R(), 0.7) * 360;
      return { ...tg, sx: CX + Math.cos(a) * r, sy: CY + Math.sin(a) * r * 1.25, delay: R() * 0.9, ph: R() * 6.28 };
    });
    // arêtes : 2 plus proches voisins (positions « réseau »)
    const edges = [];
    nodes.forEach((n, i) => {
      const near = nodes.map((o, j) => [j, Math.hypot(o.sx - n.sx, o.sy - n.sy)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
      near.forEach(([j]) => { if (!edges.some(e => (e[0] === j && e[1] === i))) edges.push([i, j]); });
    });

    return {
      update(t) {
        const hasFootage = !!slotA.file;
        // A. Panneau commit
        const aIn = ep(t, sc.start + 0.2, sc.start + 0.9, ease.outExpo);
        const aOut = ep(t, cue('s2_idea') - 0.55, cue('s2_idea') - 0.1, ease.inCubic);
        put(panel, { o: hasFootage ? 0 : aIn * (1 - aOut), y: 40 * (1 - aIn), s: 1 - 0.35 * aOut, blur: 8 * aOut });
        const tc = cue('s2_commit');
        const nCmd = Math.round(CMD.length * prog(t, tc - 0.6, tc));
        cmd.textContent = CMD.slice(0, nCmd) + (t < tc + 0.2 && Math.floor(t * 3) % 2 === 0 ? '▍' : '');
        const pOut = prog(t, tc + 0.15, tc + 1.1);
        out.textContent = pOut > 0 ? OUT.slice(0, Math.round(OUT.length * pOut)) : '';
        meta.style.opacity = ep(t, tc + 1.0, tc + 1.5).toFixed(3);

        // B. Titres
        const ti = cue('s2_idea'), ta = cue('s2_ambition'), tw = cue('s2_wire');
        const o1 = ep(t, ti, ti + 0.5, ease.outExpo), x1 = ep(t, tw - 0.5, tw - 0.05, ease.inCubic);
        put(t1, { o: o1 * (1 - x1), y: 30 * (1 - o1) - 40 * x1, blur: 12 * x1 + 6 * (1 - o1) });
        const o2 = ep(t, ta, ta + 0.5, ease.outExpo);
        put(t2, { o: o2 * (1 - x1), y: 30 * (1 - o2) + 40 * x1, blur: 12 * x1 + 6 * (1 - o2) });

        // Réseau → fil de fer
        g.clearRect(0, 0, W, H);
        const born = ep(t, ti - 0.15, ti + 1.6, ease.outCubic);
        const migrate = (n) => ep(t, tw + n.delay * 0.5, tw + 0.9 + n.delay * 0.5, ease.inOutCubic);
        const realIn = ep(t, cue('s2_real'), cue('s2_real') + 0.9, ease.inOutCubic);
        const netAlpha = 1 - realIn;
        const pos = nodes.map(n => {
          const pm = migrate(n);
          const wob = (1 - pm) * 6;
          const bx = lerp(CX, n.sx, ease.outCubic(clamp((born * 1.6) - n.delay * 0.6))) + Math.sin(t * 1.3 + n.ph) * wob;
          const by = lerp(CY, n.sy, ease.outCubic(clamp((born * 1.6) - n.delay * 0.6))) + Math.cos(t * 1.1 + n.ph) * wob;
          return [lerp(bx, n.x, pm), lerp(by, n.y, pm), pm];
        });
        if (t >= ti - 0.2 && netAlpha > 0) {
          // arêtes du réseau (disparaissent pendant la migration)
          const ea = prog(t, ti, ti + 0.8) * (1 - prog(t, tw, tw + 0.7));
          g.lineWidth = 1.5;
          for (const [i, j] of edges) {
            g.strokeStyle = `rgba(90,162,255,${(0.35 * ea * netAlpha).toFixed(3)})`;
            g.beginPath(); g.moveTo(pos[i][0], pos[i][1]); g.lineTo(pos[j][0], pos[j][1]); g.stroke();
          }
          // rectangles du fil de fer
          BOXES.forEach(([x0, y0, x1b, y1b, kind], bi) => {
            const ps = pos.slice(bi * 4, bi * 4 + 4);
            const pr = Math.min(...ps.map(p => p[2]));
            if (pr <= 0) return;
            g.strokeStyle = `rgba(143,195,255,${(0.75 * pr * netAlpha).toFixed(3)})`;
            g.lineWidth = 2;
            g.beginPath(); ps.forEach((p, q) => (q ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.stroke();
            const fill = { btn: 'rgba(59,130,246,0.35)', head: 'rgba(245,245,242,0.10)', text: 'rgba(156,163,175,0.10)', logo: 'rgba(255,255,255,0.12)', line: 'rgba(255,255,255,0.04)' }[kind];
            g.fillStyle = fill.replace(/[\d.]+\)$/, m => (parseFloat(m) * pr * netAlpha).toFixed(3) + ')');
            g.fill();
          });
          // nœuds
          const center = 1 - ep(t, ti + 0.2, ti + 1.2);
          pos.forEach(([x, yy, pm]) => {
            g.fillStyle = `rgba(191,224,255,${(0.95 * netAlpha * Math.max(born, 0.0)).toFixed(3)})`;
            g.beginPath(); g.arc(x, yy, 3.2 + 1.2 * (1 - pm), 0, Math.PI * 2); g.fill();
          });
          // point d'origine (l'idée)
          if (center > 0) {
            const gr = g.createRadialGradient(CX, CY, 0, CX, CY, 120);
            gr.addColorStop(0, `rgba(191,224,255,${(0.9 * center).toFixed(3)})`); gr.addColorStop(1, 'rgba(59,130,246,0)');
            g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, 120, 0, Math.PI * 2); g.fill();
          }
        }
        // point de lumière initial, juste avant l'idée (le commit se « condense »)
        const spark = inOut(t, ti - 0.5, ti + 0.4, 0.3, 0.3);
        if (spark > 0) {
          const gr = g.createRadialGradient(CX, CY, 0, CX, CY, 70);
          gr.addColorStop(0, `rgba(255,255,255,${spark.toFixed(3)})`); gr.addColorStop(1, 'rgba(59,130,246,0)');
          g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, 70, 0, Math.PI * 2); g.fill();
        }

        // Téléphone (cadre + vraie capture)
        const out2 = ep(t, cue('s2_out'), sc.end + 0.1, ease.inExpo);
        const bz = ep(t, cue('s2_real') - 0.3, cue('s2_real') + 0.7, ease.outCubic);
        put(bezel, { o: bz });
        put(shot, { o: realIn });
        screen.style.background = realIn > 0 ? BRAND.bg : 'transparent';
        screen.style.opacity = Math.max(realIn, bz * 0.6).toFixed(3);
        sheen.style.transform = `translateX(${(-100 + 200 * prog(t, cue('s2_real') + 0.4, cue('s2_real') + 1.6)).toFixed(1)}%)`;
        const tilt = ep(t, cue('s2_real'), sc.end, ease.inOutSine);
        const ry = -14 * tilt, rx = 6 * tilt;
        const scroll = -ep(t, cue('s2_real') + 1.0, sc.end + 0.3, ease.inOutCubic) * 120;
        shot.style.transform = `translateY(${scroll.toFixed(1)}px)`;
        phone.style.transform = `translate3d(0, ${(-1300 * out2).toFixed(1)}px, ${(-200 * tilt).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
        phone.style.opacity = t < tw ? 0 : 1;
        phone.style.filter = out2 > 0.05 ? `blur(${(out2 * 14).toFixed(1)}px)` : 'none';
        cv.style.transform = phone.style.transform.split(' rotate')[0];
        ctx.camera.y = 300 * prog(t, sc.start, sc.end);
      }
    };
  }
};
