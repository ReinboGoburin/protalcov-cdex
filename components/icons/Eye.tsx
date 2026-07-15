export default function EyeIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={(size * 12) / 18} viewBox="0 0 18 12" fill="none" className={className}>
      <path
        d="M1 6c2-4 5.5-5 8-5s6 1 8 5c-2 4-5.5 5-8 5s-6-1-8-5z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="9" cy="6" r="2.3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
