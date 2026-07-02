import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Images,
  Tag,
  MessageSquareQuote,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { loginAdmin, logoutAdmin, isAdminPasswordConfigured, isAdminAuthenticated } from '@/lib/adminAuth'
import {
  adminGetGallery,
  adminCreateGallery,
  adminDeleteGallery,
  adminGetOffers,
  adminCreateOffer,
  adminDeleteOffer,
  adminGetTestimonials,
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminGetHomeStats,
  adminSaveHomeStats,
} from '@/services/adminService'
import { OFFER_BANNER_SIZES, GALLERY_IMAGE_SIZE } from '@/constants/cms'
import { DEFAULT_STATS } from '@/constants'
import { getImageUrl } from '@/sanity/client'
import type { GalleryImage, Offer, Testimonial, StatItem } from '@/types'
import './Admin.css'

type Tab = 'gallery' | 'offers' | 'testimonials' | 'stats'

const CATEGORIES = ['PPF', 'Ceramic', 'Tint', 'Correction', 'Interior', 'Detailing', 'Studio']
const SOURCES = ['Direct', 'Google', 'Instagram']

const TAB_META: Record<Tab, { label: string; title: string; description: string; icon: typeof Images }> = {
  gallery: { label: 'Gallery', title: 'Gallery', description: 'Upload and manage portfolio images', icon: Images },
  offers: { label: 'Offers', title: 'Offers', description: 'Create promotions with responsive banners', icon: Tag },
  testimonials: { label: 'Testimonials', title: 'Testimonials', description: 'Manage client reviews and quotes', icon: MessageSquareQuote },
  stats: { label: 'Stats', title: 'Homepage Stats', description: 'Edit the numbers shown on the homepage', icon: BarChart3 },
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated())
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('gallery')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Gallery state
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [gTitle, setGTitle] = useState('')
  const [gCategory, setGCategory] = useState('PPF')
  const [gAlt, setGAlt] = useState('')
  const [gDesc, setGDesc] = useState('')
  const gImageRef = useRef<HTMLInputElement>(null)

  // Offer state
  const [offers, setOffers] = useState<Offer[]>([])
  const [oTitle, setOTitle] = useState('')
  const [oDesc, setODesc] = useState('')
  const [oStart, setOStart] = useState('')
  const [oExpiry, setOExpiry] = useState('')
  const [oBtnText, setOBtnText] = useState('Claim Offer')
  const [oBtnLink, setOBtnLink] = useState('/contact#quote-form')
  const [oStatus, setOStatus] = useState('active')
  const webBannerRef = useRef<HTMLInputElement>(null)
  const mobileBannerRef = useRef<HTMLInputElement>(null)

  // Testimonial state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [tName, setTName] = useState('')
  const [tRole, setTRole] = useState('')
  const [tContent, setTContent] = useState('')
  const [tRating, setTRating] = useState(5)
  const [tDate, setTDate] = useState('')
  const [tSource, setTSource] = useState('Direct')
  const tAvatarRef = useRef<HTMLInputElement>(null)

  // Stats state
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS.map((s) => ({ ...s })))

  const switchTab = (next: Tab) => {
    setTab(next)
    setError('')
    setSuccess('')
    setSidebarOpen(false)
  }

  const currentTab = TAB_META[tab]

  const flash = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const loadContent = async () => {
    setLoading(true)
    setError('')
    try {
      const [g, o, t, s] = await Promise.all([
        adminGetGallery(),
        adminGetOffers(),
        adminGetTestimonials(),
        adminGetHomeStats(),
      ])
      setGallery(g)
      setOffers(o)
      setTestimonials(t)
      if (s?.stats?.length) {
        setStats(s.stats.map((item) => ({ ...item })))
      } else {
        setStats(DEFAULT_STATS.map((item) => ({ ...item })))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) loadContent()
  }, [authenticated])

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (!isAdminPasswordConfigured()) {
      setLoginError('Set VITE_ADMIN_PASSWORD in your .env file.')
      return
    }
    if (loginAdmin(password)) {
      setAuthenticated(true)
    } else {
      setLoginError('Incorrect password.')
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    setAuthenticated(false)
    setPassword('')
  }

  // ─── Gallery handlers ─────────────────────────────────────

  const handleGallerySubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const file = gImageRef.current?.files?.[0]
    if (!file) { setError('Please select an image.'); return }

    setUploading(true)
    try {
      await adminCreateGallery({ title: gTitle, category: gCategory, altText: gAlt, description: gDesc, image: file })
      setGTitle(''); setGAlt(''); setGDesc('')
      if (gImageRef.current) gImageRef.current.value = ''
      flash('Gallery image uploaded!')
      await loadContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    setUploading(true)
    try {
      await adminDeleteGallery(id)
      flash('Image deleted.')
      await loadContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setUploading(false)
    }
  }

  // ─── Offer handlers ───────────────────────────────────────

  const handleOfferSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const webFile = webBannerRef.current?.files?.[0]
    const mobileFile = mobileBannerRef.current?.files?.[0]
    if (!webFile || !mobileFile) { setError('Upload both desktop and mobile banners.'); return }

    setUploading(true)
    try {
      await adminCreateOffer({
        title: oTitle, description: oDesc, startDate: oStart, expiryDate: oExpiry,
        buttonText: oBtnText, buttonLink: oBtnLink, status: oStatus, priority: 5,
        bannerWeb: webFile, bannerMobile: mobileFile,
      })
      setOTitle(''); setODesc(''); setOStart(''); setOExpiry('')
      if (webBannerRef.current) webBannerRef.current.value = ''
      if (mobileBannerRef.current) mobileBannerRef.current.value = ''
      flash('Offer created!')
      await loadContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleOfferDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    setUploading(true)
    try {
      await adminDeleteOffer(id)
      flash('Offer deleted.')
      await loadContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setUploading(false)
    }
  }

  // ─── Testimonial handlers ─────────────────────────────────

  const handleTestimonialSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setUploading(true)
    try {
      const avatar = tAvatarRef.current?.files?.[0]
      await adminCreateTestimonial({
        name: tName,
        role: tRole,
        content: tContent,
        rating: tRating,
        date: tDate || undefined,
        source: tSource,
        avatar,
      })
      setTName(''); setTRole(''); setTContent(''); setTDate(''); setTRating(5); setTSource('Direct')
      if (tAvatarRef.current) tAvatarRef.current.value = ''
      flash('Testimonial added!')
      await loadContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setUploading(false)
    }
  }

  const handleTestimonialDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    setUploading(true)
    try {
      await adminDeleteTestimonial(id)
      flash('Testimonial deleted.')
      await loadContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setUploading(false)
    }
  }

  const updateStat = (index: number, field: keyof StatItem, value: string | number) => {
    setStats((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const handleStatsSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError('')
    try {
      const cleaned = stats.map((item) => ({
        value: Number(item.value) || 0,
        suffix: item.suffix,
        label: item.label.trim(),
      }))
      if (cleaned.some((item) => !item.label)) {
        setError('Each stat needs a label.')
        return
      }
      await adminSaveHomeStats(cleaned)
      flash('Homepage stats saved!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setUploading(false)
    }
  }

  const handleStatsReset = () => {
    setStats(DEFAULT_STATS.map((item) => ({ ...item })))
  }

  // ─── Login screen ─────────────────────────────────────────

  if (!authenticated) {
    return (
      <>
        <Helmet><title>CMS Login | SKIDMO</title><meta name="robots" content="noindex" /></Helmet>
        <div className="admin admin--login">
          <div className="admin-login-brand">
            <Logo variant="letter" link={false} />
            <div>
              <h2>Content Management</h2>
              <p>Manage gallery, offers, testimonials, and homepage stats for the SKIDMO website — built for your Riyadh studio.</p>
            </div>
            <p className="text-xs text-white/30">SKIDMO — a venture by Colmo</p>
          </div>
          <div className="admin-login-panel">
            <div className="admin__card">
              <Logo variant="letter" link={false} className="mb-2 lg:hidden" />
              <h1>Sign in</h1>
              <p>Enter your admin password to continue.</p>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                {loginError && <p className="admin__error">{loginError}</p>}
                <button type="submit">Sign In</button>
              </form>
              <Link to="/" className="admin__back-link">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to website
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ─── Dashboard ────────────────────────────────────────────

  return (
    <>
      <Helmet><title>CMS | SKIDMO</title><meta name="robots" content="noindex" /></Helmet>
      <div className="admin admin--dashboard">
        {sidebarOpen && (
          <button
            type="button"
            className="admin-overlay"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
          <div className="admin-sidebar__brand">
            <Logo variant="letter" link={false} />
            <p className="admin-sidebar__label">Content Manager</p>
          </div>

          <nav className="admin-sidebar__nav" aria-label="CMS sections">
            {(Object.keys(TAB_META) as Tab[]).map((key) => {
              const meta = TAB_META[key]
              const Icon = meta.icon
              return (
                <button
                  key={key}
                  type="button"
                  className={`admin-sidebar__link${tab === key ? ' admin-sidebar__link--active' : ''}`}
                  onClick={() => switchTab(key)}
                >
                  <Icon />
                  {meta.label}
                </button>
              )
            })}
          </nav>

          <div className="admin-sidebar__footer">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> View website
            </Link>
            <button type="button" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="admin-topbar__menu"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="admin-topbar__title">
                <h1>{currentTab.title}</h1>
                <p>{currentTab.description}</p>
              </div>
            </div>
            <div className="admin-topbar__actions">
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> View Site
              </Link>
            </div>
          </header>

          <div className="admin-content">
          {error && <div className="admin__alert admin__alert--error">{error}</div>}
          {success && <div className="admin__alert admin__alert--success">{success}</div>}

          {/* ── Gallery Tab ── */}
          {tab === 'gallery' && (
            <>
              <div className="admin__section">
                <h2>Upload Gallery Image</h2>
                <form className="admin__form" onSubmit={handleGallerySubmit}>
                  <div className="admin__row">
                    <div className="admin__field">
                      <label>Title</label>
                      <input value={gTitle} onChange={(e) => setGTitle(e.target.value)} required />
                    </div>
                    <div className="admin__field">
                      <label>Category</label>
                      <select value={gCategory} onChange={(e) => setGCategory(e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="admin__field">
                    <label>Alt Text (for SEO)</label>
                    <input value={gAlt} onChange={(e) => setGAlt(e.target.value)} required />
                  </div>
                  <div className="admin__field">
                    <label>Description (optional)</label>
                    <textarea value={gDesc} onChange={(e) => setGDesc(e.target.value)} />
                  </div>
                  <div className="admin__field">
                    <label>Image</label>
                    <input ref={gImageRef} type="file" accept="image/*" required />
                    <p className="admin__hint">Recommended: {GALLERY_IMAGE_SIZE}</p>
                  </div>
                  <button type="submit" className="admin__submit" disabled={uploading}>
                    {uploading ? 'Uploading…' : 'Upload Image'}
                  </button>
                </form>
              </div>

              <div className="admin__section">
                <h2>Gallery ({gallery.length})</h2>
                {loading ? (
                  <p className="admin__empty">Loading…</p>
                ) : gallery.length === 0 ? (
                  <p className="admin__empty">No images yet. Upload one above.</p>
                ) : (
                  <div className="admin__list">
                    {gallery.map((item) => (
                      <div key={item._id} className="admin__item">
                        <img
                          src={getImageUrl(item.image, { width: 128 }) || item.image?.asset?.url || ''}
                          alt={item.altText || item.title}
                        />
                        <div className="admin__item-info">
                          <h3>{item.title}</h3>
                          <p>{item.category}{item.description ? ` — ${item.description}` : ''}</p>
                        </div>
                        <button type="button" className="admin__delete" onClick={() => handleGalleryDelete(item._id)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Offers Tab ── */}
          {tab === 'offers' && (
            <>
              <div className="admin__section">
                <h2>Create Offer</h2>
                <form className="admin__form" onSubmit={handleOfferSubmit}>
                  <div className="admin__field">
                    <label>Title</label>
                    <input value={oTitle} onChange={(e) => setOTitle(e.target.value)} required />
                  </div>
                  <div className="admin__field">
                    <label>Description</label>
                    <textarea value={oDesc} onChange={(e) => setODesc(e.target.value)} required />
                  </div>
                  <div className="admin__row">
                    <div className="admin__field">
                      <label>Start Date</label>
                      <input type="date" value={oStart} onChange={(e) => setOStart(e.target.value)} required />
                    </div>
                    <div className="admin__field">
                      <label>Expiry Date</label>
                      <input type="date" value={oExpiry} onChange={(e) => setOExpiry(e.target.value)} required />
                    </div>
                  </div>
                  <div className="admin__row">
                    <div className="admin__field">
                      <label>Button Text</label>
                      <input value={oBtnText} onChange={(e) => setOBtnText(e.target.value)} />
                    </div>
                    <div className="admin__field">
                      <label>Button Link</label>
                      <input value={oBtnLink} onChange={(e) => setOBtnLink(e.target.value)} />
                    </div>
                  </div>
                  <div className="admin__field">
                    <label>Status</label>
                    <select value={oStatus} onChange={(e) => setOStatus(e.target.value)}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div className="admin__field">
                    <label>Desktop Banner</label>
                    <input ref={webBannerRef} type="file" accept="image/*" required />
                    <p className="admin__hint">Size: {OFFER_BANNER_SIZES.web.label}</p>
                  </div>
                  <div className="admin__field">
                    <label>Mobile Banner</label>
                    <input ref={mobileBannerRef} type="file" accept="image/*" required />
                    <p className="admin__hint">Size: {OFFER_BANNER_SIZES.mobile.label}</p>
                  </div>
                  <button type="submit" className="admin__submit" disabled={uploading}>
                    {uploading ? 'Creating…' : 'Create Offer'}
                  </button>
                </form>
              </div>

              <div className="admin__section">
                <h2>Offers ({offers.length})</h2>
                {offers.length === 0 ? (
                  <p className="admin__empty">No offers yet.</p>
                ) : (
                  <div className="admin__list">
                    {offers.map((offer) => (
                      <div key={offer._id} className="admin__item">
                        <img
                          src={getImageUrl(offer.bannerWeb, { width: 128 }) || offer.bannerWeb?.asset?.url || ''}
                          alt={offer.title}
                        />
                        <div className="admin__item-info">
                          <h3>{offer.title}</h3>
                          <p>{offer.status} · Expires {offer.expiryDate}</p>
                        </div>
                        <button type="button" className="admin__delete" onClick={() => handleOfferDelete(offer._id)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Testimonials Tab ── */}
          {tab === 'testimonials' && (
            <>
              <div className="admin__section">
                <h2>Add Testimonial</h2>
                <form className="admin__form" onSubmit={handleTestimonialSubmit}>
                  <div className="admin__row">
                    <div className="admin__field">
                      <label>Client Name</label>
                      <input value={tName} onChange={(e) => setTName(e.target.value)} required />
                    </div>
                    <div className="admin__field">
                      <label>Role / Vehicle</label>
                      <input value={tRole} onChange={(e) => setTRole(e.target.value)} placeholder="e.g. Porsche 911 Owner" />
                    </div>
                  </div>
                  <div className="admin__field">
                    <label>Review</label>
                    <textarea value={tContent} onChange={(e) => setTContent(e.target.value)} required rows={4} />
                  </div>
                  <div className="admin__row">
                    <div className="admin__field">
                      <label>Rating</label>
                      <select value={tRating} onChange={(e) => setTRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="admin__field">
                      <label>Source</label>
                      <select value={tSource} onChange={(e) => setTSource(e.target.value)}>
                        {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="admin__field">
                    <label>Date (optional)</label>
                    <input type="date" value={tDate} onChange={(e) => setTDate(e.target.value)} />
                  </div>
                  <div className="admin__field">
                    <label>Avatar (optional)</label>
                    <input ref={tAvatarRef} type="file" accept="image/*" />
                  </div>
                  <button type="submit" className="admin__submit" disabled={uploading}>
                    {uploading ? 'Saving…' : 'Add Testimonial'}
                  </button>
                </form>
              </div>

              <div className="admin__section">
                <h2>Testimonials ({testimonials.length})</h2>
                {testimonials.length === 0 ? (
                  <p className="admin__empty">No testimonials yet.</p>
                ) : (
                  <div className="admin__list">
                    {testimonials.map((item) => (
                      <div key={item._id} className="admin__item">
                        {item.avatar ? (
                          <img
                            src={getImageUrl(item.avatar, { width: 64, height: 64 }) || ''}
                            alt={item.name}
                          />
                        ) : (
                          <div className="admin__avatar-placeholder">
                            {item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className="admin__item-info">
                          <h3>{item.name}{item.role ? ` — ${item.role}` : ''}</h3>
                          <p>{'★'.repeat(item.rating)}{item.source ? ` · ${item.source}` : ''}</p>
                          <p className="admin__item-quote">&ldquo;{item.content.slice(0, 120)}{item.content.length > 120 ? '…' : ''}&rdquo;</p>
                        </div>
                        <button type="button" className="admin__delete" onClick={() => handleTestimonialDelete(item._id)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Stats Tab ── */}
          {tab === 'stats' && (
            <div className="admin__section">
              <h2>Homepage Statistics</h2>
              <p className="admin__hint">
                These numbers appear in the dark stats bar on the homepage. Suffix is shown after the value (e.g. &quot;+&quot; or &quot; Yrs&quot;).
              </p>
              <form className="admin__form" onSubmit={handleStatsSubmit}>
                {stats.map((item, index) => (
                  <div key={index} className="admin__row admin__row--stats">
                    <div className="admin__field admin__field--narrow">
                      <label>Value</label>
                      <input
                        type="number"
                        min={0}
                        value={item.value}
                        onChange={(e) => updateStat(index, 'value', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="admin__field admin__field--narrow">
                      <label>Suffix</label>
                      <input
                        value={item.suffix}
                        onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                        placeholder='e.g. + or " Yrs"'
                      />
                    </div>
                    <div className="admin__field admin__field--grow">
                      <label>Label</label>
                      <input
                        value={item.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <div className="admin__actions">
                  <button type="button" className="admin__secondary" onClick={handleStatsReset}>
                    Reset to defaults
                  </button>
                  <button type="submit" className="admin__submit" disabled={uploading}>
                    {uploading ? 'Saving…' : 'Save Stats'}
                  </button>
                </div>
              </form>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  )
}
