import { fetchJson, json, normalizeImageUrl, unavailable, yearFromDate } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

interface GoogleBooks {
  items?: Array<{
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      publishedDate?: string;
      publisher?: string;
      imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    };
  }>;
  totalItems: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) return json({ results: [], hasMore: false } satisfies SearchResponse);

  try {
    const key = process.env.GOOGLE_BOOKS_API_KEY;
    const auth = key ? `&key=${encodeURIComponent(key)}` : "";
    const data = await fetchJson<GoogleBooks>(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=fr&maxResults=10&printType=books${auth}`
    );
    return json({
      results: (data.items || []).slice(0, 10).map((item) => ({
        id: item.id,
        type: "book",
        title: item.volumeInfo.title || "Sans titre",
        subtitle: item.volumeInfo.authors?.[0] || "Auteur inconnu",
        year: yearFromDate(item.volumeInfo.publishedDate),
        imageUrl: normalizeImageUrl(item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail),
        source: "googlebooks"
      })),
      hasMore: data.totalItems > 10
    } satisfies SearchResponse);
  } catch {
    return unavailable();
  }
}
