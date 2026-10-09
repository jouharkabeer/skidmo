import { Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { CONTACT } from '@/constants'

export function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <a
        href={CONTACT.phoneHref}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-md transition-transform hover:scale-105"
        aria-label="Call SKIDMO"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={CONTACT.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-premium transition-transform hover:scale-105 hover:shadow-lg"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
    </div>
  )
}
