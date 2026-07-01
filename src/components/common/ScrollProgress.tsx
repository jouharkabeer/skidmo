import { useState, useEffect } from 'react'
import { useScroll } from '@/hooks'

export function ScrollProgress() {
  const { scrollY } = useScroll(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    setProgress(docHeight > 0 ? scrollY / docHeight : 0)
  }, [scrollY])

  return (
    <div
      className="fixed left-0 top-0 z-[60] h-px origin-left bg-brand transition-transform duration-150"
      style={{ transform: `scaleX(${progress})`, width: '100%' }}
      aria-hidden="true"
    />
  )
}
