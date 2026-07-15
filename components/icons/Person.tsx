export default function PersonIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 19" fill="none" className={className}>
      <circle cx="9" cy="5.5" r="3.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 18c1.2-4 4.2-5.5 7-5.5s5.8 1.5 7 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
