import { fetchJson, json, missingKey, unavailable, yearFromDate } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

interface RawgSearch {
  next: string | null;
  results: Array<{ id: number; name: string; released?: string; background_image?: string | null; genres?: Array<{ name: string }> }>;
}

export async function GET(request: Request) {
  const key = process.env.RAWG_API_KEY;
  if (!key) return missingKey("RAWG_API_KEY");
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) return json({ results: [], hasMore: false } satisfies SearchResponse);

  try {
    const data = await fetchJson<RawgSearch>(
      `https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}&page_size=10`
    );
    return json({
      results: data.results.map((item) => ({
        id: String(item.id),
        type: "videogame",
        title: item.name,
        subtitle: item.genres?.slice(0, 2).map((genre) => genre.name).join(", ") || "Jeu video",
        year: yearFromDate(item.released),
        imageUrl: item.background_image || null,
        source: "rawg"
      })),
      hasMore: Boolean(data.next)
    } satisfies SearchResponse);
  } catch {
    return unavailable();
  }
}
