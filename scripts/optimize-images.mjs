// One-off image optimization pass: converts the logo and team photos to
// WebP, generates the favicon/manifest icon set, and removes the raw
// sources once their WebP replacements exist. Run manually with
// `npm run images:optimize` whenever new source images are added — this is
// not part of the Vite build.
//
// No product screenshots here on purpose: none of the products are public
// yet, so no real UI is shown on the site (see ProjectsGrid/ProductInfoModal)
// — nothing to expose to copycats before launch.
import sharp from 'sharp';
import { existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Wide wordmark lockup — navbar/footer only (not square, don't use for icons).
const LOGO_SOURCE = 'logo-nej.png';
// Separate square mark — the only thing that should ever feed the favicon /
// manifest icons. A wide wordmark shrunk to 16px is illegible; this is a
// dedicated square asset made for that purpose.
const ICON_SOURCE = 'nej-icon-source.png';

// Team photos are dropped in with human-typed filenames (spaces, accents) —
// map them to clean, URL-safe names as they're converted.
const TEAM_PHOTOS = [
  { src: 'Papa Alioune Fall.jpeg', dest: 'papa-alioune-fall.webp' },
  { src: 'Anifa djité.jpeg', dest: 'anifa-djite.webp' },
  { src: 'Amadou Sow.jpeg', dest: 'amadou-sow.webp' },
  { src: 'Khady Cissé.jpeg', dest: 'khady-cisse.webp' }
];

async function convertLogo() {
  const src = join(PUBLIC_DIR, LOGO_SOURCE);
  if (!existsSync(src)) {
    console.warn(`Skip (not found): ${LOGO_SOURCE}`);
    return;
  }

  await sharp(src).resize({ height: 88 }).webp({ quality: 90 }).toFile(join(PUBLIC_DIR, 'logo-nej.webp'));
  unlinkSync(src);
  console.log(`${LOGO_SOURCE} -> logo-nej.webp`);
}

async function convertFavicons() {
  const src = join(PUBLIC_DIR, ICON_SOURCE);
  if (!existsSync(src)) {
    console.warn(`Skip (not found): ${ICON_SOURCE}`);
    return;
  }

  const icons = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-512.png', size: 512 }
  ];
  for (const { file, size } of icons) {
    await sharp(src)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(join(PUBLIC_DIR, file));
  }

  unlinkSync(src);
  console.log(`${ICON_SOURCE} -> favicon set`);
}

async function convertTeamPhotos() {
  for (const { src, dest } of TEAM_PHOTOS) {
    const srcPath = join(PUBLIC_DIR, src);
    if (!existsSync(srcPath)) {
      console.warn(`Skip (not found): ${src}`);
      continue;
    }
    await sharp(srcPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(PUBLIC_DIR, dest));
    unlinkSync(srcPath);
    console.log(`${src} -> ${dest}`);
  }
}

await convertLogo();
await convertFavicons();
await convertTeamPhotos();
console.log('Image optimization done.');
