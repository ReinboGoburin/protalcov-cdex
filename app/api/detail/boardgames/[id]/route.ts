import { NextRequest, NextResponse } from "next/server"
import { bggFetchXml, BggRetryExhaustedError, toArray } from "@/lib/server/bgg"
import { serviceUnavailable } from "@/lib/server/errors"
import { truncateAtWord } from "@/lib/text"
import type { ItemDetail } from "@/lib/types"

interface BggNameNode {
  "@_type"?: string
  "@_value"?: string
}

interface BggThingItem {
  "@_id": string
  name?: BggNameNode | BggNameNode[]
  description?: string
  image?: string
  thumbnail?: string
  yearpublished?: { "@_value"?: string }
}

function primaryName(item: BggThingItem): string {
  const names = toArray(item.name)
  const primary = names.find((n) => n["@_type"] === "primary") ?? names[0]
  return primary?.["@_value"] ?? ""
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}&type=boardgame&stats=1`
    const parsed = (await bggFetchXml(url)) as { items?: { item?: BggThingItem } }
    const item = parsed.items?.item

    if (!item) {
      return NextResponse.json({ error: "Item introuvable" }, { status: 404 })
    }

    const description = truncateAtWord(item.description ?? "", 300)

    const detail: ItemDetail = {
      id: item["@_id"],
      type: "boardgame",
      title: primaryName(item),
      subtitle: "",
      year: item.yearpublished?.["@_value"] ?? "",
      imageUrl: item.image ?? item.thumbnail ?? null,
      source: "bgg",
      metadata: {
        description,
      },
    }

    return NextResponse.json(detail)
  } catch (err) {
    if (err instanceof BggRetryExhaustedError) {
      return NextResponse.json({ error: err.message }, { status: 504 })
    }
    return serviceUnavailable()
  }
}
