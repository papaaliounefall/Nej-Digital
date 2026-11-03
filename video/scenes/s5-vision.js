// SCÈNE 5 — NOTRE VISION (55 → 75 s)
// Le logo de la scène 4 s'est réduit à un point : c'est Dakar. On recule jusqu'à voir
// le globe du site (mêmes données, mêmes couleurs). « Utiles, innovants, accessibles »
// s'inscrivent au rythme de la voix ; puis les connexions réelles du site partent de
// Dakar. Sans voix, la musique porte les trois affirmations de la marque.
import { el, put, prog, ep, ease, kf, inOut, rng, clamp, lerp, BRAND } from '../engine/lib.js';
import { buildGlobe, parseCities, project, slerp, drawGlobe, glowDot } from '../engine/globe.js';

const STATEMENTS = [
  ['Conçus depuis', "*l'Afrique.*"],
  ['Une ambition', '*panafricaine.*'],
  ['La technologie de la', '*nouvelle génération.*']
];
const ST_SIZE = [106, 106, 86];

export default {
  id: 's5-vision',
  pre: 0.2, post: 0.6,
  async mount(root, ctx) {
    const { cue, scene, W, H } = ctx;
    const sc = scene('s5-vision');
    const topo = await ctx.getJSON(ctx.repo + 'src/data/worldCountries110m.json');
    const globe = buildGlobe(topo);
    const { cities, connections } = parseCities(await ctx.getText(ctx.repo + 'src/data/globeCities.ts'));
    const byName = Object.fromEntries(cities.map(c => [c.name, c]));
    const dakar = cities.find(c => c.primary) || byName.Dakar;
    const links = connections.map(([a, b]) => [byName[a], byName[b]]).filter(([a, b]) => a && b);

    const cv = el('canvas', { cls: 'abs', attrs: { width: W, height: H }, style: { left: 0, top: 0 } }, root);
    const g = cv.getContext('2d');
    const R = rng(11);
    const stars = Array.from({ length: 140 }, () => ({ x: R() * W, y: R() * H, s: 0.5 + R() * 1.4, ph: R() * 6.28 }));

    // Étiquettes des villes
    const labels = links.map(([, c]) => el('div', { cls: 'abs', text: c.name, style: { fontSize: '22px', fontWeight: 700, color: '#BFE0FF', whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(0,0,0,0.9)' } }, root));
    const dLabel = el('div', { cls: 'abs', style: { fontSize: '26px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,0.9)', letterSpacing: '0.04em' } }, root);
    dLabel.textContent = 'DAKAR';

    // « Utiles · Innovants · Accessibles »
    const row = el('div', { cls: 'abs', style: { left: 0, width: W + 'px', top: '330px', textAlign: 'center', fontSize: '58px', fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' } }, root);
    const ws = ['Utiles', 'Innovants', 'Accessibles'].map((w, i) => {
      const s = el('span', { style: { display: 'inline-block', color: BRAND.cream } }, row);
      s.innerHTML = w + (i < 2 ? `<span style="color:${BRAND.blue};margin:0 18px">·</span>` : `<span style="color:${BRAND.blue}">.</span>`);
      return s;
    });

    // Les trois affirmations
    const st = STATEMENTS.map((lines, i) => {
      const n = el('div', { cls: 'abs title', style: { left: '30px', width: '1020px', top: '520px', textAlign: 'center', fontSize: ST_SIZE[i] + 'px', lineHeight: 1.06, whiteSpace: 'nowrap' } }, root);
      n.innerHTML = lines.map(l => l.startsWith('*') ? `<div class="accent" style="color:${BRAND.blue}">${l.replace(/\*/g, '')}</div>` : `<div>${l}</div>`).join('');
      return n;
    });

    return {
      update(t) {
        const t0 = sc.start, tA = cue('s5_arcs'), tS = [cue('s5_st1'), cue('s5_st2'), cue('s5_st3')], tO = cue('s5_out');
        // Caméra du globe
        const zoom = ep(t, t0, t0 + 3.0, ease.outCubic);
        const push = ep(t, tS[0] - 0.8, tS[0] + 0.6, ease.inOutCubic);
        const out = ep(t, tO, sc.end, ease.inCubic);
        let r = lerp(3400, 480, zoom);
        r = lerp(r, 780, push);
        r = r * (1 - out);
        const cy = lerp(lerp(900, 960, zoom), 1420, push) * (1 - out) + 900 * out;
        const view = {
          lng0: lerp(dakar.lng, 6, ep(t, t0 + 0.3, t0 + 4.2, ease.inOutCubic)) + (t - t0) * 0.8,
          lat0: lerp(dakar.lat, 6, ep(t, t0 + 0.3, t0 + 4.2, ease.inOutCubic)),
          cx: 540, cy, r: Math.max(r, 0.01)
        };
        g.clearRect(0, 0, W, H);
        // étoiles
        const sa = prog(t, t0 + 0.5, t0 + 2.5) * (1 - out);
        for (const s of stars) {
          g.fillStyle = `rgba(191,224,255,${(sa * (0.25 + 0.35 * Math.sin(t * 1.5 + s.ph) ** 2)).toFixed(3)})`;
          g.fillRect(s.x, s.y - (t - t0) * 6 * s.s, s.s, s.s);
        }
        const gAlpha = (1 - 0.45 * push) * prog(t, t0 - 0.2, t0 + 0.25);
        if (r > 2) drawGlobe(g, globe, view, { alpha: gAlpha });

        // Connexions depuis Dakar (données réelles du site)
        const [dx, dy, dc] = project(dakar.lng, dakar.lat, view, 0.004);
        links.forEach(([a, b], i) => {
          const s0 = tA + i * 0.32;
          const pr = ep(t, s0, s0 + 1.0, ease.inOutCubic);
          const lab = labels[i];
          if (pr <= 0 || r < 5) { lab.style.visibility = 'hidden'; return; }
          const N = 48;
          g.lineWidth = Math.max(1.5, r / 260);
          g.strokeStyle = `rgba(90,162,255,${(0.75 * gAlpha * (1 - out)).toFixed(3)})`;
          g.beginPath();
          let pen = false, head = null;
          for (let k = 0; k <= N * pr; k++) {
            const f = k / N;
            const p = slerp(a, b, f);
            const alt = Math.sin(Math.PI * f) * Math.min(0.28, 0.12 + p.d * 0.09);
            const [x, y, c] = project(p.lng, p.lat, view, alt);
            const hidden = c < 0 && Math.hypot(x - view.cx, y - view.cy) < view.r;
            if (!hidden) { pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; head = [x, y]; } else pen = false;
          }
          g.stroke();
          if (head && pr < 1) glowDot(g, head[0], head[1], 3, 'rgba(232,242,255,A)', gAlpha);
          const [bx, by, bc] = project(b.lng, b.lat, view, 0.004);
          const vis = bc > 0.05 && pr >= 1;
          if (vis) glowDot(g, bx, by, 3.5, 'rgba(191,224,255,A)', gAlpha * (1 - out));
          const lo = vis ? ep(t, s0 + 1.0, s0 + 1.4) * (1 - push) : 0;
          put(lab, { o: lo, x: bx + 14, y: by - 14 });
        });
        if (dc > 0 && r > 2) {
          const pulse = ((t - t0) % 1.6) / 1.6;
          g.strokeStyle = `rgba(191,224,255,${(0.7 * (1 - pulse) * gAlpha).toFixed(3)})`; g.lineWidth = 2;
          g.beginPath(); g.arc(dx, dy, 6 + 40 * pulse, 0, Math.PI * 2); g.stroke();
          glowDot(g, dx, dy, 5 + 6 * out, 'rgba(255,255,255,A)', 1);
        }
        put(dLabel, { o: (dc > 0 ? ep(t, t0 + 1.6, t0 + 2.4) : 0) * (1 - push), x: dx - 120, y: dy - 16 });

        // Utiles · Innovants · Accessibles (calés sur la voix)
        const rowOut = ep(t, tS[0] - 1.0, tS[0] - 0.5, ease.inCubic);
        [cue('s5_w1'), cue('s5_w2'), cue('s5_w3')].forEach((tw, i) => {
          const p = ep(t, tw - 0.1, tw + 0.35, ease.outExpo);
          put(ws[i], { o: p * (1 - rowOut), y: 30 * (1 - p), blur: 6 * (1 - p) + 8 * rowOut });
        });

        // Affirmations (sans voix, portées par la musique)
        st.forEach((n, i) => {
          const a = tS[i], b = i < 2 ? tS[i + 1] - 0.1 : tO + 0.35;
          const pin = ep(t, a - 0.12, a + 0.45, ease.outExpo);
          const pout = ep(t, b - 0.35, b, ease.inCubic);
          const on = t >= a - 0.12 && t <= b;
          put(n, { o: on ? pin * (1 - pout) : 0, y: 40 * (1 - pin) - 30 * pout, s: 1 + 0.03 * prog(t, a, b), blur: 10 * (1 - pin) + 10 * pout });
        });
        ctx.bg.grid = 0.25 + 0.4 * out;
        ctx.bg.dust = 0.5;
      }
    };
  }
};
