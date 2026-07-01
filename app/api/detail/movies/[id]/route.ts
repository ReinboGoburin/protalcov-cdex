import { fetchJson, json, missingKey, tmdbImage, trimText, unavailable, yearFromDate } from "@/lib/api";
import type { ItemDetail } from "@/lib/types";

interface TmdbMovieDetail {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
  overview?: string;
  genres?: Array<{ name: string }>;
  credits?: { crew?: Array<{ job: string; name: string }> };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = process.env.TMDB_BEARER_TOKEN;
  if (!token) return missingKey("TMDB_BEARER_TOKEN");
  const { id } = await params;

  try {
    const item = await fetchJson<TmdbMovieDetail>(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits&language=fr-FR`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const directors = item.credits?.crew?.filter((person) => person.job === "Director").map((person) => person.name) || [];
    return json({
      id: String(item.id),
      type: "movie",
      title: item.title,
      subtitle: directors.join(", ") || "Film",
      year: yearFromDate(item.release_date),
      imageUrl: tmdbImage(item.poster_path),
      source: "tmdb",
      metadata: {
        realisateur: directors.join(", "),
        genres: item.genres?.map((genre) => genre.name) || [],
        synopsis: trimText(item.overview)
      }
    } satisfies ItemDetail);
  } catch {
    return unavailable();
  }
}
