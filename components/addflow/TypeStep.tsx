import { MEDIA_TYPES, COLLECTIBLE_TYPES, type MediaConfig } from "@/lib/media"

const ADD_FLOW_TYPES = MEDIA_TYPES.filter((m) => COLLECTIBLE_TYPES.includes(m.type))

export default function TypeStep({ onSelect }: { onSelect: (config: MediaConfig) => void }) {
  return (
    <div className="px-5 py-4">
      <h2 className="text-title-m text-text-primary">Qu&apos;est-ce que tu veux ajouter ?</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {ADD_FLOW_TYPES.map((media) => (
          <button
            key={media.slug}
            type="button"
            onClick={() => onSelect(media)}
            className="pressable rounded-block border border-border-default px-4 py-6 text-center hover:border-text-secondary"
          >
            <span className="text-body-l font-semibold text-text-primary">{media.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
