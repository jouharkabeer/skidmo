import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { ScanBarcode, Search, ShieldCheck, ShieldX } from 'lucide-react'
import { lookupWarranty } from '@/services/contentService'
import type { VehicleWarranty } from '@/types'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { ApiError } from '@/services/api'

export default function WarrantyPage() {
  const { barcode: barcodeParam } = useParams<{ barcode?: string }>()
  const navigate = useNavigate()
  const [barcode, setBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<VehicleWarranty | null>(null)

  const checkWarranty = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) {
      setError('Enter a barcode number.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await lookupWarranty(trimmed)
      setResult(data)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('No warranty found for this barcode.')
      } else {
        setError(err instanceof Error ? err.message : 'Lookup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fromUrl = (barcodeParam || '').trim()
    if (!fromUrl) {
      setBarcode('')
      setResult(null)
      setError('')
      return
    }
    setBarcode(fromUrl)
    void checkWarranty(fromUrl)
  }, [barcodeParam])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const code = barcode.trim()
    if (!code) {
      setError('Enter a barcode number.')
      return
    }
    // Keep barcode in the URL so QR cards and shared links work the same way
    if (barcodeParam !== code) {
      navigate(`/warranty/${encodeURIComponent(code)}`, { replace: false })
      return
    }
    await checkWarranty(code)
  }

  return (
    <>
      <Helmet>
        <title>Check Warranty | SKIDMO</title>
        <meta name="description" content="Verify your SKIDMO vehicle protection warranty by barcode — no login required." />
      </Helmet>

      <section className="relative overflow-hidden bg-ink pt-28 pb-16 sm:pt-32">
        <div className="hero-gradient absolute inset-0 opacity-80" />
        <div className="container-premium relative z-10 text-center">
          <FadeIn>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-white/20 text-accent">
              <ScanBarcode className="h-7 w-7" />
            </div>
            <h1 className="heading-lg text-white">Check Your Warranty</h1>
            <p className="body-lg mx-auto mt-4 max-w-xl text-white/75">
              Scan the QR on your card or enter the barcode. No account needed.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-canvas">
        <div className="container-premium mx-auto max-w-xl">
          <FadeIn>
            <form onSubmit={handleSubmit} className="border border-border bg-surface p-6 sm:p-8">
              <label htmlFor="barcode" className="label-sm">
                Barcode number
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Enter barcode"
                  autoComplete="off"
                  inputMode="text"
                  className="input-field mt-0 flex-1"
                />
                <Button type="submit" variant="primary" loading={loading} className="sm:shrink-0">
                  <Search className="h-4 w-4" /> Check
                </Button>
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </form>
          </FadeIn>

          {result && (
            <FadeIn className="mt-8">
              <div className="border border-border bg-surface p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  {!result.warrantyAvailable ? (
                    <>
                      <ShieldX className="h-8 w-8 text-text-muted" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">No warranty</p>
                        <p className="font-display text-2xl text-ink">Service recorded without warranty</p>
                      </div>
                    </>
                  ) : result.isActive ? (
                    <>
                      <ShieldCheck className="h-8 w-8 text-brand" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Warranty active</p>
                        <p className="font-display text-2xl text-ink">Protection confirmed</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldX className="h-8 w-8 text-text-muted" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Warranty expired</p>
                        <p className="font-display text-2xl text-ink">Coverage ended</p>
                      </div>
                    </>
                  )}
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Barcode</dt>
                    <dd className="mt-1 text-sm text-ink">{result.barcode}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Vehicle</dt>
                    <dd className="mt-1 text-sm text-ink">{result.vehicleNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Customer</dt>
                    <dd className="mt-1 text-sm text-ink">{result.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Phone</dt>
                    <dd className="mt-1 text-sm text-ink">{result.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Email</dt>
                    <dd className="mt-1 text-sm text-ink">{result.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Service</dt>
                    <dd className="mt-1 text-sm text-ink">{result.serviceName || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Amount paid</dt>
                    <dd className="mt-1 text-sm text-ink">
                      {result.amountPaid != null && result.amountPaid !== ''
                        ? `SAR ${Number(result.amountPaid).toLocaleString('en-SA', { minimumFractionDigits: 2 })}`
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Service date</dt>
                    <dd className="mt-1 text-sm text-ink">{result.serviceDoneDate}</dd>
                  </div>
                  {result.warrantyAvailable && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Warranty expiry</dt>
                      <dd className="mt-1 text-sm font-medium text-ink">{result.warrantyExpiryDate || '—'}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  )
}
