# NEJ Digital — Vidéo TikTok « Les coulisses »

Projet de production de la vidéo storytelling de NEJ Digital : 9:16, 1080 × 1920, 30 i/s, 90 s.
Il cible TikTok, Instagram Reels et YouTube Shorts.

**Ce dossier est indépendant du site.** Il n'est pas inclus dans le build Vite (entrées listées dans
`vite.config.ts`). Il ne modifie aucun fichier du site : il en **lit** seulement les ressources réelles
(logo, captures, données, code, historique git).

## Livrables (dans `output/`, régénérables)

| Fichier | Contenu |
|---|---|
| `NEJ-Digital_TikTok_1080x1920_VO.mp4` | Vidéo complète : voix off provisoire, musique, sound design, sous-titres |
| `NEJ-Digital_TikTok_1080x1920_SansVoix.mp4` | Même image, sans voix off : musique, sound design, textes à l'écran |
| `NEJ-Digital_TikTok_cover.jpg` | Couverture (carte finale) |
| `NEJ-Digital_soustitres.srt` | Sous-titres de la narration |
| `audio/mix_vo.wav`, `audio/mix_music.wav` | Masters audio (-14 LUFS, ≤ -1 dBTP) |

Le script définitif de narration est dans [`script/NARRATION.md`](script/NARRATION.md).

## Méthode de production

Tout est animé en code, de façon **déterministe** : chaque image est calculée à partir du temps
(`window.__seek(t)`), capturée dans Chromium headless (Playwright), puis encodée par ffmpeg.
Ce choix s'appuie sur ce que le dépôt contient déjà : HTML/CSS/JS, la police Plus Jakarta Sans et des
données réelles. Il garde le projet maintenable sans logiciel de montage propriétaire, avec des textes
modifiables dans des fichiers JSON.

```
video/
├── config/
│   ├── story.json     ← LE RÉCIT : scènes, répliques (voix + sous-titres), réglages de la voix
│   ├── cues.json      ← repères temporels partagés image ↔ sound design
│   ├── media.json     ← emplacements pour de vraies photos/vidéos de l'équipe
│   ├── export.json    ← paramètres d'export MP4
│   └── history.json   ← historique git réel du site (généré)
├── engine/            ← moteur : boucle de rendu, sous-titres, logo animable, globe, icônes du site
├── scenes/            ← une scène = un fichier (s1-hook … s6-conclusion)
├── assets/
│   ├── brand/         ← logo officiel vectorisé et séparé en calques (généré depuis public/icon-512.png)
│   ├── captures/      ← vraies captures du site (générées)
│   ├── footage/       ← vos photos/vidéos réelles (vide pour l'instant, voir README)
│   └── audio/         ← voix (vo/), musique (music/), sound design (sfx/)
├── script/NARRATION.md
└── tools/             ← scripts de production (voir ci-dessous)
```

## Prérequis

- Node 18+ et `npm install` (police Plus Jakarta Sans via @fontsource)
- Playwright + Chromium (`npm i -D playwright && npx playwright install chromium` si absents)
- ffmpeg
- Python 3 : `pip install numpy scipy soundfile potracer sherpa-onnx==1.12.40`
- Voix de synthèse provisoire uniquement : le modèle Piper `fr_FR-tom-medium` extrait dans `~/tts/`
  ([archive](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-tom-medium.tar.bz2)).
  Ce modèle est inutile si la voix est enregistrée par l'équipe, et les prises provisoires sont déjà dans le dépôt.

## Commandes

```bash
npm run build          # voix → musique → mix → sous-titres → rendu image → export MP4 (~5 min)
npm run preview        # aperçu interactif : http://localhost:5190/video/engine/index.html
npm run stills         # planche contact (une image toutes les 1,5 s) dans output/stills/
npm run slots          # visualise les emplacements de médias réels
npm run capture        # recapture le site (build local : `npx vite preview` à la racine)
npm run history        # met à jour l'historique git affiché
npm run brand          # régénère les calques du logo depuis public/icon-512.png
```

Rendu partiel, utile pour vérifier une scène : `node tools/render.mjs --from 20 --to 38 --out output/s3.mp4`.

## Modifier la vidéo

- **Un texte de narration ou un sous-titre** : `config/story.json` → `narration[].text` (`*mot*` = bleu NEJ), puis `npm run build`.
- **Le moment d'une réplique** : `narration[].start`. `voice.py` signale tout chevauchement.
- **Un effet sonore ou le timing d'une animation** : `config/cues.json`. L'image et le son se déplacent ensemble.
- **Une scène** : `scenes/sX-*.js`. Chaque scène construit son DOM dans `mount()` et se met à jour dans `update(t)`.
- **La voix définitive** : voir `script/NARRATION.md`, section « Enregistrer la voix définitive ».
- **De vraies images de l'équipe** : voir `assets/footage/README.md`.

## Authenticité : ce qui est réel, ce qui est illustratif

- **Réel (repris du dépôt)** : logo, couleurs, typographie, captures du site, titre et métiers de la page Équipe,
  méthode en 4 temps, domaines d'intervention, villes et connexions du globe, code de `Hero.tsx`,
  messages et heures des commits.
- **Illustratif (motion design)** : la route, le réseau de points, le soulignement « erreur » dans l'éditeur.
  Ils sont présentés comme des illustrations, jamais comme des archives.
- **Volontairement absent** : les portraits individuels de l'équipe. L'équipe ne se limite pas aux profils
  du site, elle est donc montrée comme un collectif (vraies images de groupe possibles via `config/media.json`).
  Également absents : les noms et captures des produits. Le site a choisi de ne présenter aucun
  produit tant qu'aucun n'est en ligne (voir le README du site). Il n'y a ni faux témoignage ni fausse scène d'archive.

## Musique et sons

La musique et le sound design sont **entièrement synthétisés** par `tools/music.py`, sans sample ni
banque de sons. Ils sont donc libres de droits. Tonalité Ré mineur, 96 BPM, résolution en Fa majeur
sur le logo. Les percussions de la montée s'inspirent du djembé.
Pour utiliser une musique sous licence à la place, remplacer `assets/audio/music/music.wav`
(48 kHz stéréo, 90 s), puis lancer `npm run mix && npm run export`.
