import type { MediaType } from "@/lib/types"
import MediaImage from "@/components/MediaImage"

/** Width:height ratio per media type (brief §2.5 — natural ratio, no uniform crop; album is square, so wider than a portrait item at equal height, by design). */
const RATIO: Partial<Record<MediaType, number>> = {
  movie: 2 / 3,
  tv: 2 / 3,
  book: 2 / 3,
  album: 1,
}

const FALLBACK_RATIO = 2 / 3

export function getVignetteRatio(type: MediaType): number {
  return RATIO[type] ?? FALLBACK_RATIO
}

interface VignetteProps {
  type: MediaType
  title: string
  subtitle?: string
  imageUrl: string | null
  /** Every vignette in a row shares this same height — width follows the type's natural ratio. */
  height: number
  shadow?: boolean
  className?: string
}

/**
 * Single cover component used everywhere an artwork shows (home, résonances,
 * Collection, add flow, item detail placeholder). Height is imposed by the
 * row's context, width follows the media's natural ratio, so a mixed row
 * (films + an album, say) stays aligned on height without a uniform crop.
 */
export default function Vignette({
  type,
  title,
  subtitle,
  imageUrl,
  height,
  shadow = true,
  className = "",
}: VignetteProps) {
  const width = Math.round(height * getVignetteRatio(type))
  const titleSize = Math.max(9, Math.min(13, Math.round(width / 5)))
  const subtitleSize = Math.max(8, titleSize - 2)

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-[5px] ${className}`}
      style={{ width, height, boxShadow: shadow ? "var(--shadow-vignette)" : undefined }}
    >
      <MediaImage
        src={imageUrl}
        alt={title}
        title={title}
        subtitle={subtitle}
        titleSize={titleSize}
        subtitleSize={subtitleSize}
        className="h-full w-full"
      />
    </div>
  )
}
