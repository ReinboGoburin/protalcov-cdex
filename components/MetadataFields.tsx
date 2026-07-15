import type { MediaType } from "@/lib/types"

interface FieldSpec {
  key: string
  label: string
}

const FIELDS: Record<MediaType, FieldSpec[]> = {
  movie: [
    { key: "director", label: "Réalisateur" },
    { key: "genres", label: "Genres" },
    { key: "synopsis", label: "Synopsis" },
  ],
  tv: [
    { key: "creator", label: "Créateur" },
    { key: "genres", label: "Genres" },
    { key: "seasons", label: "Saisons" },
  ],
  book: [
    { key: "author", label: "Auteur" },
    { key: "publisher", label: "Éditeur" },
  ],
  album: [
    { key: "artist", label: "Artiste" },
    { key: "label", label: "Label" },
    { key: "genres", label: "Genres" },
  ],
  videogame: [
    { key: "genres", label: "Genres" },
    { key: "description", label: "Description" },
  ],
  boardgame: [{ key: "description", label: "Description" }],
  podcast: [
    { key: "author", label: "Auteur" },
    { key: "description", label: "Description" },
  ],
}

function formatValue(value: string | string[]): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ")
  return value
}

export default function MetadataFields({
  type,
  metadata,
}: {
  type: MediaType
  metadata: Record<string, string | string[]>
}) {
  const fields = FIELDS[type]

  return (
    <dl className="flex flex-col gap-3">
      {fields.map(({ key, label }) => {
        const raw = metadata[key]
        const value = raw ? formatValue(raw) : ""
        if (!value) return null
        return (
          <div key={key}>
            <dt className="text-meta tracking-wide text-text-secondary uppercase">{label}</dt>
            <dd className="text-body-m text-text-primary">{value}</dd>
          </div>
        )
      })}
    </dl>
  )
}
