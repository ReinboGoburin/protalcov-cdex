import { fetchJson, json, unavailable, USER_AGENT, yearFromDate } from "@/lib/api";
import type { ItemDetail } from "@/lib/types";

interface MusicBrainzDetail {
  id: string;
  title: string;
  "first-release-date"?: string;
  genres?: Array<{ name: string; count?: number }>;
  "artist-credit"?: Array<{ name: string }>;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const item = await fetchJson<MusicBrainzDetail>(`https://musicbrainz.org/ws/2/release-group/${id}?inc=genres+artist-credits&fmt=json`, {
      headers: { "User-Agent": USER_AGENT }
    });
    const genres = (item.genres || []).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 3).map((genre) => genre.name);
    const artist = item["artist-credit"]?.map((person) => person.name).join(", ") || "Artiste inconnu";
    return json({
      id: item.id,
      type: "album",
      title: item.title,
      subtitle: artist,
      year: yearFromDate(item["first-release-date"]),
      imageUrl: `https://coverartarchive.org/release-group/${item.id}/front-500`,
      source: "musicbrainz",
      metadata: {
        artiste: artist,
        label: "",
        genres
      }
    } satisfies ItemDetail);
  } catch {
    return unavailable();
  }
}
