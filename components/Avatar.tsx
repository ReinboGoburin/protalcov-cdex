"use client"

import { useState } from "react"

interface AvatarProps {
  src: string | null
  size: number
  className?: string
}

/** Circular portrait — desaturated so it never competes with artwork colors. Falls back to a neutral circle if the image is missing or fails to load. */
export default function Avatar({ src, size, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`shrink-0 rounded-full bg-state-inactive/40 ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size, filter: "saturate(0.85)" }}
    />
  )
}
