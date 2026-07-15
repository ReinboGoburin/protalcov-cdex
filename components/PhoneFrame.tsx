interface PhoneFrameProps {
  children: React.ReactNode
  frame: { borderWidth: number; borderColor: string; shadowBlur: number; shadowOpacity: number; pageBackground: string }
}

/**
 * Desktop-only device chrome (backdrop + phone bezel) — never consumed by
 * product screens, only by the two shells (AppShell, /capsule). Very rounded
 * corners are fixed; border and shadow are calibrated via the DevPanel.
 *
 * The border is drawn as an outer box-shadow ring rather than a real `border`,
 * so it never eats into the frame's own box — the interior viewport stays a
 * constant 390×844 regardless of the calibrated thickness.
 */
export default function PhoneFrame({ children, frame }: PhoneFrameProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{ backgroundColor: frame.pageBackground }}
    >
      <div
        className="relative flex h-[844px] w-[390px] max-w-full flex-col overflow-hidden rounded-[2.5rem] bg-surface-canvas"
        style={{
          boxShadow: `0 0 0 ${frame.borderWidth}px ${frame.borderColor}, 0 24px ${frame.shadowBlur}px rgba(0,0,0,${frame.shadowOpacity})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
