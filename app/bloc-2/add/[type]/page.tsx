"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FooterAttribution } from "@/components/FooterAttribution";
import { MediaImage } from "@/components/MediaImage";
import { saveSelectedItem } from "@/lib/collection";
import { ensureType, itemDetailFromSearch } from "@/lib/types";
import { mediaLabels, type SearchResponse, type SearchResult, type MediaType, type ItemDetail, typeToSearchRoute } from "@/lib/types";

export default function SearchPage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const type = useMemo(() => ensureType(params.type), [params.type]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!type || query.trim().length < 2) {
      setResults([]);
      setHasMore(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void runSearch(type, query, 1, false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [query, type]);

  async function runSearch(currentType: MediaType, term: string, nextPage: number, append: boolean) {
    setLoading(true);
    setError("");
    try {
      const route = typeToSearchRoute[currentType];
      const res = await fetch(`/api/search/${route}?q=${encodeURIComponent(term)}&page=${nextPage}`);
      const data = (await res.json()) as SearchResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Service temporairement indisponible, reessayez dans quelques instants");
      setResults((current) => (append ? [...current, ...data.results] : data.results));
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Service temporairement indisponible, reessayez dans quelques instants");
    } finally {
      setLoading(false);
    }
  }

  function openResult(result: SearchResult) {
    const detail: ItemDetail = itemDetailFromSearch(result, basicMetadata(result));
    saveSelectedItem(detail);
    router.push(`/bloc-2/add/${result.type}/${result.id}`);
  }

  if (!type) {
    return <main className="page"><div className="shell"><h1>Type inconnu</h1></div></main>;
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <div>
            <Link className="ghost-button" href="/bloc-2/add">Retour</Link>
            <h1 style={{ marginTop: 18 }}>{mediaLabels[type]}</h1>
            <p className="subtitle">Tape au moins deux caracteres, la recherche part toute seule.</p>
          </div>
        </header>

        <input
          autoFocus
          className="search-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Rechercher un ${mediaLabels[type].toLowerCase()}`}
          value={query}
        />

        {loading ? <p className="subtitle" style={{ marginTop: 18 }}>Recherche en cours...</p> : null}
        {error ? <p className="subtitle" style={{ marginTop: 18 }}>{error}</p> : null}
        {!loading && query.length >= 2 && results.length === 0 && !error ? (
          <p className="subtitle" style={{ marginTop: 18 }}>Aucun resultat pour {query}. Essayez un autre terme.</p>
        ) : null}

        <section className="result-list">
          {results.map((result) => (
            <button className="result-row" key={`${result.type}-${result.id}`} onClick={() => openResult(result)} type="button">
              <MediaImage item={result} className="media-thumb" />
              <div>
                <h3>{result.title}</h3>
                <p>{[result.subtitle, result.year].filter(Boolean).join(" - ")}</p>
              </div>
            </button>
          ))}
        </section>

        {hasMore ? (
          <button className="ghost-button" disabled={loading} onClick={() => runSearch(type, query, page + 1, true)} style={{ marginTop: 18 }} type="button">
            Plus de resultats
          </button>
        ) : null}

        <FooterAttribution />
      </div>
    </main>
  );
}

function basicMetadata(result: SearchResult): Record<string, string | string[]> {
  if (result.type === "book") return { auteur: result.subtitle };
  if (result.type === "podcast") return { auteur: result.subtitle, description: "" };
  return {};
}


