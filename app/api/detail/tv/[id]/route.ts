import { NextRequest, NextResponse } from "next/server"
import { serviceUnavailable, notFound } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"
import type { ItemDetail } from "@/lib/types"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = getServerEnv().TMDB_BEARER_TOKEN
  if (!token) return serviceUnavailable()

  try {
    const url = `https://api.themoviedb.org/3/tv/${id}?append_to_response=credits&language=fr-FR`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

    if (res.status === 404) return notFound()
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const creators = (data.created_by ?? []).map((c: { name: string }) => c.name)
    const genres = (data.genres ?? []).map((g: { name: string }) => g.name)

    const detail: ItemDetail = {
      id: String(data.id),
      type: "tv",
      title: data.name ?? "",
      subtitle: creators.join(", "),
      year: String(data.first_air_date ?? "").slice(0, 4),
      imageUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      source: "tmdb",
      metadata: {
        creator: creators.join(", "),
        genres,
        seasons: String(data.number_of_seasons ?? ""),
      },
    }

    return NextResponse.json(detail)
  } catch {
    return serviceUnavailable()
  }
}
