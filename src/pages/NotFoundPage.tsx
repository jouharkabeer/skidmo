import { Home, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { Logo } from '@/components/ui/Logo'

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noIndex />
      <section className="flex min-h-screen items-center justify-center bg-ink px-4">
        <FadeIn className="text-center">
          <Logo variant="full" link={false} className="mx-auto mb-10" imgClassName="h-20 sm:h-24" />
          <p className="font-display text-8xl text-accent sm:text-9xl">404</p>
          <h1 className="heading-lg mt-4 text-white">Page Not Found</h1>
          <div className="gold-rule my-6 bg-accent" />
          <p className="body-lg mx-auto max-w-md text-white/50">
            This page doesn&apos;t exist. Let us guide you back.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button to="/" size="lg" variant="secondary">
              <Home className="h-4 w-4" /> Home
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="!border-white/20 !text-white hover:!bg-white/5">
              <ArrowLeft className="h-4 w-4" /> Contact
            </Button>
          </div>
        </FadeIn>
      </section>
    </>
  )
}
