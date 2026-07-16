# Alcove — Prototype

Alcove est un service de curation culturelle personnelle conçu pour créer des
relations amicales authentiques entre des personnes qui partagent des goûts
culturels significatifs.

La collection est le profil : chaque personne se présente par les œuvres qu'elle
a choisies, organisées et brièvement commentées, plutôt que par une bio ou des
métriques sociales. Le produit est cross-média, mondial et multilingue par
conception.

## Vision produit

La collection réunit trois niveaux d'intentionnalité :

- **Archives** — ce que j'ai connu ;
- **Flux** — ce que j'expose maintenant ;
- **Capsule** — les fondamentaux, ce qui me définit.

La capsule est le mécanisme distinctif d'Alcove. Un nombre limité d'œuvres est
scellé collectivement. Pour modifier la capsule, il faut briser le sceau, perdre
son ancienneté, recomposer puis sceller à nouveau. Cet engagement rend les goûts
déclarés plus crédibles.

La finalité du produit est la **mise en relation par résonance**. Les personnes
sont découvertes à travers des œuvres communes rares, sans score de
compatibilité, classement ou vocabulaire de dating. Le premier contact reste
ancré dans un objet culturel partagé ou dans une recommandation adoptée.

## État du prototype

Ce dépôt contient un prototype de conception et de validation, pas encore le
futur MVP. Il permet actuellement de tester :

- l'accueil conforme à la charte visuelle v0.2 ;
- une collection personnelle séparant Flux et Archives ;
- l'archivage manuel et la remise dans le Flux (« Ressortir ») ;
- le parcours d'ajout : type, recherche, aperçu et commentaire guidé ;
- les commentaires courts associés à une œuvre ;
- le référencement cross-média par des APIs externes ;
- les quatre médias du proto v1 : films, séries, livres et albums.

Les résonances et correspondances de l'accueil utilisent encore des fixtures.
Le scellement complet de la capsule, le matching, les comptes utilisateurs et la
couche sociale persistante ne sont pas encore implémentés. La collection est
stockée dans le navigateur avec `localStorage`, sous la clé
`alcove_collection`.

Des routes existent également pour les jeux vidéo, jeux de société et podcasts,
mais ces types sont hors du sélecteur du proto v1.

## Principes de conception

- La collection est un geste de curation, pas du tracking passif.
- Les œuvres conservent leur visuel authentique et leur ratio naturel.
- Les commentaires sont guidés, optionnels et limités à environ dix mots.
- La rareté d'une coïncidence compte davantage que le nombre brut d'œuvres
  communes.
- L'expérience reste lente, asynchrone et sans pression : pas de gamification,
  de FOMO ou de signaux de messagerie en temps réel.
- Les 45+ servent de garde-fou de conception, mais la cible est définie par la
  solitude de goûts, pas par l'âge.

## Stack technique

- Next.js 16.2.9 avec App Router
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- Cloudflare Workers via `@opennextjs/cloudflare`
- API routes serverless pour protéger les clés des fournisseurs culturels
- `localStorage` pour la persistance du prototype

Le choix de stack du MVP reste ouvert (React Native, Flutter ou PWA). Le
prototype ne doit pas être traité comme l'architecture définitive du produit.

## Structure principale

- `/` — accueil du prototype ;
- `/collection` — vue unifiée du Flux et des Archives ;
- `/capsule` — exploration visuelle de la Capsule ;
- `/bloc-2` — surface historique du bloc Items et référencement ;
- `/bloc-2/add` — parcours d'ajout par routes ;
- `app/api/search/*` — recherche auprès des catalogues externes ;
- `app/api/detail/*` — récupération des détails d'une œuvre ;
- `components/addflow/*` — parcours d'ajout intégré à l'application ;
- `lib/collection.ts` — persistance locale de la collection ;
- `lib/server/*` — clients et helpers des fournisseurs externes.

## Sources de référencement

| Média | Source principale |
| --- | --- |
| Films et séries | TMDB |
| Livres | Google Books, avec repli Open Library |
| Albums | MusicBrainz et Cover Art Archive |
| Jeux vidéo | RAWG |
| Jeux de société | BoardGameGeek |
| Podcasts | Podcast Index |

L'identité canonique des œuvres doit rester indépendante de la langue
d'affichage afin que les résonances puissent traverser les langues. Les éditions
de livres constituent le cas le plus délicat.

## Développement local

Prérequis : une version de Node.js compatible avec Next.js 16 et les variables
d'environnement nécessaires aux fournisseurs testés.

```powershell
npm install
Copy-Item .dev.vars.example .dev.vars
npm run dev
```

Le serveur de développement est ensuite disponible par défaut sur
`http://localhost:3000`.

Les secrets locaux sont lus via le contexte Cloudflare. Dans les routes serveur,
utiliser le helper `getServerEnv()` plutôt que `process.env` directement.

## Variables d'environnement

```dotenv
TMDB_BEARER_TOKEN=
GOOGLE_BOOKS_API_KEY=
RAWG_API_KEY=
PODCAST_INDEX_KEY=
PODCAST_INDEX_SECRET=
```

Open Library, MusicBrainz/Cover Art Archive et BoardGameGeek ne nécessitent pas
de clé. Google Books peut fonctionner sans clé avec un quota anonyme limité.

En local, placer les valeurs dans `.dev.vars`, qui est ignoré par Git. Mettre
entre guillemets toute valeur contenant `#`, un espace ou un caractère spécial
interprété par dotenv.

## Commandes

```bash
npm run dev       # serveur de développement Next.js
npm run lint      # analyse ESLint
npm run build     # build Next.js local
npm run preview   # build OpenNext puis prévisualisation Cloudflare
npm run deploy    # build OpenNext puis déploiement Cloudflare
npm run upload    # build OpenNext puis upload Cloudflare
```

Le pipeline Cloudflare force actuellement `next build --webpack`. Avec
`@opennextjs/cloudflare` 1.20.1, les route handlers API ne fonctionnent pas encore
correctement avec le runtime Turbopack produit par défaut.

## Déploiement

Le prototype est hébergé sur **Cloudflare Workers**. Le dépôt GitHub actif est
`ReinboGoburin/protalcov-cdex`, avec déploiement continu depuis `main`.

Les variables de production doivent être enregistrées comme **Secrets** dans
Cloudflare, jamais comme simples variables texte : les variables texte du Worker
peuvent être remplacées au déploiement par la configuration Wrangler.

## Garde-fous de contribution

### Next.js 16

Cette version de Next.js comporte des changements incompatibles avec les
conventions historiques. Avant de modifier du code Next.js, consulter le guide
pertinent dans `node_modules/next/dist/docs/` et respecter les avis de
dépréciation.

### `package-lock.json`

Ne jamais régénérer `package-lock.json` sous Windows avec npm 11. Le lockfile
obtenu peut perdre des entrées optionnelles nécessaires au build Linux/npm 10 de
Cloudflare tout en paraissant valide sous Windows.

Toute régénération doit être faite dans un environnement Linux ou être vérifiée
immédiatement par un build Cloudflare.

## Documentation

Le dépôt documente le code, sa structure et ses contraintes d'exécution. Les
documents produit externes — périmètre fonctionnel, charte visuelle, décisions de
matching et spécifications des blocs — restent les sources maîtres pour la vision
et les arbitrages de conception.
