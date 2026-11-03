// Capture de vraies vues du site NEJ Digital, utilisées telles quelles dans la vidéo.
//
// Le site n'est jamais modifié : on capture soit le build local servi par
// `npx vite preview` (par défaut, http://localhost:4173), soit le site en ligne
// (SITE_URL=https://nej-digital.vercel.app npm run capture).
//
// Sortie : assets/captures/*.jpg (écrasées à chaque exécution).
import { chromium } from './lib/playwright.mjs';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'captures');
const SITE = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
mkdirSync(OUT, { recursive: true });

// Chaque entrée = une capture. `wait` laisse le temps au globe WebGL de s'afficher.
const SHOTS = [
  // Mobile (390×844 @3x) — c'est ce que verra le public TikTok sur son téléphone.
  { name: 'mobile-home-hero', path: '/', vp: 'mobile', wait: 7000 },
  { name: 'mobile-home-full', path: '/', vp: 'mobile', wait: 7000, fullPage: true },
  { name: 'mobile-apropos', path: '/a-propos/', vp: 'mobile', wait: 1500, fullPage: true },
  { name: 'mobile-projets', path: '/projets/', vp: 'mobile', wait: 1500 },
  { name: 'mobile-services', path: '/services/', vp: 'mobile', wait: 1500, fullPage: true },
  // Desktop (1440×900 @2x) — pour les plans « écran d'ordinateur ».
  { name: 'desktop-home-hero', path: '/', vp: 'desktop', wait: 7000 },
  { name: 'desktop-apropos', path: '/a-propos/', vp: 'desktop', wait: 1500 }
  // (page Équipe volontairement non capturée : la vidéo ne montre pas de portraits individuels)
];

const VIEWPORTS = {
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }
};

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const shot of SHOTS) {
    const ctx = await browser.newContext({ ...VIEWPORTS[shot.vp], reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    await page.goto(SITE + shot.path, { waitUntil: 'networkidle' });
    // Révèle les sections « reveal » (apparition au scroll) avant une capture pleine page.
    if (shot.fullPage) {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      });
    }
    await page.waitForTimeout(shot.wait);
    const file = join(OUT, `${shot.name}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 90, fullPage: !!shot.fullPage });
    console.log('✓', shot.name);
    await ctx.close();
  }
} finally {
  await browser.close();
}
