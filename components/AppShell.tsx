"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  archiveItem,
  getCollection,
  removeFromCollection,
  replaceItem,
  restoreToCollection,
  unarchiveItem,
} from "@/lib/collection"
import type { CollectionItem } from "@/lib/types"
import { isCollectibleType } from "@/lib/media"
import { partitionCollection } from "@/lib/archive"
import { DEFAULT_DEV_CONFIG, loadDevConfig, saveDevConfig, type DevConfig } from "@/lib/devConfig"
import { useDragScroll } from "@/lib/useDragScroll"
import PhoneFrame from "@/components/PhoneFrame"
import BottomNav from "@/components/BottomNav"
import DevPanel from "@/components/DevPanel"
import Toast from "@/components/Toast"
import HomeScreen from "@/components/HomeScreen"
import CollectionView, { DEFAULT_COLLECTION_FILTERS, type CollectionFilters } from "@/components/CollectionView"
import ItemDetailPlaceholder from "@/components/ItemDetailPlaceholder"
import AddFlowController from "@/components/addflow/AddFlowController"

const FILTERS_STORAGE_KEY = "alcove_collection_filters"

interface AddFlowState {
  editItem: CollectionItem | null
}

type PendingToast =
  | { kind: "undo"; message: string; item: CollectionItem; action: "delete" | "archive" | "unarchive" }
  | { kind: "info"; message: string }

const UNDO_MESSAGES: Record<"delete" | "archive" | "unarchive", string> = {
  delete: "Item supprimé",
  archive: "Archivé",
  unarchive: "Ressorti",
}

interface AppShellProps {
  active: "home" | "collection"
}

export default function AppShell({ active }: AppShellProps) {
  const router = useRouter()
  const scrollRef = useDragScroll<HTMLDivElement>()
  const [items, setItems] = useState<CollectionItem[] | null>(null)
  const [devConfig, setDevConfig] = useState<DevConfig>(DEFAULT_DEV_CONFIG)
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const [addFlow, setAddFlow] = useState<AddFlowState | null>(null)
  const [toast, setToast] = useState<PendingToast | null>(null)
  const [filters, setFilters] = useState<CollectionFilters>(DEFAULT_COLLECTION_FILTERS)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read from localStorage/sessionStorage
    setItems(getCollection())
    setDevConfig(loadDevConfig())

    const storedFilters = window.sessionStorage.getItem(FILTERS_STORAGE_KEY)
    if (storedFilters) {
      try {
        const parsed = JSON.parse(storedFilters) as Partial<CollectionFilters>
        setFilters({
          section: parsed.section ?? DEFAULT_COLLECTION_FILTERS.section,
          types: parsed.types ?? DEFAULT_COLLECTION_FILTERS.types,
        })
      } catch {
        // Ignore malformed session state — defaults already set.
      }
    }
  }, [])

  const visibleItems = useMemo(() => (items ?? []).filter((item) => isCollectibleType(item.type)), [items])
  const hiddenCount = (items?.length ?? 0) - visibleItems.length
  const partition = useMemo(
    () => partitionCollection(visibleItems, devConfig.streamCap),
    [visibleItems, devConfig.streamCap]
  )

  function changeDevConfig(next: DevConfig) {
    setDevConfig(next)
    saveDevConfig(next)
  }

  function changeFilters(next: CollectionFilters) {
    setFilters(next)
    window.sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(next))
  }

  function openAddFlow() {
    setAddFlow({ editItem: null })
  }

  function showInfoToast() {
    setToast({ kind: "info", message: "à venir…" })
  }

  function handleExplore() {
    changeFilters({ section: "stream", types: [] })
    router.push("/collection")
  }

  function handleDelete(item: CollectionItem) {
    const removed = removeFromCollection(item.id, item.type)
    if (removed) setToast({ kind: "undo", message: UNDO_MESSAGES.delete, item: removed, action: "delete" })
    setSelected(null)
    setItems(getCollection())
  }

  function handleArchive(item: CollectionItem) {
    const previous = archiveItem(item.id, item.type)
    if (previous) setToast({ kind: "undo", message: UNDO_MESSAGES.archive, item: previous, action: "archive" })
    setSelected(null)
    setItems(getCollection())
  }

  function handleUnarchive(item: CollectionItem) {
    const previous = unarchiveItem(item.id, item.type)
    if (previous) setToast({ kind: "undo", message: UNDO_MESSAGES.unarchive, item: previous, action: "unarchive" })
    setSelected(null)
    setItems(getCollection())
  }

  function handleUndo() {
    if (!toast || toast.kind !== "undo") return
    if (toast.action === "delete") restoreToCollection(toast.item)
    else replaceItem(toast.item)
    setItems(getCollection())
    setToast(null)
  }

  function handleEditComment(item: CollectionItem) {
    setSelected(null)
    setAddFlow({ editItem: item })
  }

  function handleAdded() {
    setAddFlow(null)
    setItems(getCollection())
    setSelected(null)
  }

  function handleCommentSaved(item: CollectionItem) {
    setAddFlow(null)
    setItems(getCollection())
    setSelected(item)
  }

  if (items === null) return null

  const isSelectedArchived = selected
    ? partition.archives.some((a) => a.id === selected.id && a.type === selected.type)
    : false

  const cssVars = {
    "--accent-sealed": devConfig.accentSealed,
    "--label-size": `${devConfig.typography.labelSize}px`,
    "--display-size": `${devConfig.typography.displaySize}px`,
    "--block-title-size": `${devConfig.typography.blockTitleSize}px`,
    "--ui-label-size": `${devConfig.typography.uiLabelSize}px`,
  } as React.CSSProperties

  return (
    <div style={cssVars}>
      <DevPanel config={devConfig} onChange={changeDevConfig} />

      <PhoneFrame frame={devConfig.frame}>
        <div ref={scrollRef} className="thin-scroll min-h-0 flex-1 overflow-y-auto">
          {active === "home" ? (
            <HomeScreen
              partition={partition}
              devConfig={devConfig}
              onOpenAdd={openAddFlow}
              onExplore={handleExplore}
              onInert={showInfoToast}
            />
          ) : (
            <CollectionView
              stream={partition.stream}
              archives={partition.archives}
              hiddenCount={hiddenCount}
              filters={filters}
              onFiltersChange={changeFilters}
              onItemClick={setSelected}
            />
          )}
        </div>

        <BottomNav active={active} onAdd={openAddFlow} onInert={showInfoToast} />

        {addFlow && (
          <AddFlowController
            editItem={addFlow.editItem}
            onClose={() => setAddFlow(null)}
            onAdded={handleAdded}
            onCommentSaved={handleCommentSaved}
          />
        )}

        {selected && (
          <ItemDetailPlaceholder
            item={selected}
            isArchived={isSelectedArchived}
            onClose={() => setSelected(null)}
            onDelete={handleDelete}
            onEditComment={handleEditComment}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
          />
        )}
      </PhoneFrame>

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.kind === "undo" ? "Annuler" : undefined}
          onAction={toast.kind === "undo" ? handleUndo : undefined}
          onExpire={() => setToast(null)}
        />
      )}
    </div>
  )
}
