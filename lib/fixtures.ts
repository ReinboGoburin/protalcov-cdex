import type { SearchResult } from "./types"

/**
 * Frozen results from the app's own search routes (TMDB/MusicBrainz/Open
 * Library), captured once in dev — no runtime network calls. Consumed only
 * by the home screen's résonances block (données factices), never by real
 * collection logic.
 */
export const RESONANCE_WORKS = {
  invasionLosAngeles: {
    id: "8337",
    type: "movie",
    title: "Invasion Los Angeles",
    subtitle: "Science-Fiction, Action",
    year: "1988",
    imageUrl: "https://image.tmdb.org/t/p/w185/v5ug8ye2Al4m1CL8ndAnSck81TF.jpg",
    source: "tmdb",
  },
  funHouse: {
    id: "edd57263-df77-3f1a-8803-8beb5d5b1a64",
    type: "album",
    title: "Fun House",
    subtitle: "The Stooges",
    year: "1970",
    imageUrl: "https://coverartarchive.org/release-group/edd57263-df77-3f1a-8803-8beb5d5b1a64/front-500",
    source: "musicbrainz",
  },
  dansLeTrain: {
    id: "OL694091W",
    type: "book",
    title: "Dans Le Train",
    subtitle: "Christian Oster",
    year: "2002",
    imageUrl: "https://covers.openlibrary.org/b/id/983860-M.jpg",
    source: "openlibrary",
  },
  dune1984: {
    id: "841",
    type: "movie",
    title: "Dune",
    subtitle: "Action, Science-Fiction",
    year: "1984",
    imageUrl: "https://image.tmdb.org/t/p/w185/nCFApKqbqRDdGc3YylVf3VsTHcg.jpg",
    source: "tmdb",
  },
  hundra: {
    id: "48242",
    type: "movie",
    title: "Hundra",
    subtitle: "Aventure, Fantastique",
    year: "1983",
    imageUrl: "https://image.tmdb.org/t/p/w185/2A1kb3iJel9RZ0X3VJpXAQ4aWzC.jpg",
    source: "tmdb",
  },
  ziggyStardust: {
    id: "6c9ae3dd-32ad-472c-96be-69d0a3536261",
    type: "album",
    title: "The Rise and Fall of Ziggy Stardust and the Spiders From Mars",
    subtitle: "David Bowie",
    year: "1972",
    imageUrl: "https://coverartarchive.org/release-group/6c9ae3dd-32ad-472c-96be-69d0a3536261/front-500",
    source: "musicbrainz",
  },
} as const satisfies Record<string, SearchResult>

export interface CorrespondenceFixture {
  name: string
  location: string
  avatar: string
  daysAgo: number
  quote: string
  work: SearchResult
}

/**
 * Home only ever shows the single most recent letter (Alexandre) — Sofia
 * stays here as a frozen fixture for future use but is never rendered.
 */
export const CORRESPONDENCES: CorrespondenceFixture[] = [
  {
    name: "Alexandre",
    location: "CA",
    avatar: "/avatars/alexandre.jpg",
    daysAgo: 2,
    quote: "Ton interprétation de 'Fun House' m'a vraiment parlé. Voici la mienne...",
    work: RESONANCE_WORKS.funHouse,
  },
  {
    name: "Sofia",
    location: "PT",
    avatar: "/avatars/sofia.jpg",
    daysAgo: 4,
    quote: "J'ai relu Dans le train ce mois-ci. La fin reste toujours aussi surprenante.",
    work: RESONANCE_WORKS.dansLeTrain,
  },
]
