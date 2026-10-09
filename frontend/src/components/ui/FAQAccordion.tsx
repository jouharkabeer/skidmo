import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

interface AccordionItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  dark?: boolean
}

function AccordionItem({ question, answer, isOpen, onToggle, dark }: AccordionItemProps) {
  return (
    <div className={cn('border-b', dark ? 'border-white/10' : 'border-border')}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 py-5 text-left transition-colors',
          dark ? 'text-white hover:text-accent' : 'text-ink hover:text-brand'
        )}
        aria-expanded={isOpen}
      >
        <span className="font-display text-lg sm:text-xl">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180',
            dark ? 'text-accent' : 'text-brand'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className={cn('body-md pb-5', dark ? 'text-white/65' : 'text-text-secondary')}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface FAQAccordionProps {
  items: { _id: string; question: string; answer: string }[]
  dark?: boolean
  defaultOpen?: number
}

export function FAQAccordion({ items, dark, defaultOpen = 0 }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem
          key={item._id}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          dark={dark}
        />
      ))}
    </div>
  )
}
