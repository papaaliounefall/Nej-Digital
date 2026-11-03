# Images et vidéos réelles de l'équipe

Ce dossier est **vide à dessein** : le dépôt ne contient aucune photo ou vidéo de travail de l'équipe,
et la vidéo n'en invente aucune.

Quatre emplacements sont prévus dans `config/media.json` :

| Id   | Moment      | À fournir |
|------|-------------|-----------|
| S2-A | 0:07 → 0:11 | Les débuts : une première réunion, un carnet, un tableau blanc |
| S3-A | 0:30 → 0:35 | Nuits de travail : un écran, un bureau le soir (vrai plan, sans mise en scène) |
| S4-A | 0:43 → 0:48 | L'équipe en discussion ou au travail |
| S6-A | 1:18 → 1:23 | Coulisses : les locaux, Dakar, l'équipe |

**Comment faire :**
1. Déposer le fichier ici, par exemple `debuts-reunion.mp4` (ou `.jpg`). Format vertical si possible, 1080 px de large minimum.
2. Dans `config/media.json`, remplacer `"file": null` par `"file": "debuts-reunion.mp4"`.
3. Lancer `npm run build`.

Pour voir les emplacements sur l'image : `npm run slots` (captures dans `output/stills/`), ou l'aperçu
`http://localhost:5190/video/engine/index.html?slots=1`.

Le cadre de chaque emplacement est défini par `box: [x, y, largeur, hauteur]` en pixels (repère 1080 × 1920).
