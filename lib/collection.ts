import type { CollectionItem, CollectionComment, MediaType } from "./types"

const STORAGE_KEY = "alcove_collection"

function readRaw(): CollectionItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeRaw(items: CollectionItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getCollection(): CollectionItem[] {
  return readRaw().sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )
}

export function findItem(id: string, type: MediaType): CollectionItem | undefined {
  return readRaw().find((item) => item.id === id && item.type === type)
}

export function isInCollection(id: string, type: MediaType): boolean {
  return findItem(id, type) !== undefined
}

export function addToCollection(
  item: Omit<CollectionItem, "addedAt">
): { ok: true } | { ok: false; reason: "duplicate" } {
  const items = readRaw()
  if (items.some((i) => i.id === item.id && i.type === item.type)) {
    return { ok: false, reason: "duplicate" }
  }
  items.push({ ...item, addedAt: new Date().toISOString() })
  writeRaw(items)
  return { ok: true }
}

export function removeFromCollection(id: string, type: MediaType): CollectionItem | null {
  const items = readRaw()
  const target = items.find((i) => i.id === id && i.type === type) ?? null
  writeRaw(items.filter((i) => !(i.id === id && i.type === type)))
  return target
}

export function restoreToCollection(item: CollectionItem) {
  const items = readRaw()
  if (items.some((i) => i.id === item.id && i.type === item.type)) return
  items.push(item)
  writeRaw(items)
}

export function archiveItem(id: string, type: MediaType): CollectionItem | null {
  const items = readRaw()
  const idx = items.findIndex((i) => i.id === id && i.type === type)
  if (idx === -1) return null
  const previous = items[idx]
  items[idx] = { ...previous, archivedAt: Date.now() }
  writeRaw(items)
  return previous
}

export function unarchiveItem(id: string, type: MediaType): CollectionItem | null {
  const items = readRaw()
  const idx = items.findIndex((i) => i.id === id && i.type === type)
  if (idx === -1) return null
  const previous = items[idx]
  items[idx] = { ...previous, archivedAt: undefined, addedAt: new Date().toISOString() }
  writeRaw(items)
  return previous
}

/** Overwrites an item in place by id+type — used to undo an archive/unarchive (the item was mutated, never removed). */
export function replaceItem(item: CollectionItem) {
  const items = readRaw()
  const idx = items.findIndex((i) => i.id === item.id && i.type === item.type)
  if (idx === -1) return
  items[idx] = item
  writeRaw(items)
}

export function updateComment(
  id: string,
  type: MediaType,
  comment: CollectionComment | null
) {
  const items = readRaw()
  const idx = items.findIndex((i) => i.id === id && i.type === type)
  if (idx === -1) return
  items[idx] = { ...items[idx], comment }
  writeRaw(items)
}
