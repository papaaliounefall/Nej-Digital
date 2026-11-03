// SCÈNE 6 — LA CONCLUSION (75 → 90 s)
// Le globe se réduit au carré bleu du début : « ce n'est que le début » (rappel du hook).
// Le carré s'ouvre en mosaïque du parcours — uniquement des éléments réels déjà vus
// (équipe, captures du site, premier commit, heure du dernier commit de la soirée).
// La mosaïque se referme dans le carré, qui reprend sa place dans le logo.
// Carte finale : logo, « L'aventure ne fait que commencer. », adresse du site.
import { el, put, prog, ep, ease, kf, inOut, rng, clamp, lerp, BRAND } from '../engine/lib.js';

export default {
  id: 's6-conclusion',
  pre: 0.1, post: 0,
  async mount(root, ctx) {
    const { cue, scene, line, W, H, history, story } = ctx;
    const sc = scene('s6-conclusion');
    const n16 = line('n16');
    const first = history.commits[0];
    const night = history.commits.filter(c => c.date === '2026-09-27');
    const last = night[night.length - 1];

    // ---------- Mosaïque ----------
    const TW = 300, TH = 400, G = 20, COLS = 4, ROWS = 4;
    const wall = el('div', { cls: 'abs', style: { left: 0, top: 0, width: (COLS * (TW + G)) + 'px', height: (ROWS * (TH + G)) + 'px', transformOrigin: '0 0' } }, root);
    const cap = f => ctx.base + 'assets/captures/' + f;
    const tilesDef = [
      { img: ctx.repo + 'public/khady-cisse.webp', pos: '50% 20%' },
      { img: cap('mobile-home-hero.jpg'), pos: '50% 18%' },
      { text: ['Premier commit', first.message, `${first.date.split('-').reverse().join('.')} · ${first.time}`] },
      { img: ctx.repo + 'public/papa-alioune-fall.webp', pos: '50% 20%' },
      { img: cap('desktop-home-hero.jpg'), pos: '82% 50%' },
      { img: ctx.repo + 'public/anifa-djite.webp', pos: '50% 20%' },
      { text: ['27.09.2026', last ? last.time : '', 'dernier commit de la soirée'], big: true },
      { img: cap('mobile-equipe.jpg'), pos: '50% 4%' },
      { img: cap('mobile-apropos.jpg'), pos: '50% 2%' },
      { img: ctx.repo + 'public/amadou-sow.webp', pos: '50% 20%' },
      { img: cap('mobile-projets.jpg'), pos: '50% 30%' },
      { text: ['Notre méthode', 'Comprendre · Imaginer · Construire · Transformer', 'nej-digital'] },
      { img: cap('desktop-apropos.jpg'), pos: '20% 40%' },
      { img: cap('mobile-services.jpg'), pos: '50% 2%' },
      { img: cap('desktop-equipe.jpg'), pos: '50% 60%' },
      { img: cap('mobile-home-full.jpg'), pos: '50% 22%' }
    ];
    const R = rng(5);
    const tiles = tilesDef.map((d, i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const n = el('div', { cls: 'abs card', style: { left: c * (TW + G) + 'px', top: r * (TH + G) + 'px', width: TW + 'px', height: TH + 'px', overflow: 'hidden' } }, wall);
      if (d.img) {
        ctx.img(d.img, { style: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: d.pos, display: 'block' } }, n);
        el('div', { cls: 'abs', style: { inset: 0, background: 'linear-gradient(180deg, rgba(8,11,18,0) 50%, rgba(8,11,18,0.6))' } }, n);
      } else {
        n.style.padding = '28px'; n.style.display = 'flex'; n.style.flexDirection = 'column'; n.style.justifyContent = 'space-between';
        n.innerHTML = `<div class="kicker" style="font-size:16px;letter-spacing:0.18em;color:${BRAND.blue}">${d.text[0]}</div>
          <div style="font-size:${d.big ? 110 : 34}px;font-weight:800;letter-spacing:-0.03em;line-height:1.08;color:#fff">${d.text[1]}</div>
          <div style="font-size:18px;font-weight:600;color:${BRAND.muted}">${d.text[2]}</div>`;
      }
      return { n, c, r, d: R() };
    });

    // ---------- Carré (rappel du début) ----------
    const halo = el('div', { cls: 'abs', style: { left: '290px', top: '650px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,125,254,0.24), rgba(0,125,254,0) 65%)' } }, root);
    const ring = el('div', { cls: 'abs', style: { left: '490px', top: '850px', width: '100px', height: '100px', border: '2px solid rgba(143,195,255,0.6)' } }, root);
    const sq = el('div', { cls: 'abs', style: { left: 0, top: 0, width: '44px', height: '44px', background: ctx.brand.logoBlue, boxShadow: '0 0 40px rgba(0,125,254,0.6)' } }, root);

    // ---------- Logo + kicker + carte finale ----------
    const LOGO_W = 700;
    const logo = ctx.makeLogo(root, LOGO_W);
    const LX = (W - LOGO_W) / 2, LY0 = 820, LY1 = 470;
    logo.root.style.left = LX + 'px'; logo.root.style.top = LY0 + 'px';
    const shine = el('div', { cls: 'abs', style: { inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.6) 50%, transparent 65%)', mixBlendMode: 'overlay' } }, logo.letters);
    const [sqE, sqJ] = logo.squares;
    const [ecx, ecy, ew] = logo.squareCenter(0);
    const eH = (ctx.brand.boxes.squares[0][3] - ctx.brand.boxes.squares[0][1]) * logo.height;
    const kicker = el('div', { cls: 'abs kicker', style: { left: 0, width: W + 'px', textAlign: 'center', top: '730px', fontSize: '30px' } }, root);
    kicker.textContent = 'Bienvenue dans les coulisses de';

    const endTitle = el('div', { cls: 'abs title', style: { left: '60px', width: '960px', top: '820px', textAlign: 'center', fontSize: '84px', lineHeight: 1.08 } }, root);
    endTitle.innerHTML = `L'aventure ne fait<br/>que <span style="color:${BRAND.blue}">commencer.</span>`;
    const url = el('div', { cls: 'abs', style: { left: 0, width: W + 'px', top: '1068px', textAlign: 'center' } }, root);
    url.innerHTML = `<span style="display:inline-flex;align-items:center;gap:16px;background:${BRAND.blue};color:#fff;padding:24px 40px;font-size:36px;font-weight:800;letter-spacing:0.02em;box-shadow:0 20px 50px rgba(59,130,246,0.35)">${story.video.siteUrl}<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>`;
    const tag = el('div', { cls: 'abs kicker', style: { left: 0, width: W + 'px', textAlign: 'center', top: '1222px', fontSize: '22px', letterSpacing: '0.24em' } }, root);
    tag.innerHTML = '<b>Nouvelle ère</b> de la jeunesse digitale<span class="sep">/</span>Dakar';

    const CX = 540, CY = 900;
    return {
      update(t) {
        const t0 = sc.start, tM = cue('s6_montage'), tL = cue('s6_logo'), tE = cue('s6_end');
        // --- Carré : naît du globe, clignote (« le début »), puis devient la mosaïque
        const born = ep(t, t0, t0 + 0.4, ease.outBack);
        const blink = t > t0 + 0.8 && t < tM - 0.5 ? ((t - t0) % 0.8 < 0.5 ? 1 : 0.2) : 1;
        const sqOpen = ep(t, tM - 0.35, tM + 0.1, ease.inCubic);
        // retour du carré à la fin de la mosaïque, puis glissement dans le E
        const sqBack = ep(t, tL - 0.75, tL - 0.4, ease.outCubic);
        const toE = ep(t, tL - 0.35, tL + 0.05, ease.inOutCubic);
        const ex = LX + ecx, ey = LY0 + ecy;
        let x = lerp(CX, ex, toE), y = lerp(CY, ey, toE);
        let w = lerp(44, ew, toE), h = lerp(44, eH, toE);
        sq.style.width = w + 'px'; sq.style.height = h + 'px';
        const sqO = t < tM ? born * blink * (1 - sqOpen) : sqBack * (t < tL + 0.05 ? 1 : 0);
        put(halo, { o: (t < tM ? born * (1 - sqOpen) : 0) * (0.75 + 0.25 * Math.sin((t - t0) * 2.4)) });
        const rp = ((t - t0 - 0.3) % 1.9) / 1.9;
        put(ring, { o: t > t0 + 0.3 && t < tM - 0.4 ? 0.8 * (1 - rp) : 0, s: 0.5 + 2.6 * ease.outCubic(rp) });
        put(sq, { o: sqO, x: x - w / 2, y: y - h / 2, s: t < tM ? 0.5 + 0.5 * born + 0.6 * sqOpen : 1 });

        // --- Mosaïque : s'ouvre depuis le carré, dérive, se referme
        const open = ep(t, tM - 0.15, tM + 0.75, ease.outExpo);
        const close = ep(t, tL - 1.25, tL - 0.65, ease.inExpo);
        const wallOn = t > tM - 0.2 && t < tL - 0.6;
        wall.style.display = wallOn ? 'block' : 'none';
        if (wallOn) {
          const drift = (t - tM);
          const s = lerp(0.05, 1, open) * lerp(1, 0.04, close);
          // centre du mur sur le point (CX, CY), avec une dérive diagonale (on nous emmène)
          const wx = COLS * (TW + G) / 2 + 40 * drift, wy = ROWS * (TH + G) / 2 - 80 + 26 * drift;
          wall.style.transform = `translate(${(CX - wx * s).toFixed(1)}px, ${(CY - wy * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
          tiles.forEach(tl => {
            const a = tM - 0.1 + tl.d * 0.5;
            const p = ep(t, a, a + 0.6, ease.outCubic);
            put(tl.n, { o: p * (1 - close), s: 0.85 + 0.15 * p, y: (1 - p) * 30 + Math.sin(t * 0.7 + tl.d * 6) * 6 });
          });
        }

        // --- Logo (miroir du hook)
        const pL = ep(t, tL, tL + 0.75, ease.outExpo), pD = ep(t, tL + 0.5, tL + 1.15, ease.outExpo);
        logo.reveal(pL, pD);
        sqE.style.opacity = t >= tL + 0.05 ? 1 : 0;
        const pJ = ep(t, tL + 0.3, tL + 0.6, ease.outBack);
        put(sqJ, { o: prog(t, tL + 0.3, tL + 0.42), y: -90 * (1 - pJ) });
        const up = ep(t, tE - 0.2, tE + 0.8, ease.inOutCubic);
        const ly = lerp(LY0, LY1, up);
        put(logo.root, { o: t >= tL - 0.02 ? 1 : 0, y: ly - LY0, s: lerp(1, 0.86, up) * (1 + 0.02 * prog(t, tE, sc.end)) });
        shine.style.transform = `translateX(${(-120 + 240 * ep(t, tE + 0.6, tE + 1.4, ease.inOutCubic)).toFixed(1)}%)`;
        const kIn = ep(t, n16.start - 0.1, n16.start + 0.5);
        put(kicker, { o: kIn * (1 - ep(t, tE - 0.4, tE)), y: 16 * (1 - kIn) });

        // --- Carte finale
        const e1 = ep(t, tE + 0.2, tE + 0.9, ease.outExpo), e2 = ep(t, tE + 0.55, tE + 1.2, ease.outExpo), e3 = ep(t, tE + 0.9, tE + 1.6, ease.outExpo);
        put(endTitle, { o: e1, y: 40 * (1 - e1), blur: 8 * (1 - e1) });
        put(url, { o: e2, y: 30 * (1 - e2), s: 0.96 + 0.04 * e2 });
        put(tag, { o: e3 * 0.95, y: 20 * (1 - e3) });
        ctx.bg.grid = 0.4 + 0.6 * prog(t, tL, tE);
        ctx.bg.dust = 0.7;
      }
    };
  }
};
