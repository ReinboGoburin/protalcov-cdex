"use client"

import { useMemo, useState } from "react"
import { getPromptChips } from "@/lib/prompts"
import type { CollectionComment, MediaType } from "@/lib/types"

const MAX_WORDS = 10

function wordCount(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

function capWords(text: string): string {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length <= MAX_WORDS) return text
  return words.slice(0, MAX_WORDS).join(" ")
}

interface CommentStepProps {
  type: MediaType
  title: string
  initialComment: CollectionComment | null
  editMode: boolean
  onSubmit: (comment: CollectionComment | null) => void
  onSkip: () => void
}

export default function CommentStep({
  type,
  title,
  initialComment,
  editMode,
  onSubmit,
  onSkip,
}: CommentStepProps) {
  const { visible, rest } = useMemo(() => getPromptChips(type), [type])
  const [expanded, setExpanded] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(initialComment?.prompt ?? null)
  const [answer, setAnswer] = useState(initialComment?.answer ?? "")

  const handlePromptClick = (prompt: string) => {
    if (selectedPrompt === prompt) {
      setSelectedPrompt(null)
      setAnswer("")
    } else {
      setSelectedPrompt(prompt)
      setAnswer("")
    }
  }

  const handlePrimary = () => {
    const comment = selectedPrompt && answer.trim() ? { prompt: selectedPrompt, answer: answer.trim() } : null
    onSubmit(comment)
  }

  return (
    <div className="flex h-full flex-col px-5 py-4">
      <h1 className="text-title-m text-text-primary">Un mot sur {title} ?</h1>
      <p className="mt-1 text-body-m text-text-secondary">
        Pas d&apos;obligation, juste si l&apos;envie y est.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {visible.map((prompt) => (
          <PromptChip
            key={prompt}
            prompt={prompt}
            active={selectedPrompt === prompt}
            onClick={() => handlePromptClick(prompt)}
          />
        ))}

        {!expanded && rest.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="pressable rounded-full border border-dashed border-state-inactive px-4 py-2 text-body-m text-text-secondary hover:border-text-secondary"
          >
            autres…
          </button>
        )}

        {expanded &&
          rest.map((prompt) => (
            <PromptChip
              key={prompt}
              prompt={prompt}
              active={selectedPrompt === prompt}
              onClick={() => handlePromptClick(prompt)}
            />
          ))}
      </div>

      {selectedPrompt && (
        <div className="mt-5">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(capWords(e.target.value))}
            onKeyDown={(e) => {
              const isCharacterKey = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey
              if (isCharacterKey && wordCount(answer) >= MAX_WORDS) {
                e.preventDefault()
              }
            }}
            onPaste={(e) => {
              e.preventDefault()
              const pasted = e.clipboardData.getData("text")
              const { selectionStart, selectionEnd, value } = e.currentTarget
              const start = selectionStart ?? value.length
              const end = selectionEnd ?? value.length
              setAnswer(capWords(value.slice(0, start) + pasted + value.slice(end)))
            }}
            autoFocus
            placeholder="..."
            className="w-full rounded-block border border-border-default px-4 py-3 text-body-m outline-none focus:border-accent-action"
          />
          <p className="mt-1 text-right text-meta text-text-secondary">
            {wordCount(answer)}/{MAX_WORDS} mots
          </p>
        </div>
      )}

      <div className="mt-auto flex gap-3 pt-6">
        <button
          onClick={handlePrimary}
          className="pressable rounded-block bg-accent-action px-5 py-2.5 text-ui-label text-surface-panel hover:opacity-90"
        >
          {editMode ? "Enregistrer" : "Ajouter"}
        </button>
        <button
          onClick={onSkip}
          className="pressable rounded-block border border-border-default px-5 py-2.5 text-ui-label text-text-primary hover:border-text-secondary"
        >
          {editMode ? "Annuler" : "Passer"}
        </button>
      </div>
    </div>
  )
}

function PromptChip({
  prompt,
  active,
  onClick,
}: {
  prompt: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`pressable rounded-full border px-4 py-2 text-body-m transition ${
        active
          ? "border-text-primary bg-text-primary text-surface-panel"
          : "border-border-default text-text-primary hover:border-text-secondary"
      }`}
    >
      {prompt}
    </button>
  )
}
