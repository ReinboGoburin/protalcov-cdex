interface ErrorNoticeProps {
  title: string
  message: string
}

/** Unified error treatment (brief §5) — border/title in --state-error, recovery text neutral, always says what to do next. */
export default function ErrorNotice({ title, message }: ErrorNoticeProps) {
  return (
    <div className="flex items-start gap-3 rounded-block border border-state-error px-4 py-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-state-error text-xs font-semibold text-state-error">
        !
      </span>
      <div>
        <p className="text-ui-label text-state-error">{title}</p>
        <p className="mt-1 text-meta text-text-secondary">{message}</p>
      </div>
    </div>
  )
}
