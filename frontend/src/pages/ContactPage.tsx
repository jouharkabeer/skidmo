import { useState} from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import type { ContactFormData, ContactFormErrors } from '@/types'
import { PageSEO, getDefaultStructuredData } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn } from '@/components/ui/FadeIn'
import { Button } from '@/components/ui/Button'
import { MapLinkCard } from '@/components/common/MapLinkCard'
// import { submitContactForm } from '@/services/contactService'
import { CONTACT, CONTACT_FORM_ID, WORKING_HOURS } from '@/constants'
import { MEDIA } from '@/constants/media'
import { SERVICES_DATA } from '@/constants/services'
import { cn } from '@/utils'

// function validateForm(data: ContactFormData): ContactFormErrors {
//   const errors: ContactFormErrors = {}
//   if (!data.name.trim()) errors.name = 'Name is required'
//   if (!data.email.trim()) {
//     errors.email = 'Email is required'
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//     errors.email = 'Please enter a valid email'
//   }
//   if (!data.phone.trim()) errors.phone = 'Phone number is required'
//   if (!data.service) errors.service = 'Please select a service'
//   if (!data.message.trim()) errors.message = 'Message is required'
//   return errors
// }

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitted] = useState(false)
  const [loading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault()
  //   setSubmitError('')
  //   const validationErrors = validateForm(form)
  //   setErrors(validationErrors)
  //   if (Object.keys(validationErrors).length > 0) return

  //   setLoading(true)
  //   try {
  //     await submitContactForm(form)
  //     setSubmitted(true)
  //   } catch (err) {
  //     setSubmitError(err instanceof Error ? err.message : 'Failed to send message.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }


  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.service ||
      !form.message.trim()
    ) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    const whatsappNumber = CONTACT.whatsapp.replace('+', ''); // Replace with your WhatsApp number

    const message = `New Contact Form Submission

  Name: ${form.name}
  Email: ${form.email}
  Phone: ${form.phone}
  Service: ${form.service}

  Message:
  ${form.message}`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };





  return (
    <>
      <PageSEO
        page={PAGE_SEO['/contact']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact' },
        ]}
        structuredData={getDefaultStructuredData()}
      />

      <section className="relative flex min-h-[40vh] items-end overflow-hidden pb-12 pt-32">
        <img src={MEDIA.contactHero} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
        <div className="hero-gradient absolute inset-0" />
        <div className="container-premium relative">
          <FadeIn>
            <span className="label-sm text-accent">Contact</span>
            <h1 className="heading-xl mt-3 text-white">Get in Touch</h1>
            <p className="body-lg mt-4 max-w-xl text-white/80">
              Ready to protect your vehicle? We&apos;d love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id={CONTACT_FORM_ID} className="section-padding scroll-mt-28 bg-canvas">
        <div className="container-premium">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Info */}
            <FadeIn className="lg:col-span-2">
              <SectionHeader
                label="Contact Info"
                title="Visit Our Studio"
                align="left"
              />
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-stone text-brand">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Address</p>
                    <p className="mt-1 text-sm text-ink/70">{CONTACT.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-stone text-brand">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Phone</p>
                    <a href={CONTACT.phoneHref} className="mt-1 block text-sm text-ink/70 hover:text-brand">
                      {CONTACT.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-stone text-brand">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Email</p>
                    <a href={CONTACT.emailHref} className="mt-1 block text-sm text-ink/70 hover:text-brand">
                      {CONTACT.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#25D366]/10 text-[#25D366]">
                    <FaWhatsapp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">WhatsApp</p>
                    <a
                      href={CONTACT.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm text-ink/70 hover:text-[#25D366]"
                    >
                      Chat with us
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-stone text-brand">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Working Hours</p>
                    {WORKING_HOURS.map((wh) => (
                      <p key={wh.day} className="mt-1 text-sm text-ink/70">
                        <span className="font-medium text-ink">{wh.day}:</span> {wh.hours}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>

              {/* Map — compact card, opens Google Maps */}
              <div className="mt-8 max-w-sm">
                <MapLinkCard />
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn className="lg:col-span-3" delay={0.2}>
              <div className="border border-border bg-white p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-brand text-white">
                      <Mail className="h-8 w-8" />
                    </div>
                    <h2 className="heading-md text-ink">Thank You!</h2>
                    <p className="body-md mt-3 text-ink/75">
                      Your message has been received. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleWhatsAppSubmit} noValidate aria-label="Contact form">
                    <h2 className="font-heading text-xl font-semibold text-ink">Send Us a Message</h2>
                    <p className="mt-2 text-sm text-ink/70">
                      Fill out the form below and we&apos;ll respond promptly.
                    </p>

                    {submitError && (
                      <p className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                        {submitError}
                      </p>
                    )}

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-ink">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className={cn('input-field', errors.name && 'input-field--error')}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="mt-1 text-xs text-red-500" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-ink">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className={cn('input-field', errors.email && 'input-field--error')}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500" role="alert">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-ink">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className={cn('input-field', errors.phone && 'input-field--error')}
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500" role="alert">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-ink">
                          Service <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="service"
                          value={form.service}
                          onChange={(e) => updateField('service', e.target.value)}
                          className={cn('input-field', errors.service && 'input-field--error')}
                          aria-invalid={!!errors.service}
                        >
                          <option value="">Select a service</option>
                          {SERVICES_DATA.map((s) => (
                            <option key={s.slug} value={s.title}>{s.title}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                        {errors.service && (
                          <p className="mt-1 text-xs text-red-500" role="alert">{errors.service}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5">
                      <label htmlFor="message" className="block text-sm font-medium text-ink">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        className={cn('input-field resize-none', errors.message && 'input-field--error')}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500" role="alert">{errors.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="mt-6 w-full sm:w-auto" loading={loading}>
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
