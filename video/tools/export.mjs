// Assemble l'image (output/frames-video.mp4) et les masters audio en MP4 finaux,
// puis génère une couverture (cover) et vérifie chaque fichier exporté.
//   node tools/export.mjs
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXPORT = JSON.parse(readFileSync(join(ROOT, 'config/export.json'), 'utf8'));
const story = JSON.parse(readFileSync(join(ROOT, 'config/story.json'), 'utf8'));
const video = join(ROOT, 'output/frames-video.mp4');
if (!existsSync(video)) { console.error('Lancer d\'abord : npm run render:frames'); process.exit(1); }

const run = (args) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg a échoué : ' + args.join(' '));
};

for (const o of EXPORT.outputs) {
  const dst = join(ROOT, 'output', o.file);
  run(['-i', video, '-i', join(ROOT, o.audio), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
    '-c:a', EXPORT.audio.codec, '-b:a', EXPORT.audio.bitrate, '-ar', String(EXPORT.audio.sampleRate),
    '-t', String(story.video.duration), '-movflags', '+faststart',
    '-metadata', 'title=NEJ Digital — Les coulisses', '-metadata', `comment=${o.label}`, dst]);
  const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,profile,width,height,r_frame_rate,pix_fmt,sample_rate:format=duration,bit_rate', '-of', 'json', dst], { encoding: 'utf8' });
  const info = JSON.parse(probe.stdout);
  const v = info.streams.find(s => s.width), a = info.streams.find(s => s.sample_rate);
  console.log(`✓ ${o.file}\n   ${v.codec_name} ${v.profile} ${v.width}×${v.height} ${v.r_frame_rate} ${v.pix_fmt} · ${a.codec_name} ${a.sample_rate} Hz · ${(+info.format.duration).toFixed(2)} s · ${(statSync(dst).size / 1e6).toFixed(1)} Mo`);
}

// Couverture (image de la carte finale)
run(['-ss', String(story.video.duration - 2.2), '-i', video, '-frames:v', '1', '-q:v', '2', join(ROOT, 'output', 'NEJ-Digital_TikTok_cover.jpg')]);
console.log('✓ NEJ-Digital_TikTok_cover.jpg');
