export default function HomeIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 19" fill="none" className={className}>
      <path
        d="M2 9l8-7 8 7v9a1 1 0 01-1 1h-4v-6H7v6H3a1 1 0 01-1-1V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
