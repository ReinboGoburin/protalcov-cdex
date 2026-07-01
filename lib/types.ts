export type MediaType = "movie" | "tv" | "book" | "album" | "videogame" | "boardgame" | "podcast";

export interface SearchResult {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string;
  year: string;
  imageUrl: string | null;
  source: string;
}

export interface SearchResponse {
  results: SearchResult[];
  hasMore: boolean;
}

export interface ItemDetail extends SearchResult {
  metadata: Record<string, string | string[]>;
}

export interface CollectionItem extends ItemDetail {
  comment: {
    prompt: string;
    answer: string;
  } | null;
  addedAt: string;
}

export const mediaLabels: Record<MediaType, string> = {
  movie: "Film",
  tv: "Serie",
  book: "Livre",
  album: "Album",
  videogame: "Jeu video",
  boardgame: "Jeu de societe",
  podcast: "Podcast"
};

export const typeToSearchRoute: Record<MediaType, string> = {
  movie: "movies",
  tv: "tv",
  book: "books",
  album: "albums",
  videogame: "games",
  boardgame: "boardgames",
  podcast: "podcasts"
};

export const typeToDetailRoute: Partial<Record<MediaType, string>> = {
  movie: "movies",
  tv: "tv",
  album: "albums",
  videogame: "games",
  boardgame: "boardgames"
};

export function ensureType(value: string): MediaType | null {
  if (["movie", "tv", "book", "album", "videogame", "boardgame", "podcast"].includes(value)) {
    return value as MediaType;
  }
  return null;
}

export function itemDetailFromSearch(result: SearchResult, metadata: Record<string, string | string[]> = {}): ItemDetail {
  return { ...result, metadata };
}
