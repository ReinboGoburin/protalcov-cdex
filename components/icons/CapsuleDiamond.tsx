export type CapsuleState = "empty" | "preparing" | "sealed"

/**
 * Diamond capsule glyph, one pictogram with 3 fill variants (contour /
 * demi-plein / plein) rather than 3 separate icons — color follows the
 * caller (state-inactive / accent-action / accent-sealed per the state
 * table), this component only decides how much of the diamond is filled.
 */
export default function CapsuleDiamondIcon({
  state,
  size = 24,
  className = "",
}: {
  state: CapsuleState
  size?: number
  className?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <path d="M10 2 L18 10 L10 18 L2 10 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {(state === "preparing" || state === "sealed") && (
        <path d="M10 10 L10 2 L18 10 Z" fill="currentColor" />
      )}
      {state === "sealed" && <path d="M10 10 L10 18 L2 10 Z" fill="currentColor" />}
    </svg>
  )
}
