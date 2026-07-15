import { NextRequest, NextResponse } from "next/server"
import { musicbrainzFetch } from "@/lib/server/musicbrainz"
import { serviceUnavailable } from "@/lib/server/errors"
import type { SearchResponse, SearchResult } from "@/lib/types"

interface ReleaseGroup {
  id: string
  title: string
  "primary-type"?: string
  "first-release-date"?: string
  "artist-credit"?: Array<{ name: string }>
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1

  if (!query) {
    return NextResponse.json<SearchResponse>({ results: [], hasMore: false })
  }

  try {
    const offset = (page - 1) * 10
    const url = new URL("https://musicbrainz.org/ws/2/release-group")
    url.searchParams.set("query", query)
    url.searchParams.set("fmt", "json")
    url.searchParams.set("limit", "10")
    url.searchParams.set("offset", String(offset))

    const res = await musicbrainzFetch(url.toString())

    if (res.status === 503) {
      return NextResponse.json(
        { error: "Trop de recherches, patientez quelques secondes" },
        { status: 429 }
      )
    }
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const groups: ReleaseGroup[] = data["release-groups"] ?? []
    const albums = groups.filter((g) => g["primary-type"] === "Album")

    const results: SearchResult[] = albums.map((group) => ({
      id: group.id,
      type: "album",
      title: group.title,
      subtitle: group["artist-credit"]?.[0]?.name ?? "",
      year: (group["first-release-date"] ?? "").slice(0, 4),
      imageUrl: `https://coverartarchive.org/release-group/${group.id}/front-500`,
      source: "musicbrainz",
    }))

    const count = Number(data.count ?? results.length)
    const hasMore = offset + 10 < count

    return NextResponse.json<SearchResponse>({ results, hasMore })
  } catch {
    return serviceUnavailable()
  }
}
