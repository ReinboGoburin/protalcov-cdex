export default function EnvelopeIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={(size * 15) / 20} viewBox="0 0 20 15" fill="none" className={className}>
      <rect x="1" y="1" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 2l9 7 9-7" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  )
}
