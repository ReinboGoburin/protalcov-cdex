import type { MediaType } from "./types"

export interface MediaConfig {
  type: MediaType
  slug: string
  label: string
  icon: string
  searchPlaceholder: string
  searchEndpoint: string
  detailEndpoint: string | null
}

export const MEDIA_TYPES: MediaConfig[] = [
  {
    type: "movie",
    slug: "movie",
    label: "Film",
    icon: "\u{1F3AC}",
    searchPlaceholder: "Titre du film…",
    searchEndpoint: "/api/search/movies",
    detailEndpoint: "/api/detail/movies",
  },
  {
    type: "tv",
    slug: "tv",
    label: "Série",
    icon: "\u{1F4FA}",
    searchPlaceholder: "Titre de la série…",
    searchEndpoint: "/api/search/tv",
    detailEndpoint: "/api/detail/tv",
  },
  {
    type: "book",
    slug: "book",
    label: "Livre",
    icon: "\u{1F4DA}",
    searchPlaceholder: "Titre du livre…",
    searchEndpoint: "/api/search/books",
    detailEndpoint: null,
  },
  {
    type: "album",
    slug: "album",
    label: "Album",
    icon: "\u{1F3B5}",
    searchPlaceholder: "Titre de l'album…",
    searchEndpoint: "/api/search/albums",
    detailEndpoint: "/api/detail/albums",
  },
  {
    type: "videogame",
    slug: "videogame",
    label: "Jeu vidéo",
    icon: "\u{1F3AE}",
    searchPlaceholder: "Titre du jeu vidéo…",
    searchEndpoint: "/api/search/games",
    detailEndpoint: "/api/detail/games",
  },
  {
    type: "boardgame",
    slug: "boardgame",
    label: "Jeu de société",
    icon: "\u{1F3B2}",
    searchPlaceholder: "Titre du jeu de société…",
    searchEndpoint: "/api/search/boardgames",
    detailEndpoint: "/api/detail/boardgames",
  },
  {
    type: "podcast",
    slug: "podcast",
    label: "Podcast",
    icon: "\u{1F3A7}",
    searchPlaceholder: "Titre du podcast…",
    searchEndpoint: "/api/search/podcasts",
    detailEndpoint: null,
  },
]

export function getMediaConfig(slug: string): MediaConfig | undefined {
  return MEDIA_TYPES.find((m) => m.slug === slug)
}

/** Media types the app actually displays (jeu vidéo/jeu de société/podcast retirés du sélecteur — hors proto). */
export const COLLECTIBLE_TYPES: MediaType[] = ["movie", "tv", "book", "album"]

export function isCollectibleType(type: MediaType): boolean {
  return COLLECTIBLE_TYPES.includes(type)
}
