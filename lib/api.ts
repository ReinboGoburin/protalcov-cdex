import { XMLParser } from "fast-xml-parser";
import type { ItemDetail, MediaType, SearchResult } from "./types";

export const USER_AGENT = "Alcove/0.1 (hugapi@fea.st)";

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function unavailable() {
  return json({ error: "Service temporairement indisponible, reessayez dans quelques instants" }, 503);
}

export function missingKey(name: string) {
  return json({ error: `Variable d'environnement manquante: ${name}` }, 503);
}

export function yearFromDate(value?: string | null) {
  return value ? value.slice(0, 4) : "";
}

export function trimText(value = "", max = 150) {
  const normalized = decodeHtml(value).replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max).trim()}...` : normalized;
}

export function tmdbImage(path?: string | null, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function normalizeImageUrl(value?: string | null) {
  if (!value) return null;
  return value.replace(/^http:\/\//, "https://").replace("&edge=curl", "").replace("zoom=1", "zoom=2");
}

export function decodeHtml(value = "") {
  return value
    .replace(/&#10;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchBggXml(url: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.status === 202) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" }).parse(xml);
  }
  throw new Error("BGG retry exhausted");
}

export function searchFromDetail(detail: ItemDetail): SearchResult {
  return {
    id: detail.id,
    type: detail.type,
    title: detail.title,
    subtitle: detail.subtitle,
    year: detail.year,
    imageUrl: detail.imageUrl,
    source: detail.source
  };
}

export function itemDetailFromSearch(result: SearchResult, metadata: Record<string, string | string[]> = {}): ItemDetail {
  return { ...result, metadata };
}

export function ensureType(value: string): MediaType | null {
  if (["movie", "tv", "book", "album", "videogame", "boardgame", "podcast"].includes(value)) {
    return value as MediaType;
  }
  return null;
}
