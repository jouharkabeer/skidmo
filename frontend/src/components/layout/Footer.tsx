import { Link } from 'react-router-dom'
import { Phone, Mail, Clock } from 'lucide-react'
import { FaInstagram, FaXTwitter } from 'react-icons/fa6'
import { CONTACT, WORKING_HOURS, SOCIAL_LINKS, FOOTER_LINKS, PARENT_COMPANY, SITE_CREDITS, SITE_TAGLINE } from '@/constants'
import { SERVICES_DATA } from '@/constants/services'
import { Logo } from '@/components/ui/Logo'
import { MapLinkCard } from '@/components/common/MapLinkCard'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white" role="contentinfo">
      <div className="px-4 py-14 sm:px-6 md:px-8 lg:px-10 lg:py-16 xl:px-12">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_1fr_1fr_1.5fr] lg:gap-x-8 xl:gap-x-12 2xl:gap-x-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
              <Logo variant="letter" imgClassName="h-6" />
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                {SITE_TAGLINE.endsWith('Colmo') ? (
                  <>
                    {SITE_TAGLINE.slice(0, -5)}
                    <a
                      href={PARENT_COMPANY.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent transition-colors hover:text-white"
                    >
                      Colmo
                    </a>
                  </>
                ) : (
                  SITE_TAGLINE
                )}
              </p>
              <div className="mt-4 flex gap-2">
                {[SOCIAL_LINKS.instagram, SOCIAL_LINKS.twitter].map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center border border-white/10 text-white/50 transition-colors hover:border-accent hover:text-accent"
                    aria-label={i === 0 ? 'Instagram' : 'Twitter'}
                  >
                    {i === 0 ? <FaInstagram className="h-3.5 w-3.5" /> : <FaXTwitter className="h-3.5 w-3.5" />}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigate */}
            <div>
              <h3 className="label-sm text-accent">Navigate</h3>
              <ul className="mt-4 space-y-2">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-xs text-white/50 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="label-sm text-accent">Services</h3>
              <ul className="mt-4 space-y-2">
                {SERVICES_DATA.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services#${s.slug}`} className="text-xs text-white/50 transition-colors hover:text-white">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Studio */}
            <div>
              <h3 className="label-sm text-accent">Studio</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-white/50">
                <li className="flex gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                  <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
                </li>
                <li className="flex gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                  <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
                </li>
                <li className="flex gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" />
                  <div className="leading-relaxed">
                    {WORKING_HOURS.map((w) => (
                      <p key={w.day}>{w.day}: {w.hours}</p>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="label-sm mb-3 text-accent">Location</h3>
              <MapLinkCard dark compact className="h-full" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 text-xs text-white/35 lg:grid-cols-3 lg:items-center">
            <div className="space-y-1 lg:text-left">
              <p>© {year} SKIDMO. All rights reserved.</p>
              <p>
                {SITE_TAGLINE.endsWith('Colmo') ? (
                  <>
                    {SITE_TAGLINE.slice(0, -5)}
                    <a
                      href={PARENT_COMPANY.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/55 transition-colors hover:text-accent"
                    >
                      Colmo
                    </a>
                  </>
                ) : (
                  SITE_TAGLINE
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link to="/terms" className="transition-colors hover:text-white">
                Terms &amp; Conditions
              </Link>
              <Link to="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </div>

            <p className="lg:text-right">
              Created &amp; maintained by{' '}
              <a
                href={SITE_CREDITS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-opacity hover:opacity-80"
                style={{ color: SITE_CREDITS.color }}
              >
                {SITE_CREDITS.name}
              </a>
            </p>
          </div>
      </div>
    </footer>
  )
}