import type { CollectionItem } from "@/lib/types"

export interface CollectionPartition {
  stream: CollectionItem[]
  archives: CollectionItem[]
}

/**
 * Splits a newest-first (by addedAt) item list into the flux (stream) and
 * archives, purely derived — nothing is written. Manually archived items
 * (archivedAt set) are always archives; among the rest, the first
 * `streamCap` (still newest-first) are the stream and everything past that
 * falls into the archives automatically, so raising/lowering the cap moves
 * the boundary without touching storage.
 */
export function partitionCollection(items: CollectionItem[], streamCap: number): CollectionPartition {
  const manualArchives: CollectionItem[] = []
  const rest: CollectionItem[] = []

  for (const item of items) {
    if (item.archivedAt != null) manualArchives.push(item)
    else rest.push(item)
  }

  const stream = rest.slice(0, streamCap)
  const autoArchives = rest.slice(streamCap)
  const archives = [...manualArchives, ...autoArchives].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )

  return { stream, archives }
}
