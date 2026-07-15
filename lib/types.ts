export type MediaType =
  | "movie"
  | "tv"
  | "book"
  | "album"
  | "videogame"
  | "boardgame"
  | "podcast"

export interface SearchResult {
  id: string
  type: MediaType
  title: string
  subtitle: string
  year: string
  imageUrl: string | null
  source: string
  // Present only for types without a dedicated detail route (book, podcast):
  // carries the full metadata so the detail screen can render without another API call.
  detailMetadata?: Record<string, string | string[]>
}

export interface SearchResponse {
  results: SearchResult[]
  hasMore: boolean
}

export interface ItemDetail {
  id: string
  type: MediaType
  title: string
  subtitle: string
  year: string
  imageUrl: string | null
  source: string
  metadata: Record<string, string | string[]>
}

export interface CollectionComment {
  prompt: string
  answer: string
}

export interface CollectionItem {
  id: string
  type: MediaType
  title: string
  subtitle: string
  year: string
  imageUrl: string | null
  source: string
  metadata: Record<string, string | string[]>
  comment: CollectionComment | null
  addedAt: string
  /** Set when manually archived, epoch ms. Absent = never archived (also true for items pushed into the archives automatically by the stream cap). */
  archivedAt?: number
}
