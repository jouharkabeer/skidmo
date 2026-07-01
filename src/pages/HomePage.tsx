import { PageSEO, getDefaultStructuredData } from '@/components/seo/SEO'
import { HOME_SEO } from '@/constants/seo'
import { HeroSection } from '@/sections/home/HeroSection'
import { StatsSection } from '@/sections/home/StatsSection'
import { ServicesSection } from '@/sections/home/ServicesSection'
import { WhyChooseUsSection } from '@/sections/home/WhyChooseUsSection'
import { GalleryPreviewSection } from '@/sections/home/GalleryPreviewSection'
import { OffersPreviewSection } from '@/sections/home/OffersPreviewSection'
import { TestimonialsSection } from '@/sections/home/TestimonialsSection'
import { GoogleReviewsSection } from '@/sections/home/GoogleReviewsSection'
import { FAQPreviewSection } from '@/sections/home/FAQPreviewSection'

export default function HomePage() {
  return (
    <>
      <PageSEO page={HOME_SEO} structuredData={getDefaultStructuredData()} />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <GalleryPreviewSection />
      <OffersPreviewSection />
      <TestimonialsSection />
      <GoogleReviewsSection />
      <FAQPreviewSection />
    </>
  )
}
