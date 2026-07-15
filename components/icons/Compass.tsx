export default function CompassIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <circle cx="6" cy="6" r="4.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4L6.8 6.8L4 8L5.2 5.2L8 4Z" fill="currentColor" />
    </svg>
  )
}
