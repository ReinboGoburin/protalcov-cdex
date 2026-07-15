"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import pkg from "@/package.json"
import type { MediaType } from "@/lib/types"
import type { CollectionPartition } from "@/lib/archive"
import type { DevConfig } from "@/lib/devConfig"
import { RESONANCE_WORKS, CORRESPONDENCES } from "@/lib/fixtures"
import Vignette, { getVignetteRatio } from "@/components/Vignette"
import {
  CompassIcon,
  WaveIcon,
  ResonanceIcon,
  EnvelopeIcon,
  PlusIcon,
  ChevronIcon,
  LockIcon,
  CapsuleDiamondIcon,
  type CapsuleState,
} from "@/components/icons"
import Avatar from "@/components/Avatar"

const FLUX_ROW_GAP = 8

/** Largest height (<= refHeight) at which up to 3 items of the given types still fit `availableWidth` — never overflows, never crops. */
function fittingFluxHeight(types: MediaType[], refHeight: number, availableWidth: number): number {
  if (types.length === 0 || availableWidth <= 0) return refHeight
  const gapTotal = (types.length - 1) * FLUX_ROW_GAP
  const ratioSum = types.reduce((sum, t) => sum + getVignetteRatio(t), 0)
  if (ratioSum <= 0) return refHeight
  const maxHeight = (availableWidth - gapTotal) / ratioSum
  return Math.max(0, Math.min(refHeight, maxHeight))
}

interface HomeScreenProps {
  partition: CollectionPartition
  devConfig: DevConfig
  onOpenAdd: () => void
  onExplore: () => void
  onInert: () => void
}

export default function HomeScreen({ partition, devConfig, onOpenAdd, onExplore, onInert }: HomeScreenProps) {
  return (
    <div className="pt-6 pb-4">
      <Header />
      <CapsuleBanner state={devConfig.capsuleState} />
      <FluxBlock
        stream={partition.stream}
        refHeight={devConfig.vignetteHeights.flux}
        onOpenAdd={onOpenAdd}
        onExplore={onExplore}
      />
      <ResonancesBlock height={devConfig.vignetteHeights.resonance} onInert={onInert} />
      <CorrespondancesBlock height={devConfig.vignetteHeights.correspondence} onInert={onInert} />
    </div>
  )
}

function Header() {
  return (
    <div className="mb-5 flex items-baseline justify-between px-5">
      <div className="text-title-l tracking-[1.5px] text-text-primary">ALCOVE</div>
      <div className="flex items-center gap-1.5">
        <span className="text-meta text-text-secondary">v {pkg.version}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent-action" />
      </div>
    </div>
  )
}

function CapsuleBanner({ state }: { state: CapsuleState }) {
  const stateColor =
    state === "sealed" ? "text-accent-sealed" : state === "preparing" ? "text-accent-action" : "text-state-inactive"
  const borderColorVar = state === "sealed" ? "var(--accent-sealed)" : "var(--border-default)"

  return (
    <Link
      href="/capsule"
      className="pressable mx-5 mb-4 flex items-center justify-between gap-3 rounded-block p-4"
      style={{
        borderWidth: 1,
        borderStyle: state === "empty" ? "dashed" : "solid",
        borderColor: borderColorVar,
      }}
    >
      <div className="flex items-center gap-3">
        <span className={stateColor}>
          <CapsuleDiamondIcon state={state} size={20} />
        </span>
        <div>
          <div className="text-block-title text-text-primary">CAPSULE</div>
          <div className="mt-0.5 text-xs text-text-secondary">ce qui me définit</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {state === "sealed" ? (
          <>
            <div className="text-right leading-tight">
              <div className="text-[10px] font-mono tracking-wide text-accent-sealed">SCELLÉE DEPUIS</div>
              <div className="mt-0.5 font-mono text-[15px] font-semibold text-accent-sealed">214 J</div>
            </div>
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-accent-sealed text-surface-canvas">
              <LockIcon size={12} />
            </span>
          </>
        ) : (
          <span className="text-label text-accent-action">
            {state === "empty" ? "COMPOSER" : "EN PRÉPARATION"}
          </span>
        )}
        <span className={state === "sealed" ? "text-accent-sealed" : "text-accent-action"}>
          <ChevronIcon size={14} />
        </span>
      </div>
    </Link>
  )
}

function BlockHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center text-text-primary">{icon}</span>
        <div>
          <div className="text-block-title text-text-primary">{title}</div>
          <div className="mt-0.5 text-xs text-text-secondary">{subtitle}</div>
        </div>
      </div>
      {action}
    </div>
  )
}

function ActionLink({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} className="pressable flex items-center gap-2 text-accent-action">
      <span className="text-label whitespace-nowrap">{label}</span>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-action">
        {children}
      </span>
    </button>
  )
}

