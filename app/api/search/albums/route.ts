import { fetchJson, json, unavailable, USER_AGENT, yearFromDate } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

interface MusicBrainzSearch {
  count: number;
  "release-groups": Array<{
    id: string;
    title: string;
    "first-release-date"?: string;
    "primary-type"?: string;
    "artist-credit"?: Array<{ name: string }>;
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) return json({ results: [], hasMore: false } satisfies SearchResponse);

  try {
    const data = await fetchJson<MusicBrainzSearch>(
      `https://musicbrainz.org/ws/2/release-group?query=${encodeURIComponent(query)}&fmt=json&limit=10`,
      { headers: { "User-Agent": USER_AGENT } }
    );
    const albums = data["release-groups"].filter((item) => item["primary-type"] === "Album");
    return json({
      results: albums.slice(0, 10).map((item) => ({
        id: item.id,
        type: "album",
        title: item.title,
        subtitle: item["artist-credit"]?.map((artist) => artist.name).join(", ") || "Artiste inconnu",
        year: yearFromDate(item["first-release-date"]),
        imageUrl: `https://coverartarchive.org/release-group/${item.id}/front-500`,
        source: "musicbrainz"
      })),
      hasMore: data.count > 10
    } satisfies SearchResponse);
  } catch {
    return unavailable();
  }
}
