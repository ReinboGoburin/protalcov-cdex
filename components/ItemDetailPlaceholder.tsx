// Présentation provisoire — la vue détail sera designée ultérieurement dans
// la nouvelle direction ; seules les fonctions (commentaire, archiver/
// ressortir, supprimer) font foi.

import { getMediaConfig } from "@/lib/media"
import type { CollectionItem } from "@/lib/types"
import Vignette from "@/components/Vignette"
import MetadataFields from "@/components/MetadataFields"

interface ItemDetailPlaceholderProps {
  item: CollectionItem
  isArchived: boolean
  onClose: () => void
  onDelete: (item: CollectionItem) => void
  onEditComment: (item: CollectionItem) => void
  onArchive: (item: CollectionItem) => void
  onUnarchive: (item: CollectionItem) => void
}

export default function ItemDetailPlaceholder({
  item,
  isArchived,
  onClose,
  onDelete,
  onEditComment,
  onArchive,
  onUnarchive,
}: ItemDetailPlaceholderProps) {
  const mediaConfig = getMediaConfig(item.type)
  const addedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(item.addedAt))

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
      <div className="thin-scroll max-h-full w-full max-w-[300px] overflow-y-auto rounded-block border border-border-default bg-surface-panel p-5">
        <div className="mb-4 flex items-start justify-between">
          <span className="text-meta tracking-wide text-text-secondary uppercase">
            {mediaConfig?.label ?? item.type}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="pressable flex h-7 w-7 items-center justify-center text-lg leading-none text-text-secondary hover:text-text-primary"
          >
            ×
          </button>
        </div>

        <div className="mb-4 flex justify-center">
          <Vignette type={item.type} title={item.title} imageUrl={item.imageUrl} height={200} />
        </div>

        <h1 className="text-title-m text-text-primary">{item.title}</h1>
        <p className="mt-1 text-body-m text-text-secondary">
          {[item.subtitle, item.year].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-meta text-text-secondary">Ajouté le {addedDate}</p>

        <div className="mt-4">
          <MetadataFields type={item.type} metadata={item.metadata} />
        </div>

        {item.comment && (
          <div className="mt-4 rounded-block border border-border-default p-3">
            <p className="text-meta tracking-wide text-text-secondary uppercase">{item.comment.prompt}</p>
            <p className="mt-1 text-body-m text-text-primary">{item.comment.answer}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          <ActionButton onClick={() => onEditComment(item)}>Modifier le commentaire</ActionButton>
          {isArchived ? (
            <ActionButton onClick={() => onUnarchive(item)}>Ressortir</ActionButton>
          ) : (
            <ActionButton onClick={() => onArchive(item)}>Archiver</ActionButton>
          )}
          <ActionButton tone="error" onClick={() => onDelete(item)}>
            Supprimer
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  tone,
}: {
  children: React.ReactNode
  onClick: () => void
  tone?: "error"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable rounded-block border px-4 py-2 text-ui-label ${
        tone === "error" ? "border-state-error text-state-error" : "border-border-default text-text-primary"
      }`}
    >
      {children}
    </button>
  )
}
