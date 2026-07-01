import { fetchJson, json, missingKey, tmdbImage, unavailable, yearFromDate } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

interface TmdbMovieSearch {
  page: number;
  total_pages: number;
  results: Array<{ id: number; title: string; release_date?: string; poster_path?: string | null; overview?: string }>;
}

export async function GET(request: Request) {
  const token = process.env.TMDB_BEARER_TOKEN;
  if (!token) return missingKey("TMDB_BEARER_TOKEN");
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const page = searchParams.get("page") || "1";
  if (!query) return json({ results: [], hasMore: false } satisfies SearchResponse);

  try {
    const data = await fetchJson<TmdbMovieSearch>(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return json({
      results: data.results.slice(0, 10).map((item) => ({
        id: String(item.id),
        type: "movie",
        title: item.title,
        subtitle: "Film",
        year: yearFromDate(item.release_date),
        imageUrl: tmdbImage(item.poster_path, "w185"),
        source: "tmdb"
      })),
      hasMore: data.page < data.total_pages
    } satisfies SearchResponse);
  } catch {
    return unavailable();
  }
}
