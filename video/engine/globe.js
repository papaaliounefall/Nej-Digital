// Globe 2D (projection orthographique) fidèle au globe 3D du site :
// mêmes données (src/data/worldCountries110m.json, src/data/globeCities.ts),
// mêmes couleurs (Earth.tsx, ConnectionLines.tsx, CityLights.tsx, Atmosphere.tsx).
// Rendu sur canvas, entièrement déterministe (fonction de la rotation et du rayon).

// Liste identique à src/lib/globe.ts (AFRICAN_COUNTRIES)
const AFRICA = new Set([
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Central African Rep.', 'Chad', 'Congo',
  'Dem. Rep. Congo', 'Djibouti', 'Egypt', 'Eq. Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
  'Guinea-Bissau', "Côte d'Ivoire", 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania',
  'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'S. Sudan', 'Senegal', 'Sierra Leone', 'Somalia',
  'Somaliland', 'South Africa', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'W. Sahara', 'Zambia', 'Zimbabwe', 'eSwatini'
]);

const D2R = Math.PI / 180;

/** Lit les villes/connexions directement depuis le fichier TypeScript du site. */
export function parseCities(tsSource) {
  const cities = [...tsSource.matchAll(/name:\s*'([^']+)',\s*lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+)(,\s*isPrimary:\s*true)?/g)]
    .map(m => ({ name: m[1], lat: +m[2], lng: +m[3], primary: !!m[4] }));
  const block = tsSource.split('GLOBE_CONNECTIONS')[1] || '';
  const connections = [...block.matchAll(/\['([^']+)',\s*'([^']+)'\]/g)].map(m => [m[1], m[2]]);
  return { cities, connections };
}

export function buildGlobe(topo) {
  const { scale, translate } = topo.transform;
  const arcs = topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; });
  });
  const africaArcs = new Set();
  const flat = a => (Array.isArray(a) ? a.flatMap(flat) : [a]);
  for (const g of topo.objects.countries.geometries) {
    if (!AFRICA.has(g.properties?.name)) continue;
    for (const i of flat(g.arcs || [])) africaArcs.add(i < 0 ? ~i : i);
  }
  // Densifie les longs segments (courbure correcte sur la sphère)
  const dense = arcs.map(pts => {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [a, b] = [pts[i - 1], pts[i]];
      const n = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / 2);
      for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    return out;
  });
  return { arcs: dense, africaArcs };
}

/** Projection orthographique. Renvoie [x, y, visible(cos c)]. */
export function project(lng, lat, view, alt = 0) {
  const { lng0, lat0, cx, cy, r } = view;
  const l = (lng - lng0) * D2R, p = lat * D2R, p0 = lat0 * D2R;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  const k = r * (1 + alt);
  return [cx + k * Math.cos(p) * Math.sin(l), cy - k * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)), cosc];
}

/** Point intermédiaire sur le grand cercle entre a et b (f ∈ [0,1]). */
export function slerp(a, b, f) {
  const toV = ({ lat, lng }) => [Math.cos(lat * D2R) * Math.cos(lng * D2R), Math.cos(lat * D2R) * Math.sin(lng * D2R), Math.sin(lat * D2R)];
  const va = toV(a), vb = toV(b);
  const d = Math.acos(Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  if (d < 1e-6) return { lat: a.lat, lng: a.lng, d };
  const s1 = Math.sin((1 - f) * d) / Math.sin(d), s2 = Math.sin(f * d) / Math.sin(d);
  const v = [va[0] * s1 + vb[0] * s2, va[1] * s1 + vb[1] * s2, va[2] * s1 + vb[2] * s2];
  return { lat: Math.asin(v[2]) / D2R, lng: Math.atan2(v[1], v[0]) / D2R, d };
}

export function drawGlobe(g, globe, view, opts = {}) {
  const { cx, cy, r } = view;
  const alpha = opts.alpha ?? 1;
  g.save();
  g.globalAlpha = alpha;
  // Atmosphère (Atmosphere.tsx : #2a6fd6, lueur de bord)
  const atm = g.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.22);
  atm.addColorStop(0, 'rgba(42,111,214,0.0)'); atm.addColorStop(0.35, 'rgba(42,111,214,0.38)'); atm.addColorStop(1, 'rgba(42,111,214,0)');
  g.fillStyle = atm; g.beginPath(); g.arc(cx, cy, r * 1.22, 0, Math.PI * 2); g.fill();
  // Sphère (Earth.tsx : #0a0f1c, reflet métallique)
  const sph = g.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r);
  sph.addColorStop(0, '#1b2740'); sph.addColorStop(0.55, '#0c1323'); sph.addColorStop(1, '#060a14');
  g.fillStyle = sph; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
  // Halo Afrique (#5aa2ff)
  const [ax, ay, ac] = project(20, 2, view);
  if (ac > 0) {
    const hg = g.createRadialGradient(ax, ay, 0, ax, ay, r * 0.8);
    hg.addColorStop(0, `rgba(90,162,255,${(0.22 * ac).toFixed(3)})`); hg.addColorStop(1, 'rgba(90,162,255,0)');
    g.fillStyle = hg; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
  }
  // Contours : monde (#3a5a8c) puis Afrique (#8fc3ff)
  const lw = Math.max(1, r / 380);
  const strokeArcs = (filter, color, width) => {
    g.strokeStyle = color; g.lineWidth = width; g.beginPath();
    globe.arcs.forEach((pts, i) => {
      if (!filter(i)) return;
      let pen = false;
      for (const [lng, lat] of pts) {
        const [x, y, c] = project(lng, lat, view);
        if (c > 0.02) { pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } else pen = false;
      }
    });
    g.stroke();
  };
  strokeArcs(i => !globe.africaArcs.has(i), 'rgba(58,90,140,0.55)', lw);
  strokeArcs(i => globe.africaArcs.has(i), 'rgba(143,195,255,0.9)', lw * 1.3);
  // Ombre douce côté nuit
  const sh = g.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.6, cx, cy, r * 1.05);
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.45)');
  g.fillStyle = sh; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
  g.restore();
}

export function glowDot(g, x, y, rad, color, a = 1) {
  const gr = g.createRadialGradient(x, y, 0, x, y, rad * 4);
  gr.addColorStop(0, color.replace('A', String(0.9 * a))); gr.addColorStop(0.25, color.replace('A', String(0.35 * a))); gr.addColorStop(1, color.replace('A', '0'));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad * 4, 0, Math.PI * 2); g.fill();
  g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
}
