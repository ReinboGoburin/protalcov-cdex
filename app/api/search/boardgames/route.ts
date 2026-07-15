import { NextRequest, NextResponse } from "next/server"
import { bggFetchXml, BggRetryExhaustedError, toArray } from "@/lib/server/bgg"
import { serviceUnavailable } from "@/lib/server/errors"
import type { SearchResponse, SearchResult } from "@/lib/types"

interface BggNameNode {
  "@_type"?: string
  "@_value"?: string
}

interface BggSearchItem {
  "@_id": string
  name?: BggNameNode | BggNameNode[]
  yearpublished?: { "@_value"?: string }
}

function primaryName(item: BggSearchItem): string {
  const names = toArray(item.name)
  const primary = names.find((n) => n["@_type"] === "primary") ?? names[0]
  return primary?.["@_value"] ?? ""
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1

  if (!query) {
    return NextResponse.json<SearchResponse>({ results: [], hasMore: false })
  }

  try {
    const url = new URL("https://boardgamegeek.com/xmlapi2/search")
    url.searchParams.set("query", query)
    url.searchParams.set("type", "boardgame")

    const parsed = (await bggFetchXml(url.toString())) as {
      items?: { item?: BggSearchItem | BggSearchItem[] }
    }

    const items = toArray(parsed.items?.item)
    const start = (page - 1) * 10
    const slice = items.slice(start, start + 10)

    const results: SearchResult[] = slice.map((item) => ({
      id: item["@_id"],
      type: "boardgame",
      title: primaryName(item),
      subtitle: "",
      year: item.yearpublished?.["@_value"] ?? "",
      imageUrl: null,
      source: "bgg",
    }))

    const hasMore = start + 10 < items.length

    return NextResponse.json<SearchResponse>({ results, hasMore })
  } catch (err) {
    if (err instanceof BggRetryExhaustedError) {
      return NextResponse.json({ error: err.message }, { status: 504 })
    }
    return serviceUnavailable()
  }
}
