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
  const key = getServerEnv().RAWG_API_KEY
  if (!key) return serviceUnavailable()

  try {
    const url = `https://api.rawg.io/api/games/${id}?key=${key}`
    const res = await fetch(url)

    if (res.status === 404) return notFound()
    if (!res.ok) return serviceUnavailable()

    const data = (await res.json()) as any
    const genres = (data.genres ?? []).map((g: { name: string }) => g.name)

    const detail: ItemDetail = {
      id: String(data.id),
      type: "videogame",
      title: data.name ?? "",
      subtitle: genres.slice(0, 2).join(", "),
      year: String(data.released ?? "").slice(0, 4),
      imageUrl: data.background_image ?? null,
      source: "rawg",
      metadata: {
        genres,
        description: truncateAtWord(data.description_raw ?? "", 300),
      },
    }

    return NextResponse.json(detail)
  } catch {
    return serviceUnavailable()
  }
}
