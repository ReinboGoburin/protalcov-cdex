export interface DevConfig {
  /** Live override for the --accent-sealed token. */
  accentSealed: string
  /** Test switch for the capsule bandeau's state on the home screen. */
  capsuleState: "empty" | "preparing" | "sealed"
  /** Cap on how many recent (non-manually-archived) items stay in the flux before overflow silently becomes archives. */
  streamCap: number
  /** Reference vignette height per row-context, in px — width follows the media's natural ratio (see Vignette). */
  vignetteHeights: {
    flux: number
    resonance: number
    correspondence: number
  }
  /** Type-scale calibration — applied as CSS variables on the existing .text-label/.text-display/.text-block-title classes. */
  typography: {
    labelSize: number
    displaySize: number
    blockTitleSize: number
    uiLabelSize: number
  }
  /** Desktop-only device chrome around the phone frame — never consumed by product screens. */
  frame: {
    borderWidth: number
    borderColor: string
    shadowBlur: number
    shadowOpacity: number
    pageBackground: string
  }
}

export const DEFAULT_DEV_CONFIG: DevConfig = {
  accentSealed: "#3E322A",
  capsuleState: "preparing",
  streamCap: 5,
  vignetteHeights: {
    flux: 120,
    resonance: 64,
    correspondence: 64,
  },
  typography: {
    labelSize: 10,
    displaySize: 30,
    blockTitleSize: 14,
    uiLabelSize: 15,
  },
  frame: {
    borderWidth: 5,
    borderColor: "#2B2B2B",
    shadowBlur: 41,
    shadowOpacity: 0.22,
    pageBackground: "#DFD4BF",
  },
}

const STORAGE_KEY = "alcove_dev_config"

export function loadDevConfig(): DevConfig {
  if (typeof window === "undefined") return DEFAULT_DEV_CONFIG
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DEV_CONFIG
    const parsed = JSON.parse(raw) as Partial<DevConfig> | null
    if (!parsed || typeof parsed !== "object") return DEFAULT_DEV_CONFIG

    return {
      accentSealed: parsed.accentSealed ?? DEFAULT_DEV_CONFIG.accentSealed,
      capsuleState: parsed.capsuleState ?? DEFAULT_DEV_CONFIG.capsuleState,
      streamCap: parsed.streamCap ?? DEFAULT_DEV_CONFIG.streamCap,
      vignetteHeights: { ...DEFAULT_DEV_CONFIG.vignetteHeights, ...parsed.vignetteHeights },
      typography: { ...DEFAULT_DEV_CONFIG.typography, ...parsed.typography },
      frame: { ...DEFAULT_DEV_CONFIG.frame, ...parsed.frame },
    }
  } catch {
    return DEFAULT_DEV_CONFIG
  }
}

export function saveDevConfig(config: DevConfig) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
