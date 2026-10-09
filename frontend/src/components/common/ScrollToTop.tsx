import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToHash(hash: string) {
  const id = hash.replace('#', '')
  if (!id) return false

  const el = document.getElementById(id)
  if (!el) return false

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

/** Reset scroll on route change; honor in-page hash targets (e.g. contact form). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      if (scrollToHash(hash)) return

      const timer = window.setTimeout(() => {
        if (!scrollToHash(hash)) {
          window.scrollTo({ top: 0, left: 0 })
        }
      }, 150)

      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}
