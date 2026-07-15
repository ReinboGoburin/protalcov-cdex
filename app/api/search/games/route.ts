import { NextRequest, NextResponse } from "next/server"
import { serviceUnavailable } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"
import type { SearchResponse, SearchResult } from "@/lib/types"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1

  if (!query) {
    return NextResponse.json<SearchResponse>({ results: [], hasMore: false })
  }

  const key = getServerEnv().RAWG_API_KEY
  if (!key) return serviceUnavailable()

  try {
    const url = new URL("https://api.rawg.io/api/games")
    url.searchParams.set("search", query)
    url.searchParams.set("key", key)
    url.searchParams.set("page_size", "10")
    url.searchParams.set("page", String(page))

    const res = await fetch(url)
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const rawResults: Array<Record<string, unknown>> = data.results ?? []

    const results: SearchResult[] = rawResults.map((game) => {
      const genres = (game.genres as Array<{ name: string }> | undefined) ?? []
      return {
        id: String(game.id),
        type: "videogame",
        title: String(game.name ?? ""),
        subtitle: genres.slice(0, 2).map((g) => g.name).join(", "),
        year: String(game.released ?? "").slice(0, 4),
        imageUrl: (game.background_image as string | null) ?? null,
        source: "rawg",
      }
    })

    const hasMore = Boolean(data.next)

    return NextResponse.json<SearchResponse>({ results, hasMore })
  } catch {
    return serviceUnavailable()
  }
}
