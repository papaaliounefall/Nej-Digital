# NEJ Digital — site vitrine

Site institutionnel de **NEJ Digital** (Nouvelle Ère de la Jeunesse Digitale). Site statique multi-pages, React + Vite + TypeScript + Tailwind CSS v4, sans backend ni base de données.

## Structure du projet

Chaque page est un vrai fichier HTML statique (bon pour le SEO, pas de routeur JS) :

```
index.html                  → Accueil                    (/)
a-propos/index.html         → À propos                   (/a-propos/)
services/index.html         → Nos services               (/services/)
projets/index.html          → Nos projets                (/projets/)
equipe/index.html           → Notre équipe               (/equipe/)
actualites/index.html       → Actualités                 (/actualites/)
contact/index.html          → Contact                    (/contact/)
mentions-legales/index.html → Mentions légales           (/mentions-legales/)
confidentialite/index.html  → Politique de confidentialité (/confidentialite/)
404.html                    → Page 404 (servie par Vercel pour toute URL inconnue)

src/
  entries/    → un point d'entrée React par page (monte <Layout><Page /></Layout>)
  pages/      → le contenu de chaque page
  components/ → composants partagés (Navbar, Footer, Hero, cartes produits, etc.)
  data/       → contenu du site (produits, services, équipe, actualités) — à éditer directement, pas de CMS
```

Pour ajouter une actualité : éditer `src/data/newsData.ts` (`NEWS_POSTS`, vide pour l'instant — aucune annonce publique tant qu'aucun produit n'est en ligne). Pour changer un service : `src/data/servicesData.ts`.

**Page Projets** : aucun produit n'est public pour l'instant, donc `/projets/` affiche un simple message d'attente (`src/pages/Projects.tsx`) plutôt que des fiches produits (pour éviter d'exposer des captures d'écran/descriptions de produits non lancés). Les données produits existent déjà dans `src/data/nejData.ts` (`PRODUCTS`) et les composants `ProjectsGrid`/`ProductInfoModal` sont prêts dans `src/components/` — dès qu'un premier produit est réellement en ligne, remettre `<ProjectsGrid />` dans `Projects.tsx` pour l'afficher.

## Scripts

```bash
npm run dev              # serveur de développement (http://localhost:3000)
npm run build            # build de production dans dist/
npm run preview          # prévisualise le build de production en local
npm run images:optimize  # convertit les images de public/ en WebP + régénère les favicons
npm run lint              # vérification TypeScript (tsc --noEmit)
```

## Déploiement

Le site est 100% statique (`dist/` après build) — compatible avec n'importe quel hébergement statique classique (Vercel, Netlify, GitHub Pages, S3+CloudFront, hébergement mutualisé avec support "single index par dossier").

Le site est actuellement déployé sur **Vercel** : chaque `git push` sur `main` redéploie automatiquement. Aucune configuration supplémentaire n'est nécessaire (Vercel détecte Vite et exécute `npm run build`).

Pour déployer manuellement ailleurs : `npm run build`, puis uploader le contenu de `dist/` sur l'hébergement statique choisi.

## Connecter le domaine nejdigital.sn

1. Dans le tableau de bord Vercel du projet → **Settings → Domains** → ajouter `nejdigital.sn` (et `www.nejdigital.sn` si souhaité).
2. Vercel affiche les enregistrements DNS à créer chez le registrar du domaine (généralement un enregistrement **A** pointant vers Vercel pour le domaine racine, et un **CNAME** vers `cname.vercel-dns.com` pour `www`).
3. Ajouter ces enregistrements dans la zone DNS chez le registrar de `nejdigital.sn`.
4. Une fois le DNS propagé (quelques minutes à quelques heures), Vercel active automatiquement le certificat HTTPS.
5. Dans **Settings → Domains**, choisir quel domaine est la version canonique (`nejdigital.sn` ou `www.nejdigital.sn`) — Vercel redirige automatiquement l'autre vers celui-ci.
6. Mettre à jour `https://nejdigital.sn/` dans `public/sitemap.xml`, `public/robots.txt` et les balises `og:url`/`canonical` de chaque `index.html` si un domaine différent est utilisé en définitive.

## À faire avant mise en ligne officielle

- Renseigner un vrai numéro de téléphone si vous en voulez un sur `/contact/` (retiré pour l'instant, faute de numéro confirmé).
- Renseigner les LinkedIn/GitHub de Khady Cissé et Amadou Sow dans `src/data/nejData.ts`.
- Compléter les mentions légales (`src/pages/MentionsLegales.tsx`) avec le numéro d'immatriculation et l'adresse complète dès l'enregistrement officiel de la société — volontairement omis plutôt que laissés en `(à compléter)`.
- Ajouter de vraies actualités dans `src/data/newsData.ts` dès qu'il y en a (la page affiche un état vide en attendant).
- Réactiver la page Projets (voir section "Page Projets" ci-dessus) dès qu'un produit est en ligne.

## Régénérer l'image Open Graph

`public/og-image.png` (1200×630, utilisée pour les aperçus de partage) est générée depuis `public/icon-512.png` par `npm run images:optimize` (fonction `generateOgImage` dans `scripts/optimize-images.mjs`). Elle se régénère automatiquement à chaque exécution du script.
