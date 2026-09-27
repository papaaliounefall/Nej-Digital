// One-off image optimization pass: converts the product screenshots and logo
// to WebP, generates the favicon/manifest icon set, and removes the raw PNGs
// once their WebP replacements exist. Run manually with `npm run images:optimize`
// whenever new source images are added — this is not part of the Vite build.
import sharp from 'sharp';
import { existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const PRODUCT_IMAGES = [
  'SunuMall.png',
  'Orientasn.png',
  'AgriMarket.png',
  'HadraSmart.png',
  'minifoot.png',
  'sunucar.png'
];

const LOGO_SOURCE = 'logo-nej.png';
const MAX_WIDTH = 1600;

// Team photos are dropped in with human-typed filenames (spaces, accents) —
// map them to clean, URL-safe names as they're converted.
const TEAM_PHOTOS = [
  { src: 'Papa Alioune Fall.jpeg', dest: 'papa-alioune-fall.webp' },
  { src: 'Anifa djité.jpeg', dest: 'anifa-djite.webp' },
  { src: 'Amadou Sow.jpeg', dest: 'amadou-sow.webp' }
];

async function convertProductImages() {
  for (const file of PRODUCT_IMAGES) {
    const src = join(PUBLIC_DIR, file);
    if (!existsSync(src)) {
      console.warn(`Skip (not found): ${file}`);
      continue;
    }
    const dest = join(PUBLIC_DIR, file.replace(/\.png$/i, '.webp'));
    await sharp(src)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest);
    unlinkSync(src);
    console.log(`${file} -> ${file.replace(/\.png$/i, '.webp')}`);
  }
}

async function convertLogoAndFavicons() {
  const src = join(PUBLIC_DIR, LOGO_SOURCE);
  if (!existsSync(src)) {
    console.warn(`Skip (not found): ${LOGO_SOURCE}`);
    return;
  }

  await sharp(src).resize({ height: 88 }).webp({ quality: 90 }).toFile(join(PUBLIC_DIR, 'logo-nej.webp'));

  const icons = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-512.png', size: 512 }
  ];
  for (const { file, size } of icons) {
    await sharp(src)
      .resize(size, size, { fit: 'contain', background: { r: 10, g: 11, b: 14, alpha: 1 } })
      .png()
      .toFile(join(PUBLIC_DIR, file));
  }

  unlinkSync(src);
  console.log(`${LOGO_SOURCE} -> logo-nej.webp + favicon set`);
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

await convertProductImages();
await convertLogoAndFavicons();
await convertTeamPhotos();
console.log('Image optimization done.');
