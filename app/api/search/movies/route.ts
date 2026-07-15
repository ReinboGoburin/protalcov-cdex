import { NextRequest, NextResponse } from "next/server"
import { serviceUnavailable } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"
import { TMDB_MOVIE_GENRES } from "@/lib/server/tmdbGenres"
import type { SearchResponse, SearchResult } from "@/lib/types"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1

  if (!query) {
    return NextResponse.json<SearchResponse>({ results: [], hasMore: false })
  }

  const token = getServerEnv().TMDB_BEARER_TOKEN
  if (!token) return serviceUnavailable()

  try {
    const url = new URL("https://api.themoviedb.org/3/search/movie")
    url.searchParams.set("query", query)
    url.searchParams.set("language", "fr-FR")
    url.searchParams.set("page", String(page))

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const rawResults: Array<Record<string, unknown>> = data.results ?? []

    const results: SearchResult[] = rawResults.slice(0, 10).map((movie) => {
      const genreIds = (movie.genre_ids as number[] | undefined) ?? []
      const genreNames = genreIds.map((id) => TMDB_MOVIE_GENRES[id]).filter(Boolean)
      const posterPath = movie.poster_path as string | null
      return {
        id: String(movie.id),
        type: "movie",
        title: String(movie.title ?? ""),
        subtitle: genreNames.slice(0, 2).join(", "),
        year: String(movie.release_date ?? "").slice(0, 4),
        imageUrl: posterPath ? `https://image.tmdb.org/t/p/w185${posterPath}` : null,
        source: "tmdb",
      }
    })

    const totalPages = Number(data.total_pages ?? 1)
    const hasMore = rawResults.length > 10 || page < totalPages

    return NextResponse.json<SearchResponse>({ results, hasMore })
  } catch {
    return serviceUnavailable()
  }
}