function FluxBlock({
  stream,
  refHeight,
  onOpenAdd,
  onExplore,
}: {
  stream: CollectionPartition["stream"]
  refHeight: number
  onOpenAdd: () => void
  onExplore: () => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [availableWidth, setAvailableWidth] = useState<number | null>(null)
  const items = stream.slice(0, 3)

  useLayoutEffect(() => {
    if (rowRef.current) setAvailableWidth(rowRef.current.clientWidth)
  })

  const height =
    availableWidth != null ? fittingFluxHeight(items.map((i) => i.type), refHeight, availableWidth) : refHeight

  return (
    <div className="mx-5 mb-4 rounded-block border border-border-default p-4">
      <BlockHeader
        icon={<WaveIcon size={20} />}
        title="FLUX"
        subtitle="ce que j'expose"
        action={
          <ActionLink label="EXPLORER" onClick={onExplore}>
            <CompassIcon size={12} />
          </ActionLink>
        }
      />

      {stream.length === 0 ? (
        <div>
          <p className="text-body-m text-text-primary">Exposez votre première œuvre</p>
          <button
            type="button"
            onClick={onOpenAdd}
            className="pressable mt-2 flex items-center gap-1.5 text-accent-action"
          >
            <span className="text-label">AJOUTER</span>
            <ChevronIcon size={12} />
          </button>
        </div>
      ) : (
        <div className="flex items-end gap-3">
          <div className="w-16 shrink-0">
            <div className="text-display leading-none text-text-primary">
              {String(stream.length).padStart(2, "0")}
            </div>
            <div className="mt-1.5 text-xs leading-snug text-text-secondary">objets exposés</div>
          </div>
          <div ref={rowRef} className="flex min-w-0 flex-1 items-end justify-end gap-2 overflow-hidden">
            {items.map((item) => (
              <Vignette
                key={`${item.type}:${item.id}`}
                type={item.type}
                title={item.title}
                imageUrl={item.imageUrl}
                height={height}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const LINA = {
  name: "Lina",
  location: "JP",
  avatar: "/avatars/lina.jpg",
  utc: "18:41",
  totalWorks: 2,
  works: [RESONANCE_WORKS.invasionLosAngeles, RESONANCE_WORKS.funHouse],
}

const MATEO = {
  name: "Mateo",
  location: "AR",
  avatar: "/avatars/mateo.jpg",
  utc: "06:41",
  totalWorks: 4,
  works: [RESONANCE_WORKS.dansLeTrain, RESONANCE_WORKS.dune1984],
}

function ResonancesBlock({ height, onInert }: { height: number; onInert: () => void }) {
  return (
    <div className="mx-5 mb-4 rounded-block border border-border-default p-4">
      <BlockHeader
        icon={<ResonanceIcon size={20} />}
        title="RÉSONANCES"
        subtitle="des œuvres en commun"
        action={
          <ActionLink label="VOIR TOUTES" onClick={onInert}>
            <PlusIcon size={12} strokeWidth={1.5} />
          </ActionLink>
        }
      />

      <div className="flex">
        <ResonancePerson person={LINA} className="min-w-0 flex-1 pr-3.5" height={height} onInert={onInert} />
        <div className="w-px shrink-0 self-stretch bg-border-default" />
        <ResonancePerson person={MATEO} className="min-w-0 flex-1 pl-3.5" height={height} onInert={onInert} />
      </div>
    </div>
  )
}

function ResonancePerson({
  person,
  className,
  height,
  onInert,
}: {
  person: typeof LINA | typeof MATEO
  className: string
  height: number
  onInert: () => void
}) {
  return (
    <button
      type="button"
      onClick={onInert}
      className={`pressable w-full cursor-pointer rounded-block text-left hover:bg-[var(--hover-tint)] ${className}`}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="relative shrink-0">
          <Avatar src={person.avatar} size={52} />
          <span className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface-panel bg-accent-action font-mono text-[11px] font-semibold text-surface-panel">
            {person.totalWorks}
          </span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-body-l font-semibold text-text-primary">{person.name}</div>
          <div className="truncate text-[11px] text-text-secondary">{person.location}</div>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="h-1 w-1 shrink-0 rounded-full bg-state-inactive" />
            <span className="text-meta text-text-secondary">{person.utc}</span>
          </div>
        </div>
      </div>

      <p className="mb-2.5 text-xs text-text-secondary">{person.totalWorks} œuvres en commun</p>

      <div className="flex items-end gap-1.5">
        {person.works.map((work) => (
          <Vignette key={work.id} type={work.type} title={work.title} imageUrl={work.imageUrl} height={height} />
        ))}
        {person.totalWorks > person.works.length && (
          <div className="flex flex-1 items-center justify-center self-stretch">
            <ChevronIcon size={15} className="text-accent-action" />
          </div>
        )}
      </div>
    </button>
  )
}

function CorrespondancesBlock({ height, onInert }: { height: number; onInert: () => void }) {
  const latest = CORRESPONDENCES[0]

  return (
    <div className="mx-5 mb-4 rounded-block border border-border-default p-4">
      <BlockHeader
        icon={<EnvelopeIcon size={20} />}
        title="CORRESPONDANCES"
        subtitle="lettres en cours"
        action={
          <button type="button" onClick={onInert} className="pressable flex items-center gap-2 text-accent-action">
            <span className="text-label">VOIR TOUTES</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-action font-mono text-[11px] font-semibold text-surface-panel">
              2
            </span>
          </button>
        }
      />

      <button
        type="button"
        onClick={onInert}
        className="pressable flex w-full cursor-pointer items-center gap-3 rounded-block text-left hover:bg-[var(--hover-tint)]"
      >
        <Avatar src={latest.avatar} size={48} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-body-l font-semibold text-text-primary">{latest.name}</div>
          <div className="truncate text-xs text-text-secondary">{latest.location}</div>
          <div className="mt-0.5 font-mono text-[10.5px] text-text-secondary">il y a {latest.daysAgo} jours</div>
        </div>
        <Vignette type={latest.work.type} title={latest.work.title} imageUrl={latest.work.imageUrl} height={height} />
      </button>
    </div>
  )
}
