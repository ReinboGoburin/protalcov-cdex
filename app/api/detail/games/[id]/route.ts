import { fetchJson, json, missingKey, trimText, unavailable, yearFromDate } from "@/lib/api";
import type { ItemDetail } from "@/lib/types";

interface RawgDetail {
  id: number;
  name: string;
  released?: string;
  background_image?: string | null;
  description_raw?: string;
  genres?: Array<{ name: string }>;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const key = process.env.RAWG_API_KEY;
  if (!key) return missingKey("RAWG_API_KEY");
  const { id } = await params;

  try {
    const item = await fetchJson<RawgDetail>(`https://api.rawg.io/api/games/${id}?key=${encodeURIComponent(key)}`);
    const genres = item.genres?.map((genre) => genre.name) || [];
    return json({
      id: String(item.id),
      type: "videogame",
      title: item.name,
      subtitle: genres.slice(0, 2).join(", ") || "Jeu video",
      year: yearFromDate(item.released),
      imageUrl: item.background_image || null,
      source: "rawg",
      metadata: {
        genres,
        description: trimText(item.description_raw)
      }
    } satisfies ItemDetail);
  } catch {
    return unavailable();
  }
}
