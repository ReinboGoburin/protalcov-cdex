# Alcove — Prototype

Alcove est un service de curation culturelle personnelle. Ce prototype teste le
référencement cross-média (films, séries, livres, albums, jeux vidéo, jeux de société,
podcasts) et la fluidité du parcours d'ajout à une collection personnelle.

## Structure

- `/` — page hub listant les blocs fonctionnels disponibles.
- `/bloc-2` — Bloc 2 : Flux d'ajout (collection, recherche, détail, commentaire guidé).
- `app/api/*` — routes serverless qui proxient les APIs externes (TMDB, Google Books
  avec repli complet vers Open Library en cas d'erreur, MusicBrainz/Cover Art Archive,
  RAWG, BoardGameGeek, Podcast Index) et protègent les clés API.

La collection est stockée côté navigateur (`localStorage`, clé `alcove_collection`).

## Développement local

```bash
git clone [repo]
cd protalcov-ccod
npm install
cp .env.example .env.local   # renseigner ses propres clés API
npm run dev                  # démarre sur http://localhost:3000
```

## Variables d'environnement

```
TMDB_BEARER_TOKEN=      # Films & séries
GOOGLE_BOOKS_API_KEY=   # Livres (optionnelle, augmente le quota de requêtes)
RAWG_API_KEY=           # Jeux vidéo
PODCAST_INDEX_KEY=      # Podcasts
PODCAST_INDEX_SECRET=   # Podcasts
```

Google Books fonctionne sans clé mais avec un quota anonyme limité ; en cas d'erreur
(quota dépassé ou autre), la recherche de livres bascule automatiquement sur Open
Library. Open Library, MusicBrainz/Cover Art Archive et BoardGameGeek ne nécessitent
pas de clé.

## Déploiement

Déployé sur Netlify, déploiement automatique à chaque push sur `main`. Les variables
d'environnement ci-dessus doivent être configurées dans les paramètres du site Netlify.
