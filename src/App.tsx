import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MainLayout } from '@/layouts/MainLayout'
import { LoadingScreen } from '@/components/common/LoadingScreen'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const GalleryPage = lazy(() => import('@/pages/GalleryPage'))
const OffersPage = lazy(() => import('@/pages/OffersPage'))
const FAQPage = lazy(() => import('@/pages/FAQPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* CMS admin — no site chrome, password protected */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminPage />
              </Suspense>
            }
          />

          {/* Public website */}
          <Route
            element={
              <>
                <LoadingScreen />
                <MainLayout />
              </>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route path="about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
            <Route path="services" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
            <Route path="gallery" element={<Suspense fallback={<PageLoader />}><GalleryPage /></Suspense>} />
            <Route path="offers" element={<Suspense fallback={<PageLoader />}><OffersPage /></Suspense>} />
            <Route path="faq" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
            <Route path="terms" element={<Suspense fallback={<PageLoader />}><TermsPage /></Suspense>} />
            <Route path="privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
