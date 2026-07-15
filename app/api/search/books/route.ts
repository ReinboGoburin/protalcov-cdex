import { NextRequest, NextResponse } from "next/server"
import { serviceUnavailable } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"
import type { SearchResponse, SearchResult } from "@/lib/types"

interface GoogleBooksIndustryIdentifier {
  type: string
  identifier: string
}

interface GoogleBooksVolume {
  id: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    publishedDate?: string
    publisher?: string
    imageLinks?: { thumbnail?: string; smallThumbnail?: string }
    industryIdentifiers?: GoogleBooksIndustryIdentifier[]
  }
}

interface OpenLibraryDoc {
  key: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  publisher?: string[]
  isbn?: string[]
  cover_i?: number
}

function normalizeGoogleThumbnail(url: string): string {
  return url.replace(/^http:/, "https:").replace(/&edge=curl/g, "")
}

function openLibraryCoverFromIsbn(identifiers: GoogleBooksIndustryIdentifier[]): string | null {
  const isbn13 = identifiers.find((i) => i.type === "ISBN_13")?.identifier
  const isbn10 = identifiers.find((i) => i.type === "ISBN_10")?.identifier
  const isbn = isbn13 ?? isbn10
  return isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null
}

async function searchGoogleBooks(query: string, page: number): Promise<SearchResponse> {
  const url = new URL("https://www.googleapis.com/books/v1/volumes")
  url.searchParams.set("q", query)
  url.searchParams.set("langRestrict", "fr")
  url.searchParams.set("maxResults", "10")
  url.searchParams.set("printType", "books")
  url.searchParams.set("startIndex", String((page - 1) * 10))
  const googleBooksApiKey = getServerEnv().GOOGLE_BOOKS_API_KEY
  if (googleBooksApiKey) {
    url.searchParams.set("key", googleBooksApiKey)
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Google Books a répondu avec le statut ${res.status}`)

  const data = (await res.json()) as any
  const volumes: GoogleBooksVolume[] = data.items ?? []

  const results: SearchResult[] = volumes.map((volume) => {
    const info = volume.volumeInfo ?? {}
    const identifiers = info.industryIdentifiers ?? []
    const author = info.authors?.[0] ?? ""
    const publisher = info.publisher ?? ""

    const thumbnail = info.imageLinks?.thumbnail
    const imageUrl = thumbnail
      ? normalizeGoogleThumbnail(thumbnail)
      : openLibraryCoverFromIsbn(identifiers)

    return {
      id: volume.id,
      type: "book",
      title: info.title ?? "",
      subtitle: author,
      year: (info.publishedDate ?? "").slice(0, 4),
      imageUrl,
      source: "googlebooks",
      detailMetadata: {
        author: info.authors?.join(", ") ?? "",
        publisher,
      },
    }
  })

  const totalItems = Number(data.totalItems ?? results.length)
  const hasMore = page * 10 < totalItems

  return { results, hasMore }
}

async function searchOpenLibrary(query: string, page: number): Promise<SearchResponse> {
  const url = new URL("https://openlibrary.org/search.json")
  url.searchParams.set("q", query)
  url.searchParams.set("limit", "10")
  url.searchParams.set("page", String(page))
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,publisher,isbn,cover_i"
  )

  const res = await fetch(url, {
    headers: { "User-Agent": "Alcove/0.1 (hugapi@fea.st)" },
  })
  if (!res.ok) throw new Error(`Open Library a répondu avec le statut ${res.status}`)

  const data = (await res.json()) as any
  const docs: OpenLibraryDoc[] = data.docs ?? []

  const results: SearchResult[] = docs.map((doc) => {
    const id = doc.key.replace("/works/", "")
    let imageUrl: string | null = null
    if (doc.cover_i) {
      imageUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    } else if (doc.isbn && doc.isbn.length > 0) {
      imageUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`
    }
    const author = doc.author_name?.[0] ?? ""
    const publisher = doc.publisher?.[0] ?? ""

    return {
      id,
      type: "book",
      title: doc.title ?? "",
      subtitle: author,
      year: doc.first_publish_year ? String(doc.first_publish_year) : "",
      imageUrl,
      source: "openlibrary",
      detailMetadata: {
        author,
        publisher,
      },
    }
  })

  const numFound = Number(data.numFound ?? results.length)
  const hasMore = page * 10 < numFound

  return { results, hasMore }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1

  if (!query) {
    return NextResponse.json<SearchResponse>({ results: [], hasMore: false })
  }

  try {
    return NextResponse.json<SearchResponse>(await searchGoogleBooks(query, page))
  } catch {
    // Google Books unavailable or rate-limited: fall back to a full Open Library search.
    try {
      return NextResponse.json<SearchResponse>(await searchOpenLibrary(query, page))
    } catch {
      return serviceUnavailable()
    }
  }
}
