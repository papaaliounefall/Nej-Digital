// SCÈNE 3 — LE CHEMIN / LES DIFFICULTÉS (20 → 37,5 s)
// Le rythme s'accélère. Tout ce qui est montré ici est RÉEL et documenté :
//  - le code affiché est le vrai code du site (src/components/Hero.tsx) ;
//  - les « décisions » sont de vrais messages de commit ;
//  - la « nuit de travail » est la vraie soirée du 27/09/2026 (heures des commits) ;
//  - les verbes de l'apprentissage sont les premiers mots de vrais commits.
// Aucune difficulté précise n'est inventée : « erreur » reste une illustration générique.
import { el, put, prog, ep, ease, kf, inOut, rng, clamp, lerp, BRAND } from '../engine/lib.js';
import { icon } from '../engine/icons.js';

const DECISIONS = [
  "Retirer toute présentation publique des projets tant qu'aucun n'est en ligne",
  'Simplifier le ton : moins vitrine techno, plus vitrine résultats',
  "Remplacer l'équipe fictive par les vrais profils NEJ Digitale"
];
const VERBS = ['Corriger', 'Ajuster', 'Affiner', 'Simplifier'];
const MONO = "'DejaVu Sans Mono', 'Menlo', 'Consolas', monospace";

function highlight(line) {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return esc
    .replace(/(\/\/.*$|\{\/\*.*\*\/\})/g, '<span style="color:#4B5563">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g, '<span style="color:#93C5FD">$1</span>')
    .replace(/\b(import|from|const|return|export|useState|useEffect|lazy|React)\b/g, '<span style="color:#3B82F6">$1</span>')
    .replace(/(&lt;\/?[A-Za-z][\w.]*)/g, '<span style="color:#F5F5F2">$1</span>');
}

export default {
  id: 's3-difficultes',
  pre: 0.5, post: 0.6,
  async mount(root, ctx) {
    const { cue, scene, W, H, history } = ctx;
    const sc = scene('s3-difficultes');

    // ---------- A. La route (perspective) ----------
    const road = el('canvas', { cls: 'abs', attrs: { width: W, height: H }, style: { left: 0, top: 0 } }, root);
    const rg = road.getContext('2d');
    const VX = 540, VY = 620;
    const lblIdea = el('div', { cls: 'abs kicker', style: { left: 0, width: W + 'px', textAlign: 'center', top: '1190px', fontSize: '30px', color: BRAND.text } }, root);
    lblIdea.innerHTML = "<b>●</b>&nbsp;&nbsp;L'idée";
    const lblProd = el('div', { cls: 'abs kicker', style: { left: 0, width: W + 'px', textAlign: 'center', top: '540px', fontSize: '26px', color: BRAND.muted } }, root);
    lblProd.textContent = 'Le produit';

    // ---------- B. Mots + éditeur de code + décisions ----------
    const word = el('div', { cls: 'abs title', style: { left: '90px', top: '360px', fontSize: '124px', zIndex: 3 } }, root);
    const wordR = el('div', { cls: 'abs title', style: { left: '90px', top: '360px', fontSize: '124px', color: 'rgba(255,40,80,0.7)', mixBlendMode: 'screen', zIndex: 2 } }, root);
    const wordB = el('div', { cls: 'abs title', style: { left: '90px', top: '360px', fontSize: '124px', color: 'rgba(0,160,255,0.8)', mixBlendMode: 'screen', zIndex: 2 } }, root);

    const editor = el('div', { cls: 'abs card', style: { left: '90px', top: '560px', width: '900px', height: '640px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' } }, root);
    const tabs = el('div', { style: { height: '64px', borderBottom: `2px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', gap: '14px', padding: '0 24px', fontSize: '22px', color: BRAND.muted, fontWeight: 600 } }, editor);
    tabs.innerHTML = `<span style="width:14px;height:14px;border-radius:50%;background:#374151;display:inline-block"></span><span style="width:14px;height:14px;border-radius:50%;background:#374151;display:inline-block"></span><span style="width:14px;height:14px;border-radius:50%;background:#374151;display:inline-block;margin-right:12px"></span>${icon('code', 24, BRAND.blue)} src/components/Hero.tsx`;
    const codeWrap = el('div', { cls: 'abs', style: { left: 0, top: '66px', right: 0, bottom: 0, overflow: 'hidden' } }, editor);
    const code = el('div', { cls: 'abs', style: { left: 0, top: 0, right: 0, fontFamily: MONO, fontSize: '22px', lineHeight: '36px', color: '#9CA3AF', whiteSpace: 'pre', padding: '18px 0' } }, codeWrap);
    const src = (await ctx.getText(ctx.repo + 'src/components/Hero.tsx')).split('\n').slice(0, 60);
    const ERR_LINE = 27;
    src.forEach((l, i) => {
      const row = el('div', { style: { display: 'flex', position: 'relative' } }, code);
      el('span', { text: String(i + 1).padStart(3, ' '), style: { color: '#374151', width: '78px', textAlign: 'right', paddingRight: '22px', flex: 'none' } }, row);
      el('span', { html: highlight(l.slice(0, 62)) }, row);
      if (i === ERR_LINE) row.dataset.err = '1';
    });
    const errRow = code.querySelector('[data-err]');
    const squiggle = el('div', { cls: 'abs', style: { left: '120px', right: '120px', bottom: '2px', height: '6px', backgroundImage: 'radial-gradient(circle at 3px -1px, transparent 3px, #F87171 3.5px, #F87171 4.5px, transparent 5px)', backgroundSize: '12px 6px' } }, errRow);
    const errHi = el('div', { cls: 'abs', style: { left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(248,113,113,0.10)', borderLeft: '4px solid #F87171' } }, errRow);
    const console_ = el('div', { cls: 'abs', style: { left: 0, right: 0, bottom: 0, height: '86px', background: '#0B0F19', borderTop: `2px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: '16px', fontSize: '26px', fontWeight: 700, color: '#F87171' } }, editor);
    console_.innerHTML = '<span style="font-size:30px">✕</span><span>Erreur</span><span style="color:#6B7280;font-weight:500">— on corrige, on recommence.</span>';

    const decWrap = el('div', { cls: 'abs', style: { left: '90px', top: '600px', width: '900px' } }, root);
    const decLbl = el('div', { cls: 'kicker', style: { fontSize: '22px', marginBottom: '26px', color: BRAND.muted2, letterSpacing: '0.2em' } }, decWrap);
    decLbl.innerHTML = '<b>Vraies décisions</b><span class="sep">/</span>historique du site';
    const byMsg = Object.fromEntries(history.commits.map(c => [c.message, c]));
    const decCards = DECISIONS.filter(m => byMsg[m]).map(m => {
      const c = byMsg[m];
      const card = el('div', { cls: 'card', style: { padding: '26px 30px', marginBottom: '20px', borderLeft: `6px solid ${BRAND.blue}` } }, decWrap);
      const [y, mo, d] = c.date.split('-');
      el('div', { text: `${d}.${mo}.${y} · ${c.time}`, style: { fontSize: '22px', fontWeight: 700, color: BRAND.blue, marginBottom: '8px', letterSpacing: '0.04em' } }, card);
      el('div', { text: m, style: { fontSize: '33px', fontWeight: 700, lineHeight: 1.25, color: BRAND.text } }, card);
      return card;
    });

    // ---------- C. La nuit : horloge réelle des commits du 27/09 ----------
    const night = history.commits.filter(c => c.date === '2026-09-27' && c.time >= '20:00');
    const nightWrap = el('div', { cls: 'abs', style: { left: '90px', top: '330px', width: '900px' } }, root);
    const nDate = el('div', { cls: 'kicker', style: { fontSize: '24px', letterSpacing: '0.22em', marginBottom: '6px' } }, nightWrap);
    nDate.innerHTML = '<b>27.09.2026</b><span class="sep">/</span>Une soirée de commits';
    const clock = el('div', { cls: 'mono', style: { fontSize: '210px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: BRAND.cream } }, nightWrap);
    const list = el('div', { cls: 'abs', style: { left: '90px', top: '700px', width: '900px', height: '560px', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 22%, #000 100%)' } }, root);
    const rows = night.map(c => {
      const r = el('div', { style: { display: 'flex', gap: '26px', alignItems: 'baseline', height: '88px', borderBottom: `2px solid ${BRAND.border}`, paddingTop: '20px' } }, list);
      el('div', { text: c.time, cls: 'mono', style: { fontSize: '30px', fontWeight: 800, color: BRAND.blue, flex: 'none', width: '104px' } }, r);
      el('div', { text: c.message, style: { fontSize: '29px', fontWeight: 600, color: BRAND.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r);
      return r;
    });
    const srcNote = el('div', { cls: 'abs', style: { left: '90px', top: '1280px', fontSize: '20px', fontWeight: 600, color: BRAND.muted2 } }, root);
    srcNote.textContent = `Source : historique git du dépôt ${history.repository}`;

    // ---------- D. Apprendre : les verbes de nos commits ----------
    const verbs = VERBS.filter(v => history.commits.some(c => c.message.startsWith(v)));
    const vWrap = el('div', { cls: 'abs', style: { left: '90px', top: '420px', width: '900px' } }, root);
    const vLbl = el('div', { cls: 'kicker', style: { fontSize: '22px', letterSpacing: '0.2em', marginBottom: '20px' } }, vWrap);
    vLbl.innerHTML = '<b>Apprendre</b><span class="sep">/</span>les verbes de nos commits';
    const vNodes = verbs.map((v, i) => el('div', { cls: 'title', text: v + '.', style: { fontSize: '128px', lineHeight: 1.08, color: i === verbs.length - 1 ? BRAND.blue : BRAND.cream } }, vWrap));

    // ligne d'effondrement (devient le sol de la scène 4)
    const floor = el('div', { cls: 'abs', style: { left: '90px', width: '900px', top: '1180px', height: '4px', background: BRAND.blue, boxShadow: '0 0 30px rgba(59,130,246,0.8)', transformOrigin: '50% 50%' } }, root);

    const tW = [cue('s3_w1'), cue('s3_w2'), cue('s3_w3')];
    const WORDS = ['Difficultés.', 'Erreurs.', 'Décisions.'];

    return {
      update(t) {
        // A. Route
        const rIn = inOut(t, sc.start - 0.1, tW[0] + 0.02, 0.6, 0.3);
        rg.clearRect(0, 0, W, H);
        if (rIn > 0) {
          const speed = 1.4 + 2.2 * prog(t, sc.start, tW[0]);
          const travel = (t - sc.start) * speed;
          rg.save(); rg.globalAlpha = rIn;
          // bords de la route
          const halfBottom = 520;
          const grad = rg.createLinearGradient(0, VY, 0, H);
          grad.addColorStop(0, 'rgba(59,130,246,0)'); grad.addColorStop(1, 'rgba(59,130,246,0.55)');
          rg.strokeStyle = grad; rg.lineWidth = 3;
          rg.beginPath(); rg.moveTo(VX - 6, VY); rg.lineTo(VX - halfBottom, H); rg.moveTo(VX + 6, VY); rg.lineTo(VX + halfBottom, H); rg.stroke();
          // sol légèrement éclairé
          const fl = rg.createLinearGradient(0, VY, 0, H);
          fl.addColorStop(0, 'rgba(59,130,246,0.0)'); fl.addColorStop(1, 'rgba(59,130,246,0.08)');
          rg.fillStyle = fl; rg.beginPath(); rg.moveTo(VX - 6, VY); rg.lineTo(VX - halfBottom, H); rg.lineTo(VX + halfBottom, H); rg.lineTo(VX + 6, VY); rg.fill();
          // tirets centraux + jalons, en profondeur (z de 1 à 30)
          for (let i = 0; i < 40; i++) {
            const z = 30 - ((i * 0.75 + travel * 2.2) % 30);
            if (z < 0.6) continue;
            const yA = VY + (H - VY) * (1 / z), yB = VY + (H - VY) * (1 / (z + 0.35));
            const a = clamp(1.4 - z / 22);
            rg.strokeStyle = `rgba(191,224,255,${(0.85 * a).toFixed(3)})`;
            rg.lineWidth = Math.max(1, 10 / z);
            rg.beginPath(); rg.moveTo(VX, yA); rg.lineTo(VX, yB); rg.stroke();
            if (i % 5 === 0) {
              const xo = halfBottom * 1.15 * (1 / z);
              const ph = 70 / z;
              rg.fillStyle = `rgba(90,162,255,${(0.7 * a).toFixed(3)})`;
              rg.fillRect(VX - xo - 2, yA - ph, Math.max(2, 5 / z), ph);
              rg.fillRect(VX + xo - 2, yA - ph, Math.max(2, 5 / z), ph);
            }
          }
          // horizon : le produit, encore loin
          const hg = rg.createRadialGradient(VX, VY, 0, VX, VY, 160);
          hg.addColorStop(0, 'rgba(191,224,255,0.9)'); hg.addColorStop(0.15, 'rgba(59,130,246,0.35)'); hg.addColorStop(1, 'rgba(59,130,246,0)');
          rg.fillStyle = hg; rg.beginPath(); rg.arc(VX, VY, 160, 0, Math.PI * 2); rg.fill();
          rg.restore();
        }
        put(lblIdea, { o: rIn * (1 - prog(t, sc.start + 1.2, sc.start + 2.6)), y: 260 * ep(t, sc.start + 0.6, sc.start + 2.6, ease.inCubic), s: 1 + 0.4 * prog(t, sc.start + 0.6, sc.start + 2.6) });
        put(lblProd, { o: rIn * ep(t, sc.start + 1.0, sc.start + 2.0), y: -10 });
        ctx.camera.y = 300 + 120 * prog(t, sc.start, sc.end);

        // B. Trois mots, coupes rapides
        let wi = -1; tW.forEach((tt, i) => { if (t >= tt - 0.08) wi = i; });
        const wEnd = cue('s3_night') - 0.25;
        const wOn = wi >= 0 && t < wEnd;
        const txt = wi >= 0 ? WORDS[wi] : '';
        if (word.textContent !== txt) { word.textContent = txt; wordR.textContent = txt; wordB.textContent = txt; }
        const since = wi >= 0 ? t - tW[wi] : 9;
        const gl = wOn ? clamp(1 - since / 0.2) : 0; // glitch à chaque coupe
        const wo = wOn ? ep(t, tW[wi] - 0.08, tW[wi] + 0.1) * (1 - prog(t, wEnd - 0.2, wEnd)) : 0;
        put(word, { o: wo, x: gl * 6 * Math.sin(t * 90) });
        put(wordR, { o: wo * gl, x: -16 * gl, y: 3 * gl });
        put(wordB, { o: wo * gl, x: 16 * gl, y: -3 * gl });

        // éditeur : difficultés + erreurs
        const edOn = inOut(t, tW[0] - 0.12, tW[2] - 0.02, 0.15, 0.12);
        const shake = (t >= tW[1] && t < tW[1] + 0.25) ? Math.sin(t * 120) * 10 * (1 - (t - tW[1]) / 0.25) : 0;
        put(editor, { o: edOn, x: shake, s: 0.96 + 0.04 * ep(t, tW[0] - 0.12, tW[0] + 0.3, ease.outExpo) });
        code.style.transform = `translateY(${(-(ERR_LINE - 8) * 36 * ep(t, tW[0] - 0.1, tW[1] - 0.05, ease.inOutCubic)).toFixed(1)}px)`;
        const errOn = t >= tW[1] ? 1 : 0;
        squiggle.style.opacity = errOn; errHi.style.opacity = errOn;
        put(console_, { o: errOn, y: 86 * (1 - ep(t, tW[1], tW[1] + 0.2, ease.outExpo)) });

        // décisions (vrais commits)
        const decOn = inOut(t, tW[2] - 0.05, wEnd, 0.15, 0.3);
        put(decWrap, { o: decOn, y: 0 });
        put(decLbl, { o: ep(t, tW[2], tW[2] + 0.3) });
        decCards.forEach((c, i) => {
          const a = tW[2] + 0.1 + i * 0.5;
          const p = ep(t, a, a + 0.45, ease.outExpo);
          put(c, { o: p, x: 80 * (1 - p) });
        });

        // C. La nuit
        const tn = cue('s3_night'), tl = cue('s3_learn');
        const nOn = inOut(t, tn - 0.1, tl + 0.05, 0.4, 0.35);
        put(nightWrap, { o: nOn, y: 30 * (1 - ep(t, tn - 0.1, tn + 0.5, ease.outExpo)) });
        put(list, { o: nOn });
        put(srcNote, { o: nOn * 0.9 });
        const step = 0.33;
        let ci = Math.floor((t - tn - 0.15) / step);
        ci = clamp(ci, 0, rows.length - 1);
        const pStep = clamp((t - tn - 0.15 - ci * step) / 0.16);
        clock.textContent = night.length ? night[ci].time : '';
        clock.style.transform = `translateY(${((1 - ease.outCubic(pStep)) * 14).toFixed(1)}px)`;
        clock.style.opacity = (0.55 + 0.45 * ease.outCubic(pStep)).toFixed(3);
        rows.forEach((r, i) => {
          const a = tn + 0.15 + i * step;
          const p = ep(t, a, a + 0.25, ease.outCubic);
          r.style.opacity = (p * (i === ci ? 1 : 0.5)).toFixed(3);
        });
        const scrollRows = Math.max(0, ci - 4) * 88 + (ci >= 4 ? pStep * 0 : 0);
        list.firstChild && (list.style.transform = `translate3d(0,0,0)`);
        rows.forEach(r => { r.style.transform = `translateY(${(-scrollRows).toFixed(1)}px)`; });
        // la nuit tombe : le fond s'assombrit
        ctx.bg.grid = 1 - 0.7 * inOut(t, tn - 0.3, tl + 0.3, 0.6, 0.6);

        // D. Verbes
        const vOn = inOut(t, tl - 0.05, cue('s3_collapse') + 0.05, 0.25, 0.2);
        put(vWrap, { o: vOn });
        put(vLbl, { o: ep(t, tl, tl + 0.3) });
        vNodes.forEach((v, i) => {
          const a = tl + 0.05 + i * 0.32;
          const p = ep(t, a, a + 0.4, ease.outExpo);
          put(v, { o: p, y: 50 * (1 - p), blur: 8 * (1 - p) });
        });
        // effondrement en une ligne → sol de la construction (scène 4)
        const pc = ep(t, cue('s3_collapse'), sc.end, ease.inExpo);
        vWrap.style.transformOrigin = '50% 760px';
        if (pc > 0) vWrap.style.transform = `scaleY(${(1 - pc).toFixed(3)})`;
        put(floor, { o: ep(t, cue('s3_collapse') + 0.15, sc.end, ease.inCubic) * (1 - prog(t, sc.end + 0.3, sc.end + 0.6)), extra: `scaleX(${(0.2 + 0.8 * ep(t, cue('s3_collapse'), sc.end, ease.outExpo)).toFixed(3)})` });
      }
    };
  }
};
