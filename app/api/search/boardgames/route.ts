import { decodeHtml, fetchBggXml, json, unavailable } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) return json({ results: [], hasMore: false } satisfies SearchResponse);

  try {
    const data = await fetchBggXml(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`);
    const rawItems = data.items?.item ? (Array.isArray(data.items.item) ? data.items.item : [data.items.item]) : [];
    return json({
      results: rawItems.slice(0, 10).map((item: { id: string; name?: { value?: string }; yearpublished?: { value?: string } }) => ({
        id: String(item.id),
        type: "boardgame",
        title: decodeHtml(item.name?.value || "Sans titre"),
        subtitle: "Jeu de societe",
        year: item.yearpublished?.value || "",
        imageUrl: null,
        source: "bgg"
      })),
      hasMore: rawItems.length > 10
    } satisfies SearchResponse);
  } catch {
    return unavailable();
  }
}
