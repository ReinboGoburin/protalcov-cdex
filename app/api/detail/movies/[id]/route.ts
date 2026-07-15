import { NextRequest, NextResponse } from "next/server"
import { serviceUnavailable, notFound } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"
import { truncateAtWord } from "@/lib/text"
import type { ItemDetail } from "@/lib/types"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = getServerEnv().TMDB_BEARER_TOKEN
  if (!token) return serviceUnavailable()

  try {
    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits&language=fr-FR`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

    if (res.status === 404) return notFound()
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const director = (data.credits?.crew ?? []).find(
      (c: { job?: string }) => c.job === "Director"
    )
    const genres = (data.genres ?? []).map((g: { name: string }) => g.name)

    const detail: ItemDetail = {
      id: String(data.id),
      type: "movie",
      title: data.title ?? "",
      subtitle: director?.name ?? "",
      year: String(data.release_date ?? "").slice(0, 4),
      imageUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      source: "tmdb",
      metadata: {
        director: director?.name ?? "",
        genres,
        synopsis: truncateAtWord(data.overview ?? "", 300),
      },
    }

    return NextResponse.json(detail)
  } catch {
    return serviceUnavailable()
  }
}
