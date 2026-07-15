"use client"

import { useEffect, useRef, useState } from "react"
import type { MediaConfig } from "@/lib/media"
import type { SearchResult } from "@/lib/types"
import Vignette from "@/components/Vignette"
import ErrorNotice from "@/components/ErrorNotice"

interface SearchStepProps {
  config: MediaConfig
  onSelect: (result: SearchResult) => void
}

export default function SearchStep({ config, onSelect }: SearchStepProps) {
  const [term, setTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [searchedTerm, setSearchedTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const trimmed = term.trim()
    if (!trimmed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset search state when the field is cleared
      setResults([])
      setHasMore(false)
      setSearchedTerm("")
      setError(null)
      return
    }

    const timeout = setTimeout(() => {
      runSearch(trimmed, 1)
    }, 500)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  async function runSearch(query: string, requestedPage: number) {
    if (requestedPage === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const res = await fetch(
        `${config.searchEndpoint}?q=${encodeURIComponent(query)}&page=${requestedPage}`
      )

      if (res.status === 429) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? "Trop de recherches, patientez quelques secondes")
        setDisabled(true)
        setTimeout(() => setDisabled(false), 5000)
        return
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? "Service temporairement indisponible, réessayez dans quelques instants")
        return
      }

      const data: { results: SearchResult[]; hasMore: boolean } = await res.json()
      setResults((prev) => {
        const combined = requestedPage === 1 ? data.results : [...prev, ...data.results]
        const seen = new Set<string>()
        return combined.filter((result) => {
          const key = `${result.type}:${result.id}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
      })
      setHasMore(data.hasMore)
      setPage(requestedPage)
      setSearchedTerm(query)
    } catch {
      setError("Service temporairement indisponible, réessayez dans quelques instants")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  return (
    <div className="flex h-full flex-col px-5 py-4">
      <h2 className="text-title-m text-text-primary">Rechercher {config.label.toLowerCase()}</h2>

      <input
        ref={inputRef}
        type="text"
        value={term}
        disabled={disabled}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={config.searchPlaceholder}
        className="mt-3 w-full rounded-block border border-border-default px-4 py-2.5 text-body-m outline-none focus:border-accent-action disabled:bg-surface-panel"
      />

      <div className="thin-scroll mt-4 min-h-0 flex-1 overflow-y-auto">
        {loading && <SkeletonList />}

        {!loading && error && <ErrorNotice title="Recherche indisponible" message={error} />}

        {!loading && !error && term.trim() && results.length === 0 && searchedTerm && (
          <p className="text-body-m text-text-secondary">
            Aucun résultat pour « {searchedTerm} ». Essayez un autre terme.
          </p>
        )}

        {!loading && results.length > 0 && (
          <ul className="flex flex-col gap-2">
            {results.map((result) => (
              <li key={`${result.type}:${result.id}`}>
                <button
                  type="button"
                  onClick={() => onSelect(result)}
                  className="pressable flex w-full items-center gap-3 rounded-block border border-border-default p-2 text-left hover:border-text-secondary"
                >
                  <Vignette type={result.type} title={result.title} imageUrl={result.imageUrl} height={64} shadow={false} />
                  <div className="min-w-0">
                    <p className="truncate text-body-m font-semibold text-text-primary">{result.title}</p>
                    <p className="truncate text-body-m text-text-secondary">
                      {[result.subtitle, result.year].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && hasMore && results.length > 0 && (
          <button
            onClick={() => runSearch(searchedTerm, page + 1)}
            disabled={loadingMore}
            className="pressable mt-4 w-full rounded-block border border-border-default py-2 text-ui-label text-text-primary hover:border-text-secondary disabled:opacity-50"
          >
            {loadingMore ? "Chargement..." : "Plus de résultats"}
          </button>
        )}
      </div>
    </div>
  )
}

function SkeletonList() {
  return (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-block border border-border-default p-2">
          <div className="h-16 w-11 shrink-0 animate-pulse rounded-[5px] bg-surface-panel" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-panel" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface-panel" />
          </div>
        </li>
      ))}
    </ul>
  )
}
