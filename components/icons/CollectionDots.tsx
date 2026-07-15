export default function CollectionDotsIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 19 19" fill="none" className={className}>
      <circle cx="9.5" cy="9.5" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="12" cy="6.8" r="1.3" fill="currentColor" />
      <circle cx="7.5" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12.5" cy="11.8" r="1.3" fill="currentColor" />
    </svg>
  )
}
