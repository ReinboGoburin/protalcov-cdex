export default function GearIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 19 19" fill="none" className={className}>
      <circle cx="9.5" cy="9.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="8.7"
          y="0.6"
          width="1.6"
          height="2.6"
          rx="0.5"
          fill="currentColor"
          transform={angle ? `rotate(${angle} 9.5 9.5)` : undefined}
        />
      ))}
    </svg>
  )
}
