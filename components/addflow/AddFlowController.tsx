"use client"

import { useState } from "react"
import { addToCollection, updateComment } from "@/lib/collection"
import { getMediaConfig, type MediaConfig } from "@/lib/media"
import type { CollectionItem, ItemDetail, MediaType, SearchResult } from "@/lib/types"
import { ChevronIcon } from "@/components/icons"
import TypeStep from "./TypeStep"
import SearchStep from "./SearchStep"
import DetailStep from "./DetailStep"
import CommentStep from "./CommentStep"

type Step = "type" | "search" | "detail" | "comment"

interface AddFlowControllerProps {
  /** When set, the flow opens directly on the comment step to edit this existing item's comment. */
  editItem: CollectionItem | null
  onClose: () => void
  onAdded: (id: string, type: MediaType) => void
  onCommentSaved: (item: CollectionItem) => void
}

const STEP_LABELS: Record<Step, string> = {
  type: "Ajouter",
  search: "Recherche",
  detail: "Aperçu",
  comment: "Commentaire",
}

// Renders every step of the add flow (choose type -> search -> detail ->
// comment) inside the phone frame itself, as plain client state — never a
// route change — so the flow never feels like it left the app.
export default function AddFlowController({
  editItem,
  onClose,
  onAdded,
  onCommentSaved,
}: AddFlowControllerProps) {
  const [step, setStep] = useState<Step>(editItem ? "comment" : "type")
  const [selectedConfig, setSelectedConfig] = useState<MediaConfig | null>(
    editItem ? (getMediaConfig(editItem.type) ?? null) : null
  )
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [detail, setDetail] = useState<ItemDetail | null>(null)

  const canGoBack = step !== "type" && !(step === "comment" && editItem)

  function handleBack() {
    if (step === "search") {
      setStep("type")
    } else if (step === "detail") {
      setStep("search")
    } else if (step === "comment" && !editItem) {
      setStep("detail")
    } else {
      onClose()
    }
  }

  function renderStep() {
    if (step === "type") {
      return (
        <TypeStep
          onSelect={(mediaConfig) => {
            setSelectedConfig(mediaConfig)
            setStep("search")
          }}
        />
      )
    }

    if (step === "search" && selectedConfig) {
      return (
        <SearchStep
          config={selectedConfig}
          onSelect={(result) => {
            setSelectedResult(result)
            setStep("detail")
          }}
        />
      )
    }

    if (step === "detail" && selectedConfig && selectedResult) {
      return (
        <DetailStep
          config={selectedConfig}
          result={selectedResult}
          onAdd={(resolved) => {
            setDetail(resolved)
            setStep("comment")
          }}
        />
      )
    }

    if (step === "comment" && editItem) {
      return (
        <CommentStep
          type={editItem.type}
          title={editItem.title}
          initialComment={editItem.comment}
          editMode
          onSubmit={(comment) => {
            updateComment(editItem.id, editItem.type, comment)
            onCommentSaved({ ...editItem, comment })
          }}
          onSkip={onClose}
        />
      )
    }

    if (step === "comment" && detail) {
      return (
        <CommentStep
          type={detail.type}
          title={detail.title}
          initialComment={null}
          editMode={false}
          onSubmit={(comment) => {
            addToCollection({ ...detail, comment })
            onAdded(detail.id, detail.type)
          }}
          onSkip={() => {
            addToCollection({ ...detail, comment: null })
            onAdded(detail.id, detail.type)
          }}
        />
      )
    }

    return null
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-surface-canvas">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={handleBack}
          aria-label={canGoBack ? "Retour" : "Fermer"}
          className="pressable flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
        >
          {canGoBack ? <ChevronIcon size={14} className="rotate-180" /> : <span className="text-lg leading-none">×</span>}
        </button>
        <span className="text-ui-label text-text-secondary">{STEP_LABELS[step]}</span>
      </div>

      <div key={step} className="step-enter min-h-0 flex-1">
        {renderStep()}
      </div>
    </div>
  )
}
