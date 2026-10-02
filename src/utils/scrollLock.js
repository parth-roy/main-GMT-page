/**
 * Centralized, bulletproof scroll lock utility for mobile and desktop modals.
 * Tracks nested modal depth, prevents mobile touch-scroll chaining,
 * and seamlessly restores scroll position on close without jumping.
 */

let lockCount = 0
let savedScrollY = 0

export function lockScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") return

  lockCount++
  if (lockCount === 1) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0

    // Lock html and body
    document.documentElement.style.overflow = "hidden"
    document.documentElement.setAttribute("data-modal-open", "true")

    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.width = "100%"
    document.body.setAttribute("data-modal-open", "true")

    window.dispatchEvent(new CustomEvent("modal-open"))
  }
}

export function unlockScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") return

  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    const rawTop = document.body.style.top
    const restoreY = Math.abs(parseInt(rawTop || "0", 10)) || savedScrollY

    document.documentElement.style.overflow = ""
    document.documentElement.removeAttribute("data-modal-open")

    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.left = ""
    document.body.style.right = ""
    document.body.style.width = ""
    document.body.removeAttribute("data-modal-open")

    window.scrollTo(0, restoreY)
    window.dispatchEvent(new CustomEvent("modal-close"))
  }
}
