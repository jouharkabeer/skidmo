import { useState } from 'react'
import { X, Cookie } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks'
import { Button } from '@/components/ui/Button'

export function CookieConsent() {
  const [consent, setConsent] = useLocalStorage<'accepted' | 'declined' | null>(
    'skidmo-cookie-consent',
    null
  )
  const [visible, setVisible] = useState(consent === null)

  const accept = () => {
    setConsent('accepted')
    setVisible(false)
  }

  const decline = () => {
    setConsent('declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="border border-border bg-white/95 p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">We value your privacy</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  We use cookies to enhance your experience and analyze site traffic.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={accept}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={decline}>Decline</Button>
                </div>
              </div>
              <button type="button" onClick={decline} className="text-text-muted hover:text-ink" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
