"use client"

import { useState } from "react"
import { DEFAULT_DEV_CONFIG, type DevConfig } from "@/lib/devConfig"
import type { CapsuleState } from "@/components/icons"

interface DevPanelProps {
  config: DevConfig
  onChange: (config: DevConfig) => void
}

const CAPSULE_STATES: { key: CapsuleState; label: string }[] = [
  { key: "empty", label: "Vide" },
  { key: "preparing", label: "Préparation" },
  { key: "sealed", label: "Scellée" },
]

// Always rendered (also in production — the calibrage happens on the deployed
// proto itself), collapsed by default. Scope strictly limited to what the
// brief allows: --accent-sealed, l'état capsule, streamCap, et le chrome de
// prévisualisation (PhoneFrame) — rien d'autre.
export default function DevPanel({ config: rawConfig, onChange }: DevPanelProps) {
  const [open, setOpen] = useState(false)

  // Defensively heals a partial/stale config (e.g. a value saved by an older
  // build, or a dev hot-reload that kept a component mounted across a schema
  // change) so a missing field never renders as "undefinedpx" or flips an
  // input from uncontrolled to controlled.
  const config: DevConfig = {
    ...rawConfig,
    vignetteHeights: { ...DEFAULT_DEV_CONFIG.vignetteHeights, ...rawConfig.vignetteHeights },
    typography: { ...DEFAULT_DEV_CONFIG.typography, ...rawConfig.typography },
    frame: { ...DEFAULT_DEV_CONFIG.frame, ...rawConfig.frame },
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir les réglages"
        className="pressable fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-ui-label text-surface-panel shadow-lg hover:opacity-90"
      >
        ⚙ Réglages
      </button>
    )
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col overflow-y-auto border-l border-border-default bg-surface-panel shadow-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-border-default px-4 py-3">
        <span className="text-ui-label text-text-primary">Réglages (dev)</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_DEV_CONFIG)}
            className="text-meta text-text-secondary underline hover:text-text-primary"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer les réglages"
            className="text-text-secondary hover:text-text-primary"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4">
        <Field label="--accent-sealed">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.accentSealed}
              onChange={(e) => onChange({ ...config, accentSealed: e.target.value })}
              className="h-8 w-10 shrink-0 cursor-pointer rounded border border-border-default"
            />
            <input
              type="text"
              value={config.accentSealed}
              onChange={(e) => onChange({ ...config, accentSealed: e.target.value })}
              className="w-full rounded border border-border-default px-2 py-1 text-meta"
            />
          </div>
        </Field>

        <Field label="État de la capsule">
          <div className="flex gap-2">
            {CAPSULE_STATES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ ...config, capsuleState: key })}
                className={`pressable rounded-block border px-3 py-1.5 text-meta ${
                  config.capsuleState === key
                    ? "border-text-primary bg-text-primary text-surface-panel"
                    : "border-border-default text-text-secondary hover:border-text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="streamCap">
          <input
            type="number"
            min={0}
            value={config.streamCap}
            onChange={(e) => onChange({ ...config, streamCap: Number(e.target.value) || 0 })}
            className="w-full rounded border border-border-default px-2 py-1 text-meta"
          />
        </Field>

        <div className="border-t border-border-default pt-4">
          <p className="mb-3 text-ui-label text-text-secondary">Vignettes</p>

          <div className="flex flex-col gap-4">
            <Field label={`Aperçu du flux (${config.vignetteHeights.flux}px)`}>
              <input
                type="range"
                min={90}
                max={160}
                value={config.vignetteHeights.flux}
                onChange={(e) =>
                  onChange({
                    ...config,
                    vignetteHeights: { ...config.vignetteHeights, flux: Number(e.target.value) },
                  })
                }
                className="w-full"
              />
            </Field>

            <Field label={`Œuvres des résonances (${config.vignetteHeights.resonance}px)`}>
              <input
                type="range"
                min={48}
                max={90}
                value={config.vignetteHeights.resonance}
                onChange={(e) =>
                  onChange({
                    ...config,
                    vignetteHeights: { ...config.vignetteHeights, resonance: Number(e.target.value) },
                  })
                }
                className="w-full"
              />
            </Field>

            <Field label={`Vignette de correspondance (${config.vignetteHeights.correspondence}px)`}>
              <input
                type="range"
                min={56}
                max={96}
                value={config.vignetteHeights.correspondence}
                onChange={(e) =>
                  onChange({
                    ...config,
                    vignetteHeights: { ...config.vignetteHeights, correspondence: Number(e.target.value) },
                  })
                }
                className="w-full"
              />
            </Field>
          </div>
        </div>

        <div className="border-t border-border-default pt-4">
          <p className="mb-3 text-ui-label text-text-secondary">Typographie</p>

          <div className="flex flex-col gap-4">
            <Field label={`Labels d'action (${config.typography.labelSize}px)`}>
              <input
                type="range"
                min={10}
                max={14}
                value={config.typography.labelSize}
                onChange={(e) =>
                  onChange({ ...config, typography: { ...config.typography, labelSize: Number(e.target.value) } })
                }
                className="w-full"
              />
            </Field>

            <Field label={`Compteur du flux (${config.typography.displaySize}px)`}>
              <input
                type="range"
                min={24}
                max={40}
                value={config.typography.displaySize}
                onChange={(e) =>
                  onChange({ ...config, typography: { ...config.typography, displaySize: Number(e.target.value) } })
                }
                className="w-full"
              />
            </Field>

            <Field label={`Titres de bloc (${config.typography.blockTitleSize}px)`}>
              <input
                type="range"
                min={14}
                max={20}
                value={config.typography.blockTitleSize}
                onChange={(e) =>
                  onChange({
                    ...config,
                    typography: { ...config.typography, blockTitleSize: Number(e.target.value) },
                  })
                }
                className="w-full"
              />
            </Field>

            <Field label={`Libellés d'interface (${config.typography.uiLabelSize}px)`}>
              <input
                type="range"
                min={12}
                max={17}
                value={config.typography.uiLabelSize}
                onChange={(e) =>
                  onChange({
                    ...config,
                    typography: { ...config.typography, uiLabelSize: Number(e.target.value) },
                  })
                }
                className="w-full"
              />
            </Field>
          </div>
        </div>

        <div className="border-t border-border-default pt-4">
          <p className="mb-3 text-ui-label text-text-secondary">Chrome de prévisualisation</p>

          <div className="flex flex-col gap-4">
            <Field label="Bordure — épaisseur (px)">
              <input
                type="number"
                min={0}
                max={8}
                value={config.frame.borderWidth}
                onChange={(e) =>
                  onChange({ ...config, frame: { ...config.frame, borderWidth: Number(e.target.value) || 0 } })
                }
                className="w-full rounded border border-border-default px-2 py-1 text-meta"
              />
            </Field>

            <Field label="Bordure — couleur">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.frame.borderColor}
                  onChange={(e) =>
                    onChange({ ...config, frame: { ...config.frame, borderColor: e.target.value } })
                  }
                  className="h-8 w-10 shrink-0 cursor-pointer rounded border border-border-default"
                />
                <input
                  type="text"
                  value={config.frame.borderColor}
                  onChange={(e) =>
                    onChange({ ...config, frame: { ...config.frame, borderColor: e.target.value } })
                  }
                  className="w-full rounded border border-border-default px-2 py-1 text-meta"
                />
              </div>
            </Field>

            <Field label={`Ombre — flou (${config.frame.shadowBlur}px)`}>
              <input
                type="range"
                min={0}
                max={120}
                value={config.frame.shadowBlur}
                onChange={(e) =>
                  onChange({ ...config, frame: { ...config.frame, shadowBlur: Number(e.target.value) } })
                }
                className="w-full"
              />
            </Field>

            <Field label={`Ombre — intensité (${config.frame.shadowOpacity.toFixed(2)})`}>
              <input
                type="range"
                min={0}
                max={0.4}
                step={0.01}
                value={config.frame.shadowOpacity}
                onChange={(e) =>
                  onChange({ ...config, frame: { ...config.frame, shadowOpacity: Number(e.target.value) } })
                }
                className="w-full"
              />
            </Field>

            <Field label="Fond de page">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.frame.pageBackground}
                  onChange={(e) =>
                    onChange({ ...config, frame: { ...config.frame, pageBackground: e.target.value } })
                  }
                  className="h-8 w-10 shrink-0 cursor-pointer rounded border border-border-default"
                />
                <input
                  type="text"
                  value={config.frame.pageBackground}
                  onChange={(e) =>
                    onChange({ ...config, frame: { ...config.frame, pageBackground: e.target.value } })
                  }
                  className="w-full rounded border border-border-default px-2 py-1 text-meta"
                />
              </div>
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-meta text-text-secondary">{label}</span>
      {children}
    </label>
  )
}
