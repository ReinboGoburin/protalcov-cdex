import { Fragment } from "react"
import type { CollectionItem, MediaType } from "@/lib/types"
import { getMediaConfig, COLLECTIBLE_TYPES } from "@/lib/media"
import Vignette from "@/components/Vignette"

export type CollectionSectionFilter = "all" | "stream" | "archives"

export interface CollectionFilters {
  section: CollectionSectionFilter
  types: MediaType[]
}

export const DEFAULT_COLLECTION_FILTERS: CollectionFilters = { section: "all", types: [] }

const SECTION_LABELS: { key: CollectionSectionFilter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "stream", label: "Flux" },
  { key: "archives", label: "Archives" },
]

const THUMB_HEIGHT = 64

interface CollectionViewProps {
  stream: CollectionItem[]
  archives: CollectionItem[]
  hiddenCount: number
  filters: CollectionFilters
  onFiltersChange: (filters: CollectionFilters) => void
  onItemClick: (item: CollectionItem) => void
}

export default function CollectionView({
  stream,
  archives,
  hiddenCount,
  filters,
  onFiltersChange,
  onItemClick,
}: CollectionViewProps) {
  const matchesType = (item: CollectionItem) =>
    filters.types.length === 0 || filters.types.includes(item.type)

  const filteredStream = stream.filter(matchesType)
  const filteredArchives = archives.filter(matchesType)

  const showStream = filters.section !== "archives"
  const showArchives = filters.section !== "stream"
  const showDivider = filters.section === "all" && filteredArchives.length > 0

  const rows = showStream ? filteredStream : []
  const archiveRows = showArchives ? filteredArchives : []
  const totalCount = rows.length + archiveRows.length

  function toggleType(type: MediaType) {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    onFiltersChange({ ...filters, types: next })
  }

  return (
    <div className="flex h-full flex-col pt-6">
      <div className="shrink-0 px-5">
        <div className="text-title-l text-text-primary">Collection</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SECTION_LABELS.map(({ key, label }) => (
            <Chip key={key} active={filters.section === key} onClick={() => onFiltersChange({ ...filters, section: key })}>
              {label}
            </Chip>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {COLLECTIBLE_TYPES.map((type) => (
            <Chip key={type} active={filters.types.includes(type)} onClick={() => toggleType(type)}>
              {getMediaConfig(type)?.label ?? type}
            </Chip>
          ))}
        </div>

        <div className="pt-3 pb-1 text-right text-meta text-text-secondary">
          {totalCount} item{totalCount > 1 ? "s" : ""}
        </div>
      </div>

      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="px-5">
          {rows.map((item, index) => (
            <Row key={`${item.type}:${item.id}`} item={item} showDivider={index > 0} onItemClick={onItemClick} />
          ))}

          {showDivider && (
            <div className="mt-3 mb-1 border-t border-border-default pt-2 text-meta tracking-wide text-text-secondary uppercase">
              Archives · {filteredArchives.length}
            </div>
          )}

          {archiveRows.map((item, index) => (
            <Row key={`${item.type}:${item.id}`} item={item} showDivider={index > 0} onItemClick={onItemClick} />
          ))}
        </div>

        {hiddenCount > 0 && (
          <p className="px-5 py-4 text-center text-meta text-text-secondary">
            {hiddenCount} item{hiddenCount > 1 ? "s" : ""} non affiché{hiddenCount > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  )
}

function Row({
  item,
  showDivider,
  onItemClick,
}: {
  item: CollectionItem
  showDivider: boolean
  onItemClick: (item: CollectionItem) => void
}) {
  const mediaLabel = getMediaConfig(item.type)?.label ?? item.type
  const subline = [mediaLabel, item.subtitle].filter(Boolean).join(" · ")

  return (
    <Fragment>
      {showDivider && <div className="ml-[60px] border-t border-border-default" />}
      <button
        type="button"
        onClick={() => onItemClick(item)}
        className="pressable flex w-full items-center gap-4 py-2 text-left"
      >
        <Vignette type={item.type} title={item.title} imageUrl={item.imageUrl} height={THUMB_HEIGHT} shadow={false} />
        <div className="mr-3 min-w-0 flex-1">
          <p className="truncate text-body-l text-text-primary">{item.title}</p>
          <p className="truncate text-body-m text-text-secondary">{subline}</p>
        </div>
      </button>
    </Fragment>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable rounded-full border px-3 py-1 text-meta transition ${
        active
          ? "border-text-primary bg-text-primary text-surface-panel"
          : "border-border-default text-text-secondary hover:border-text-secondary"
      }`}
    >
      {children}
    </button>
  )
}
