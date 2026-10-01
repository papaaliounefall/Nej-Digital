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
  const rawSrc = join(PUBLIC_DIR, ICON_SOURCE);
  const squareIcons = [
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-512.png', size: 512 }
  ];

  if (existsSync(rawSrc)) {
    for (const { file, size } of squareIcons) {
      await sharp(rawSrc).resize(size, size, { fit: 'cover' }).png().toFile(join(PUBLIC_DIR, file));
    }
    unlinkSync(rawSrc);
    console.log(`${ICON_SOURCE} -> apple-touch-icon.png + icon-512.png`);
  } else {
    console.warn(`Skip (not found): ${ICON_SOURCE} — reusing the existing icon-512.png as the favicon source instead.`);
  }

  // Browser-tab favicons only get a circular mask (transparent corners).
  // apple-touch-icon.png stays a plain square: iOS applies its own rounded
  // mask, so a pre-clipped circle would double up oddly there.
  const masterSquare = join(PUBLIC_DIR, 'icon-512.png');
  if (!existsSync(masterSquare)) {
    console.warn('Skip favicon generation: icon-512.png not found.');
    return;
  }

  const roundFavicons = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 }
  ];
  for (const { file, size } of roundFavicons) {
    const circleMask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
    );
    await sharp(masterSquare)
      .resize(size, size, { fit: 'cover' })
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(join(PUBLIC_DIR, file));
  }
  console.log('icon-512.png -> favicon-16x16.png + favicon-32x32.png (circular)');
}

async function generateOgImage() {
  const iconPath = join(PUBLIC_DIR, 'icon-512.png');
  if (!existsSync(iconPath)) {
    console.warn('Skip og-image.png: icon-512.png not found.');
    return;
  }

  const width = 1200;
  const height = 630;
  const iconSize = 380;
  const iconX = 90;
  const iconY = Math.round((height - iconSize) / 2);
  const textX = iconX + iconSize + 60;

  const icon = await sharp(iconPath).resize(iconSize, iconSize).toBuffer();

  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0A0B0E"/>
      <text x="${textX}" y="300" font-family="Arial, sans-serif" font-size="74" font-weight="900" fill="#F9FAFB">NEJ DIGITAL</text>
      <text x="${textX}" y="352" font-family="Arial, sans-serif" font-size="30" font-weight="600" fill="#3B82F6">Nouvelle Ère de la Jeunesse Digitale</text>
      <text x="${textX}" y="392" font-family="Arial, sans-serif" font-size="24" fill="#9CA3AF">Entreprise technologique et digitale sénégalaise</text>
    </svg>
  `);

  await sharp(overlay)
    .composite([{ input: icon, left: iconX, top: iconY }])
    .png()
    .toFile(join(PUBLIC_DIR, 'og-image.png'));

  console.log('Generated og-image.png (1200x630)');
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
await generateOgImage();
await convertTeamPhotos();
console.log('Image optimization done.');
