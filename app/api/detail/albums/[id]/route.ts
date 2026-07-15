import { NextRequest, NextResponse } from "next/server"
import { musicbrainzFetch } from "@/lib/server/musicbrainz"
import { serviceUnavailable, notFound } from "@/lib/server/errors"
import type { ItemDetail } from "@/lib/types"

interface Genre {
  name: string
  count?: number
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const groupUrl = `https://musicbrainz.org/ws/2/release-group/${id}?inc=genres+artist-credits&fmt=json`
    const groupRes = await musicbrainzFetch(groupUrl)

    if (groupRes.status === 404) return notFound()
    if (!groupRes.ok) return serviceUnavailable()

    const group = (await groupRes.json()) as any

    const genres: Genre[] = group.genres ?? []
    const topGenres = [...genres]
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, 3)
      .map((g) => g.name)

    let label = ""
    try {
      const releaseUrl = `https://musicbrainz.org/ws/2/release?release-group=${id}&fmt=json&limit=1&inc=labels`
      const releaseRes = await musicbrainzFetch(releaseUrl)
      if (releaseRes.ok) {
        const releaseData = (await releaseRes.json()) as any
        label = releaseData.releases?.[0]?.["label-info"]?.[0]?.label?.name ?? ""
      }
    } catch {
      // label is optional metadata; ignore failures
    }

    const artist = group["artist-credit"]?.[0]?.name ?? ""

    const detail: ItemDetail = {
      id: group.id,
      type: "album",
      title: group.title ?? "",
      subtitle: artist,
      year: (group["first-release-date"] ?? "").slice(0, 4),
      imageUrl: `https://coverartarchive.org/release-group/${group.id}/front-500`,
      source: "musicbrainz",
      metadata: {
        artist,
        label,
        genres: topGenres,
      },
    }

    return NextResponse.json(detail)
  } catch {
    return serviceUnavailable()
  }
}
