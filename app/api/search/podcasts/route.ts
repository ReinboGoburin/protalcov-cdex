import { json, missingKey, unavailable } from "@/lib/api";
import { podcastHeaders } from "@/lib/podcastAuth";
import type { SearchResponse } from "@/lib/types";

interface PodcastSearch {
  feeds?: Array<{ id: number; title: string; author?: string; image?: string; artwork?: string }>;
}

export async function GET(request: Request) {
  const key = process.env.PODCAST_INDEX_KEY;
  const secret = process.env.PODCAST_INDEX_SECRET;
  if (!key) return missingKey("PODCAST_INDEX_KEY");
  if (!secret) return missingKey("PODCAST_INDEX_SECRET");
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) return json({ results: [], hasMore: false } satisfies SearchResponse);

  try {
    const res = await fetch(`https://api.podcastindex.org/api/1.0/search/byterm?q=${encodeURIComponent(query)}`, {
      headers: podcastHeaders(key, secret)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as PodcastSearch;
    return json({
      results: (data.feeds || []).slice(0, 10).map((item) => ({
        id: String(item.id),
        type: "podcast",
        title: item.title,
        subtitle: item.author || "Podcast",
        year: "",
        imageUrl: item.artwork || item.image || null,
        source: "podcastindex"
      })),
      hasMore: false
    } satisfies SearchResponse);
  } catch {
    return unavailable();
  }
}
