import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScroll, useLockBody } from '@/hooks'
import { NAV_LINKS, CONTACT } from '@/constants'
import { SERVICES_DATA } from '@/constants/services'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn, scrollToTop } from '@/utils'

export function Navbar() {
  const { scrolled } = useScroll(40)
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const isHome = location.pathname === '/'
  const onHero = isHome && !scrolled && !mobileOpen

  useLockBody(mobileOpen)

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [location.pathname])

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
    }
    scrollToTop()
    setMobileOpen(false)
  }

  const handleNavClick = (path: string) => (e: React.MouseEvent) => {
    if (path === '/') goHome(e)
  }

  const linkClass = (active: boolean) =>
    cn(
      'relative px-3 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors',
      onHero
        ? active ? 'text-accent' : 'text-white/75 hover:text-white'
        : active ? 'text-brand' : 'text-ink/70 hover:text-ink'
    )

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 transition-all duration-500',
        mobileOpen ? 'z-[120]' : 'z-50',
        onHero ? 'nav-hero' : 'nav-glass shadow-xs'
      )}
    >
      <nav className="container-premium flex h-[4.5rem] items-center justify-between" aria-label="Main navigation">
        <Logo variant="letter" className="relative z-10" />

        <div className="hidden items-center lg:flex">
          {NAV_LINKS.map((link) =>
            'hasMegaMenu' in link && link.hasMegaMenu ? (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  to={link.path}
                  className={cn(linkClass(location.pathname.startsWith('/services')), 'flex items-center gap-1')}
                >
                  {link.label}
                  <ChevronDown className={cn('h-3 w-3 transition-transform', megaOpen && 'rotate-180')} />
                </Link>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-4"
                    >
                      <div className="border border-border bg-white p-4 shadow-lg">
                        <div className="grid grid-cols-2 gap-1">
                          {SERVICES_DATA.map((service) => (
                            <Link
                              key={service.slug}
                              to={`/services#${service.slug}`}
                              className="group flex items-center gap-3 p-2.5 transition-colors hover:bg-stone"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="h-11 w-11 shrink-0 overflow-hidden">
                                <img src={service.image} alt="" className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-ink group-hover:text-brand">{service.title}</p>
                                <p className="text-[11px] text-text-muted">{service.shortTitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(location.pathname === link.path)}
                onClick={handleNavClick(link.path)}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href={CONTACT.phoneHref}
            className={cn(
              'flex items-center gap-2 text-sm transition-colors',
              onHero ? 'text-white/60 hover:text-white' : 'text-text-muted hover:text-ink'
            )}
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{CONTACT.phone}</span>
          </a>
          <Button to="/contact" size="sm" variant={onHero ? 'white' : 'primary'}>
            Book Now
          </Button>
        </div>

        <button
          type="button"
          className={cn('relative z-[110] p-2 lg:hidden', onHero ? 'text-white' : 'text-ink')}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed inset-0 z-[100] bg-canvas lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
              >
                <div className="flex h-full flex-col overflow-y-auto px-8 pb-10 pt-6">
                  <div className="mb-8 flex items-center justify-between">
                    <Logo variant="letter" link={false} />
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center border border-border text-ink"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="border-b border-border py-5 font-display text-2xl text-text-primary"
                      onClick={(e) => {
                        if (link.path === '/') goHome(e)
                        else setMobileOpen(false)
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href={CONTACT.phoneHref}
                    className="mt-6 flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT.phone}
                  </a>
                  <Button to="/contact" className="mt-8 w-full" variant="primary" onClick={() => setMobileOpen(false)}>
                    Book Now
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  )
}
