"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import PhoneFrame from "@/components/PhoneFrame"
import { DEFAULT_DEV_CONFIG, loadDevConfig, type DevConfig } from "@/lib/devConfig"
import { CapsuleDiamondIcon, ChevronIcon } from "@/components/icons"

export default function CapsulePlaceholderPage() {
  const [devConfig, setDevConfig] = useState<DevConfig>(DEFAULT_DEV_CONFIG)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read from localStorage
    setDevConfig(loadDevConfig())
  }, [])

  return (
    <div style={{ "--accent-sealed": devConfig.accentSealed } as React.CSSProperties}>
      <PhoneFrame frame={devConfig.frame}>
        <div className="flex h-full flex-col px-5 pt-6">
          <Link
            href="/"
            className="pressable flex h-8 w-8 items-center justify-center rotate-180 text-text-secondary hover:text-text-primary"
            aria-label="Retour"
          >
            <ChevronIcon size={16} />
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="text-accent-sealed">
              <CapsuleDiamondIcon state="sealed" size={32} />
            </span>
            <p className="text-title-m text-text-primary">La capsule arrive bientôt</p>
            <p className="max-w-[240px] text-body-m text-text-secondary">
              Cette vue est encore en préparation. Reviens plus tard pour la découvrir.
            </p>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}
