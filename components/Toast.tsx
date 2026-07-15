"use client"

import { useEffect, useState } from "react"

interface ToastProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  onExpire: () => void
  durationMs?: number
}

/** Generic bottom toast — with an action it counts down ("Annuler (Ns)"), without one it's a plain info message ("à venir…"). */
export default function Toast({ message, actionLabel, onAction, onExpire, durationMs }: ToastProps) {
  const duration = durationMs ?? (onAction ? 5000 : 2000)
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(duration / 1000))

  useEffect(() => {
    const timeout = setTimeout(onExpire, duration)
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-block bg-text-primary px-4 py-3 text-surface-panel shadow-lg">
      <span className="text-body-m">{message}</span>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="pressable text-ui-label underline underline-offset-2 hover:opacity-80"
        >
          {actionLabel ?? "Annuler"} ({secondsLeft}s)
        </button>
      )}
    </div>
  )
}
