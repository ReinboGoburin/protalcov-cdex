import { NextRequest, NextResponse } from "next/server"
import { podcastIndexHeaders } from "@/lib/server/podcastIndex"
import { serviceUnavailable } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"
import type { SearchResponse, SearchResult } from "@/lib/types"

interface PodcastFeed {
  id: number
  title: string
  author?: string
  description?: string
  image?: string
  artwork?: string
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1

  if (!query) {
    return NextResponse.json<SearchResponse>({ results: [], hasMore: false })
  }

  const env = getServerEnv()
  if (!env.PODCAST_INDEX_KEY || !env.PODCAST_INDEX_SECRET) {
    return serviceUnavailable()
  }

  try {
    const url = new URL("https://api.podcastindex.org/api/1.0/search/byterm")
    url.searchParams.set("q", query)
    url.searchParams.set("max", "30")

    const res = await fetch(url, { headers: podcastIndexHeaders() })
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const feeds: PodcastFeed[] = data.feeds ?? []

    const start = (page - 1) * 10
    const slice = feeds.slice(start, start + 10)

    const results: SearchResult[] = slice.map((feed) => {
      const author = feed.author ?? ""
      const description = feed.description ?? ""
      return {
        id: String(feed.id),
        type: "podcast",
        title: feed.title ?? "",
        subtitle: author,
        year: "",
        imageUrl: feed.artwork ?? feed.image ?? null,
        source: "podcastindex",
        detailMetadata: {
          author,
          description,
        },
      }
    })

    const hasMore = start + 10 < feeds.length

    return NextResponse.json<SearchResponse>({ results, hasMore })
  } catch {
    return serviceUnavailable()
  }
}
