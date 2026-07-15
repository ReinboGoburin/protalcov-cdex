"use client"

import { useState } from "react"

interface MediaImageProps {
  src: string | null
  alt: string
  title?: string
  subtitle?: string
  titleSize?: number
  subtitleSize?: number
  className?: string
  fit?: "cover" | "contain"
}

export default function MediaImage({
  src,
  alt,
  title,
  subtitle,
  titleSize,
  subtitleSize,
  className = "",
  fit = "cover",
}: MediaImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-0.5 border border-border-default bg-surface-panel p-2 text-center ${className}`}
      >
        <span
          className="line-clamp-3 leading-snug font-semibold text-text-primary"
          style={{ fontSize: titleSize ?? 12 }}
        >
          {title ?? alt}
        </span>
        {subtitle && (
          <span
            className="line-clamp-2 leading-snug text-text-secondary"
            style={{ fontSize: subtitleSize ?? 10 }}
          >
            {subtitle}
          </span>
        )}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={`select-none ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
