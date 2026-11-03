// SCÈNE 4 — LA CONSTRUCTION (37,5 → 55 s)
// La ligne laissée par la scène 3 devient un sol. On y empile, bloc par bloc, la
// méthode réelle de NEJ (site : « Notre méthode, en quatre temps »). Puis l'équipe,
// montrée comme un collectif et non par quelques portraits : l'équipe ne se limite pas
// aux profils affichés sur le site. Reprend le titre et les métiers de la page Équipe.
// Enfin l'écosystème : le logo au centre, les
// domaines d'intervention réels (site : Nos services) et de vraies captures du site.
// Les produits restent volontairement anonymes : le site a choisi de ne présenter
// aucun produit tant qu'aucun n'est en ligne (cf. README du site).
import { el, put, prog, ep, ease, kf, inOut, rng, clamp, lerp, BRAND } from '../engine/lib.js';
import { icon } from '../engine/icons.js';

// Contenus repris du site (src/data/nejData.ts → PHILOSOPHY_PILLARS, TEAM_MEMBERS ; servicesData.ts)
const METHOD = [
  { n: '01', title: 'Comprendre', sub: 'Partir des réalités du terrain.', icon: 'eye' },
  { n: '02', title: 'Imaginer', sub: 'Concevoir des solutions adaptées.', icon: 'lightbulb' },
  { n: '03', title: 'Construire', sub: 'Développer des produits fiables.', icon: 'hammer' },
  { n: '04', title: 'Transformer', sub: 'Faire évoluer avec les usages.', icon: 'refresh' }
];
// Page Équipe du site : « Une équipe multidisciplinaire combinant ingénieurs logiciels,
// designers UX et spécialistes terrain »
const DISCIPLINES = [
  { label: 'Ingénieurs logiciels', icon: 'code', row: 1, x: 120 },
  { label: 'Designers UX', icon: 'layers', row: 3, x: 330 },
  { label: 'Spécialistes terrain', icon: 'pin', row: 5, x: 180 }
];
const DOMAINS = [
  { label: 'Développement', sub: 'web & mobile', icon: 'code' },
  { label: 'IA', sub: '& innovation', icon: 'brain' },
  { label: 'Transformation', sub: 'digitale', icon: 'refresh' },
  { label: 'Formation', sub: '& accompagnement', icon: 'cap' },
  { label: 'Entrepreneuriat', sub: '& projets numériques', icon: 'rocket' }
];

