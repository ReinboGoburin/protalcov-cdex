import { decodeHtml, fetchBggXml, json, trimText, unavailable } from "@/lib/api";
import type { ItemDetail } from "@/lib/types";

type BggThing = {
  id: string;
  image?: string;
  thumbnail?: string;
  description?: string;
  yearpublished?: { value?: string };
  name?: { type?: string; value?: string } | Array<{ type?: string; value?: string }>;
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const data = await fetchBggXml(`https://boardgamegeek.com/xmlapi2/thing?id=${encodeURIComponent(id)}&type=boardgame&stats=1`);
    const item = data.items?.item as BggThing | undefined;
    if (!item) return json({ error: "Introuvable" }, 404);
    const names = Array.isArray(item.name) ? item.name : [item.name];
    const title = decodeHtml(names.find((name) => name?.type === "primary")?.value || names[0]?.value || "Sans titre");
    return json({
      id: String(item.id),
      type: "boardgame",
      title,
      subtitle: "Jeu de societe",
      year: item.yearpublished?.value || "",
      imageUrl: item.image || item.thumbnail || null,
      source: "bgg",
      metadata: {
        description: trimText(decodeHtml(item.description || ""))
      }
    } satisfies ItemDetail);
  } catch {
    return unavailable();
  }
}
