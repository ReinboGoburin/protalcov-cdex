import { fetchJson, json, missingKey, tmdbImage, trimText, unavailable, yearFromDate } from "@/lib/api";
import type { ItemDetail } from "@/lib/types";

interface TmdbTvDetail {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
  number_of_seasons?: number;
  genres?: Array<{ name: string }>;
  created_by?: Array<{ name: string }>;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = process.env.TMDB_BEARER_TOKEN;
  if (!token) return missingKey("TMDB_BEARER_TOKEN");
  const { id } = await params;

  try {
    const item = await fetchJson<TmdbTvDetail>(`https://api.themoviedb.org/3/tv/${id}?append_to_response=credits&language=fr-FR`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return json({
      id: String(item.id),
      type: "tv",
      title: item.name,
      subtitle: item.created_by?.map((person) => person.name).join(", ") || "Serie",
      year: yearFromDate(item.first_air_date),
      imageUrl: tmdbImage(item.poster_path),
      source: "tmdb",
      metadata: {
        createur: item.created_by?.map((person) => person.name).join(", ") || "",
        genres: item.genres?.map((genre) => genre.name) || [],
        saisons: String(item.number_of_seasons || ""),
        synopsis: trimText(item.overview)
      }
    } satisfies ItemDetail);
  } catch {
    return unavailable();
  }
}