export default {
  id: 's4-construction',
  pre: 0.3, post: 0.7,
  async mount(root, ctx) {
    const { cue, scene, W, H } = ctx;
    const sc = scene('s4-construction');

    // ---------- A. Méthode en 4 blocs ----------
    const FLOOR = 1180, BH = 128, GAP = 14;
    const floor = el('div', { cls: 'abs', style: { left: '90px', width: '900px', top: FLOOR + 'px', height: '4px', background: BRAND.blue, boxShadow: '0 0 30px rgba(59,130,246,0.7)' } }, root);
    const mLbl = el('div', { cls: 'abs kicker', style: { left: '90px', top: (FLOOR - 4 * (BH + GAP) - 58) + 'px', fontSize: '22px', letterSpacing: '0.2em' } }, root);
    mLbl.innerHTML = '<b>Notre méthode</b><span class="sep">/</span>en quatre temps';
    const blocks = METHOD.map((m, i) => {
      const b = el('div', { cls: 'abs card', style: { left: '90px', width: '900px', height: BH + 'px', top: (FLOOR - (i + 1) * (BH + GAP) + GAP) + 'px', display: 'flex', alignItems: 'center', gap: '28px', padding: '0 34px', boxShadow: '0 20px 50px rgba(0,0,0,0.35)' } }, root);
      b.innerHTML = `<div style="width:72px;height:72px;flex:none;background:${BRAND.bg};border:2px solid ${BRAND.border};display:flex;align-items:center;justify-content:center">${icon(m.icon, 34, BRAND.blue)}</div>
        <div style="flex:1"><div style="font-size:42px;font-weight:800;letter-spacing:-0.02em;color:#fff">${m.title}</div><div style="font-size:24px;color:${BRAND.muted};margin-top:4px">${m.sub}</div></div>
        <div style="font-size:26px;font-weight:800;color:${BRAND.blue}">${m.n}</div>`;
      return b;
    });

    // ---------- B. L'équipe : un collectif (pas de portraits individuels) ----------
    const tLbl = el('div', { cls: 'abs kicker', style: { left: '90px', top: '330px', fontSize: '22px', letterSpacing: '0.2em' } }, root);
    tLbl.innerHTML = "<b>L'équipe</b><span class=\"sep\">/</span>multidisciplinaire";
    const tTitle = el('div', { cls: 'abs title', style: { left: '90px', top: '380px', width: '940px', fontSize: '72px', lineHeight: 1.08, whiteSpace: 'nowrap' } }, root);
    tTitle.innerHTML = `Derrière la technologie,<br/><span style="color:${BRAND.blue}">des personnes.</span>`;
    // Champ de carrés (motif du logo) : sans bord visible, il ne suggère aucun effectif précis.
    const GCOLS = 11, GROWS = 8, CELL = 62, GG = 22;
    const gridW = GCOLS * CELL + (GCOLS - 1) * GG, gridH = GROWS * CELL + (GROWS - 1) * GG;
    const field = el('div', { cls: 'abs', style: { left: ((W - gridW) / 2) + 'px', top: '600px', width: gridW + 'px', height: gridH + 'px',
      WebkitMaskImage: 'radial-gradient(ellipse 58% 60% at 50% 50%, #000 45%, transparent 100%)', maskImage: 'radial-gradient(ellipse 58% 60% at 50% 50%, #000 45%, transparent 100%)' } }, root);
    const RG = rng(23);
    const people = [];
    for (let r = 0; r < GROWS; r++) for (let c = 0; c < GCOLS; c++) {
      const n = el('div', { cls: 'abs', style: { left: c * (CELL + GG) + 'px', top: r * (CELL + GG) + 'px', width: CELL + 'px', height: CELL + 'px', border: `2px solid ${BRAND.border}`, background: BRAND.card } }, field);
      const d = Math.hypot(c - (GCOLS - 1) / 2, (r - (GROWS - 1) / 2) * 1.2);
      people.push({ n, r, c, d, lit: RG() < 0.28, ph: RG() * 6.28, sp: 0.6 + RG() * 0.9 });
    }
    const pills = DISCIPLINES.map(dd => {
      const p = el('div', { cls: 'abs card', style: { left: dd.x + 'px', top: (600 + dd.row * (CELL + GG) - 10) + 'px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px', whiteSpace: 'nowrap', background: 'rgba(10,11,14,0.94)', borderColor: BRAND.blue, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' } }, root);
      p.innerHTML = `${icon(dd.icon, 32, BRAND.blue)}<span style="font-size:34px;font-weight:800;color:#fff;letter-spacing:-0.01em">${dd.label}</span>`;
      return { p, ...dd };
    });

    // ---------- C. Écosystème ----------
    const eco = el('div', { cls: 'abs', style: { left: 0, top: 0, width: W + 'px', height: H + 'px' } }, root);
    const CX = 540, CY = 820;
    // captures réelles du site, en profondeur (parallaxe)
    const shots = [
      { src: 'desktop-home-hero.jpg', x: -120, y: 300, w: 760, r: -8, z: 0.5 },
      { src: 'desktop-apropos.jpg', x: 520, y: 1000, w: 700, r: 7, z: 0.7 },
      { src: 'mobile-apropos.jpg', x: 690, y: 250, w: 330, r: 6, z: 0.35, crop: 1400 },
      { src: 'mobile-projets.jpg', x: -40, y: 1010, w: 330, r: -6, z: 0.6, crop: 1500 }
    ].map(s => {
      const box = el('div', { cls: 'abs', style: { left: s.x + 'px', top: s.y + 'px', width: s.w + 'px', overflow: 'hidden', border: `2px solid ${BRAND.border}`, boxShadow: '0 40px 90px rgba(0,0,0,0.6)', height: s.crop ? (s.w * s.crop / 1170) + 'px' : 'auto' } }, eco);
      ctx.img(ctx.base + 'assets/captures/' + s.src, { style: { display: 'block', width: '100%' } }, box);
      return { ...s, box };
    });
    const lines = el('canvas', { cls: 'abs', attrs: { width: W, height: H }, style: { left: 0, top: 0 } }, eco);
    const lg = lines.getContext('2d');
    const logo = ctx.makeLogo(eco, 400);
    logo.root.style.left = (CX - 200) + 'px'; logo.root.style.top = (CY - logo.height / 2) + 'px';
    const halo = el('div', { cls: 'abs', style: { left: (CX - 330) + 'px', top: (CY - 330) + 'px', width: '660px', height: '660px', background: 'radial-gradient(circle, rgba(59,130,246,0.25), rgba(59,130,246,0) 62%)' } }, eco);
    eco.insertBefore(halo, lines);
    const nodes = DOMAINS.map((d, i) => {
      const a = -Math.PI / 2 + (i / DOMAINS.length) * Math.PI * 2;
      const nx = CX + Math.cos(a) * 330, ny = CY + Math.sin(a) * 400;
      const n = el('div', { cls: 'abs card', style: { left: 0, top: 0, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' } }, eco);
      n.innerHTML = `${icon(d.icon, 30, BRAND.blue)}<div><div style="font-size:27px;font-weight:800;color:#fff">${d.label}</div><div style="font-size:18px;color:${BRAND.muted}">${d.sub}</div></div>`;
      return { n, nx, ny, a };
    });
    // produits : en construction, sans nom (choix de communication du site)
    const prod = el('div', { cls: 'abs card', style: { left: '120px', top: '520px', width: '840px', padding: '40px 42px 44px', textAlign: 'center', boxShadow: '0 50px 120px rgba(0,0,0,0.7)', background: 'rgba(17,24,39,0.96)' } }, root);
    prod.innerHTML = `<div class="kicker" style="font-size:20px;letter-spacing:0.2em;display:flex;justify-content:center;align-items:center;gap:12px">${icon('layers', 24, BRAND.blue)}<b>L'écosystème de produits NEJ</b></div>
      <div class="title" style="font-size:60px;margin:22px 0 26px">Des solutions numériques en construction.</div>`;
    const tiles = el('div', { style: { position: 'relative', height: '230px', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)' } }, prod);
    const tileRow = el('div', { cls: 'abs', style: { left: 0, top: 0, display: 'flex', gap: '22px' } }, tiles);
    for (let i = 0; i < 6; i++) {
      const tl = el('div', { style: { width: '250px', height: '220px', flex: 'none', background: BRAND.bg, border: `2px solid ${BRAND.border}`, padding: '22px', filter: 'blur(5px)' } }, tileRow);
      tl.innerHTML = `<div style="width:56px;height:56px;background:rgba(59,130,246,0.35);margin-bottom:18px"></div><div style="height:16px;width:80%;background:#2A3345;margin-bottom:12px"></div><div style="height:12px;width:60%;background:#1F2937;margin-bottom:8px"></div><div style="height:12px;width:70%;background:#1F2937"></div>`;
    }
    const lockBadge = el('div', { cls: 'abs badge', style: { left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: BRAND.bg, color: '#fff', borderColor: BRAND.blue } }, tiles);
    lockBadge.innerHTML = `${icon('lock', 22, BRAND.blue)} En développement`;

    return {
      update(t) {
        const tb = [cue('s4_b1'), cue('s4_b2'), cue('s4_b3'), cue('s4_b4')];
        const tT = cue('s4_team'), tE = cue('s4_eco'), tP = cue('s4_products');

        // A. Sol + blocs empilés
        const aOut = ep(t, tT - 0.45, tT + 0.1, ease.inCubic);
        put(floor, { o: (1 - prog(t, tT - 0.3, tT)) * (0.6 + 0.4 * Math.max(0, 1 - (t - sc.start) * 2)), extra: `scaleX(${(1 - 0.3 * aOut).toFixed(3)})` });
        put(mLbl, { o: ep(t, tb[0] - 0.3, tb[0] + 0.2) * (1 - aOut) });
        blocks.forEach((b, i) => {
          const p = ep(t, tb[i] - 0.38, tb[i], ease.inCubic);      // chute
          const settle = Math.sin(clamp((t - tb[i]) / 0.25) * Math.PI) * 8 * (t > tb[i] ? 1 : 0);
          const up = -900 * (1 - p);
          // sortie : les blocs s'envolent en léger décalage
          const ox = aOut * (i % 2 ? 160 : -160), oy = -aOut * (200 + i * 60);
          put(b, { o: prog(t, tb[i] - 0.38, tb[i] - 0.25) * (1 - aOut), y: up + settle + oy, x: ox, r: aOut * (i % 2 ? 4 : -4) });
        });

        // B. Équipe
        const bOut = ep(t, tE - 0.4, tE + 0.15, ease.inCubic);
        put(tLbl, { o: ep(t, tT + 0.15, tT + 0.55) * (1 - bOut) });
        const ti = ep(t, tT + 0.15, tT + 0.8, ease.outExpo);
        put(tTitle, { o: ti * (1 - bOut), y: 40 * (1 - ti) - 40 * bOut, blur: 8 * (1 - ti) + 10 * bOut });
        const pIn = (a) => ep(t, a, a + 0.5, ease.outExpo);
        put(field, { o: 1 - bOut, s: 1 + 0.05 * prog(t, tT, tE), blur: 10 * bOut });
        people.forEach(pp => {
          const a = tT + 0.15 + pp.d * 0.09;                      // vague depuis le centre
          const p = pIn(a);
          // les métiers allument « leur » rangée au moment où ils apparaissent
          let hl = 0;
          pills.forEach((pl, k) => { if (Math.abs(pp.r - pl.row) <= 0) hl = Math.max(hl, inOut(t, tT + 0.9 + k * 0.55, tT + 0.9 + k * 0.55 + 1.3, 0.2, 0.8)); });
          const glow = pp.lit ? 0.55 + 0.45 * Math.sin((t - tT) * pp.sp * 2.2 + pp.ph) ** 2 : 0;
          const lv = Math.max(hl * 0.9, glow * p);
          pp.n.style.background = lv > 0.02 ? `rgba(0,125,254,${(0.15 + 0.75 * lv).toFixed(3)})` : BRAND.card;
          pp.n.style.borderColor = lv > 0.02 ? `rgba(90,162,255,${(0.3 + 0.6 * lv).toFixed(3)})` : BRAND.border;
          pp.n.style.boxShadow = lv > 0.3 ? `0 0 ${(30 * lv).toFixed(0)}px rgba(0,125,254,${(0.5 * lv).toFixed(2)})` : 'none';
          put(pp.n, { o: p, s: 0.4 + 0.6 * p });
        });
        pills.forEach((pl, k) => {
          const a = tT + 0.9 + k * 0.55;
          const p = pIn(a);
          put(pl.p, { o: p * (1 - bOut), x: -60 * (1 - p), blur: 8 * bOut });
        });

        // C. Écosystème
        const eIn = ep(t, tE - 0.1, tE + 0.8, ease.outExpo);
        const toProd = ep(t, tP - 0.1, tP + 0.6, ease.inOutCubic);
        const collapse = ep(t, sc.end - 0.75, sc.end, ease.inExpo);
        const ecoOn = t >= tE - 0.15;
        eco.style.display = ecoOn ? 'block' : 'none';
        if (ecoOn) {
          put(eco, { o: 1, s: 1 - 0.85 * collapse });
          eco.style.transformOrigin = `${CX}px ${CY}px`;
          shots.forEach(s => {
            const p = ep(t, tE + 0.1 * s.z, tE + 1.2, ease.outCubic);
            put(s.box, { o: p * 0.32 * (1 - 0.5 * toProd), x: (t - tE) * 14 * (s.z - 0.5) * 2, y: (1 - p) * 120 * s.z - (t - tE) * 10 * s.z, r: s.r, blur: 3 + 3 * (1 - s.z) });
          });
          put(logo.root, { o: eIn * (1 - 0.95 * toProd * (1 - prog(t, sc.end - 0.5, sc.end - 0.25))), s: 0.6 + 0.4 * eIn });
          logo.reveal(1, 1);
          put(halo, { o: eIn * (0.8 + 0.2 * Math.sin(t * 2)) });
          lg.clearRect(0, 0, W, H);
          nodes.forEach((nd, i) => {
            const a = tE + 0.25 + i * 0.16;
            const p = ep(t, a, a + 0.6, ease.outExpo);
            const orbit = (t - tE) * 0.05;
            const ang = nd.a + orbit;
            const nx = CX + Math.cos(ang) * 330 * (0.6 + 0.4 * p), ny = CY + Math.sin(ang) * 400 * (0.6 + 0.4 * p);
            const w = nd.n.offsetWidth, h = nd.n.offsetHeight;
            put(nd.n, { o: p * (1 - 0.8 * toProd), x: nx - w / 2, y: ny - h / 2, s: 0.8 + 0.2 * p });
            const lp = ep(t, a - 0.05, a + 0.5, ease.outCubic);
            lg.strokeStyle = `rgba(90,162,255,${(0.5 * lp * (1 - toProd)).toFixed(3)})`; lg.lineWidth = 2;
            lg.setLineDash([6, 8]); lg.lineDashOffset = -t * 30;
            lg.beginPath(); lg.moveTo(CX, CY); lg.lineTo(CX + (nx - CX) * lp, CY + (ny - CY) * lp); lg.stroke();
          });
          ctx.camera.x = (t - tE) * 20;
        }
        // Produits (en construction)
        const pOn = toProd * (1 - ep(t, sc.end - 0.95, sc.end - 0.55, ease.inCubic));
        put(prod, { o: pOn, y: 60 * (1 - toProd), s: 0.94 + 0.06 * toProd });
        tileRow.style.transform = `translateX(${(-60 - (t - tP) * 70).toFixed(1)}px)`;
        ctx.bg.grid = 1 - 0.5 * collapse;
      }
    };
  }
};
