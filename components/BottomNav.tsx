"use client"

import Link from "next/link"
import { HomeIcon, CollectionDotsIcon, PersonIcon, GearIcon, PlusIcon } from "@/components/icons"

interface BottomNavProps {
  active: "home" | "collection"
  onAdd: () => void
  onInert: () => void
}

export default function BottomNav({ active, onAdd, onInert }: BottomNavProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 flex shrink-0 items-center justify-around border-t border-border-default bg-surface-panel px-2 pt-2.5 pb-4">
      <NavItem href="/" active={active === "home"} label="ACCUEIL">
        <HomeIcon size={20} />
      </NavItem>
      <NavItem href="/collection" active={active === "collection"} label="COLLECTION">
        <CollectionDotsIcon size={19} />
      </NavItem>

      <button
        type="button"
        onClick={onAdd}
        aria-label="Ajouter un item"
        className="pressable -mt-6 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-accent-action text-surface-panel"
      >
        <PlusIcon size={20} strokeWidth={2.2} />
      </button>

      <NavItem onClick={onInert} label="MOI">
        <PersonIcon size={18} />
      </NavItem>
      <NavItem onClick={onInert} label="PARAMÈTRES">
        <GearIcon size={19} />
      </NavItem>
    </div>
  )
}

function NavItem({
  href,
  onClick,
  active,
  label,
  children,
}: {
  href?: string
  onClick?: () => void
  active?: boolean
  label: string
  children: React.ReactNode
}) {
  const color = active ? "text-text-primary" : "text-text-secondary"
  const content = (
    <div className="pressable flex min-w-[44px] flex-col items-center gap-1.5">
      <div className={`relative flex items-center justify-center ${color}`}>
        {children}
        {active && (
          <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-accent-action" />
        )}
      </div>
      <span className={`text-[9.5px] font-semibold tracking-wide ${color}`}>{label}</span>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return (
    <button type="button" onClick={onClick} aria-label={label}>
      {content}
    </button>
  )
}
