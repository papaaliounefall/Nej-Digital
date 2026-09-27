# NEJ Digital — site vitrine

Site institutionnel de **NEJ Digital** (Nouvelle Ère de la Jeunesse Digitale). Site statique multi-pages, React + Vite + TypeScript + Tailwind CSS v4, sans backend ni base de données.

## Structure du projet

Chaque page est un vrai fichier HTML statique (bon pour le SEO, pas de routeur JS) :

```
index.html            → Accueil            (/)
a-propos/index.html   → À propos           (/a-propos/)
services/index.html   → Nos services       (/services/)
projets/index.html    → Nos projets        (/projets/)
equipe/index.html     → Notre équipe       (/equipe/)
actualites/index.html → Actualités         (/actualites/)
contact/index.html    → Contact            (/contact/)

src/
  entries/    → un point d'entrée React par page (monte <Layout><Page /></Layout>)
  pages/      → le contenu de chaque page
  components/ → composants partagés (Navbar, Footer, Hero, cartes produits, etc.)
  data/       → contenu du site (produits, services, équipe, actualités) — à éditer directement, pas de CMS
```

Pour ajouter une actualité : éditer `src/data/newsData.ts`. Pour ajouter/modifier un produit : `src/data/nejData.ts`. Pour changer un service : `src/data/servicesData.ts`.

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

- Remplacer les photos d'équipe (actuellement des photos Unsplash génériques) par de vraies photos dans `src/data/nejData.ts`.
- Renseigner un vrai numéro de téléphone et les vraies URLs des réseaux sociaux dans `src/pages/Contact.tsx` et `src/components/Footer.tsx` (marqués `TODO` dans le code).
- Remplacer les 3 actualités d'exemple dans `src/data/newsData.ts` par de vraies actualités.
