import { useEffect, useRef } from "react"

const CAPTURE_THRESHOLD_PX = 5

/**
 * Click-and-drag-to-scroll for a vertical scroll container (mouse/pen only —
 * native touch scrolling is left untouched). Below the capture threshold a
 * press is still treated as a plain click, so buttons/links under the
 * pointer keep working; past it, the container pans and the cursor switches
 * to "grabbing".
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let dragging = false
    let captured = false
    let startY = 0
    let startScrollTop = 0

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch") return
      dragging = true
      captured = false
      startY = e.clientY
      startScrollTop = el!.scrollTop
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return
      const deltaY = e.clientY - startY

      if (!captured) {
        if (Math.abs(deltaY) < CAPTURE_THRESHOLD_PX) return
        captured = true
        el!.setPointerCapture(e.pointerId)
        el!.style.cursor = "grabbing"
      }

      e.preventDefault()
      el!.scrollTop = startScrollTop - deltaY
    }

    function endDrag(e: PointerEvent) {
      if (captured) {
        el!.releasePointerCapture(e.pointerId)
        el!.style.cursor = ""
      }
      dragging = false
      captured = false
    }

    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", endDrag)
    el.addEventListener("pointercancel", endDrag)

    return () => {
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", endDrag)
      el.removeEventListener("pointercancel", endDrag)
    }
  }, [])

  return ref
}
