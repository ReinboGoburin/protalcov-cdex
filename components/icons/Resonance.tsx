export default function ResonanceIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M7 6 A9 9 0 0 0 7 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17 6 A9 9 0 0 1 17 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
