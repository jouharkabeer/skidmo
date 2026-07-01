import type { ContactFormData } from '@/types'

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = (await res.json().catch(() => ({}))) as { error?: string }

  if (!res.ok) {
    throw new Error(json.error || 'Failed to send message. Please try again or call us directly.')
  }
}
