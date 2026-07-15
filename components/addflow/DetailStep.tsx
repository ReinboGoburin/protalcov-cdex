"use client"

import { useEffect, useState } from "react"
import { isInCollection } from "@/lib/collection"
import type { MediaConfig } from "@/lib/media"
import type { ItemDetail, SearchResult } from "@/lib/types"
import Vignette from "@/components/Vignette"
import ErrorNotice from "@/components/ErrorNotice"
import MetadataFields from "@/components/MetadataFields"

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: ItemDetail }

interface DetailStepProps {
  config: MediaConfig
  result: SearchResult
  onAdd: (detail: ItemDetail) => void
}

export default function DetailStep({ config, result, onAdd }: DetailStepProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" })
  const [duplicateError, setDuplicateError] = useState(false)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting per selected result
    setState({ status: "loading" })
    setDuplicateError(false)

    async function load() {
      if (!config.detailEndpoint) {
        // No dedicated detail route (book, podcast) — the search result already carries full metadata.
        setState({
          status: "ready",
          detail: {
            id: result.id,
            type: result.type,
            title: result.title,
            subtitle: result.subtitle,
            year: result.year,
            imageUrl: result.imageUrl,
            source: result.source,
            metadata: result.detailMetadata ?? {},
          },
        })
        return
      }

      try {
        const res = await fetch(`${config.detailEndpoint}/${result.id}`)
        if (cancelled) return
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null
          setState({
            status: "error",
            message:
              data?.error ??
              "Service temporairement indisponible, réessayez dans quelques instants",
          })
          return
        }
        const detail: ItemDetail = await res.json()
        setState({ status: "ready", detail })
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Service temporairement indisponible, réessayez dans quelques instants",
          })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [config, result])

  if (state.status === "loading") {
    return (
      <div className="flex h-full items-center justify-center px-5 py-16">
        <p className="text-body-m text-text-secondary">Chargement...</p>
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="px-5 py-10">
        <ErrorNotice title="Fiche indisponible" message={state.message} />
      </div>
    )
  }

  const { detail } = state

  const handleAdd = () => {
    if (isInCollection(detail.id, detail.type)) {
      setDuplicateError(true)
      return
    }
    onAdd(detail)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center bg-surface-panel px-5 py-4">
        <Vignette type={detail.type} title={detail.title} imageUrl={detail.imageUrl} height={220} />
      </div>

      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <span className="text-meta tracking-wide text-text-secondary uppercase">{config.label}</span>
        <h1 className="mt-1 text-title-m text-text-primary">{detail.title}</h1>
        <p className="text-body-m text-text-secondary">
          {[detail.subtitle, detail.year].filter(Boolean).join(" · ")}
        </p>

        <div className="mt-4">
          <MetadataFields type={detail.type} metadata={detail.metadata} />
        </div>

        {duplicateError && (
          <p className="mt-4 text-body-m text-state-error">Cet item est déjà dans ta collection.</p>
        )}
      </div>

      <div className="shrink-0 border-t border-border-default px-5 py-3">
        <button
          onClick={handleAdd}
          className="pressable w-full rounded-block bg-accent-action px-5 py-2.5 text-ui-label text-surface-panel hover:opacity-90"
        >
          Ajouter à ma collection
        </button>
      </div>
    </div>
  )
}
