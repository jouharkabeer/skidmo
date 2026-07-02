import type { GalleryImage, Offer, Testimonial, FAQ, CompanyInfo } from '@/types'
import { SITE_FAQS } from '@/data/siteData'

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format`

export const MOCK_GALLERY: GalleryImage[] = [
  {
    _id: 'g1',
    title: 'Porsche 911 GT3 — Full PPF',
    image: { asset: { url: unsplash('1492144534655-ae79c964c9d7') }, alt: 'Porsche 911 GT3 with full PPF' },
    category: 'PPF',
    description: 'Complete front and full body XPEL Ultimate Plus installation.',
    altText: 'Silver Porsche 911 GT3 with paint protection film in SKIDMO studio',
  },
  {
    _id: 'g2',
    title: 'Mercedes-AMG GT — Ceramic Coating',
    image: { asset: { url: unsplash('1618843479313-40f8afb4b4d8') }, alt: 'Mercedes AMG GT ceramic coating' },
    category: 'Ceramic',
    description: 'Multi-layer Gtechniq Crystal Serum Ultra application.',
    altText: 'Black Mercedes-AMG GT with ceramic coating gloss finish',
  },
  {
    _id: 'g3',
    title: 'BMW M4 — Paint Correction',
    image: { asset: { url: unsplash('1555215695-3004980ad54e') }, alt: 'BMW M4 paint correction' },
    category: 'Correction',
    description: 'Three-stage correction removing years of swirl marks.',
    altText: 'Blue BMW M4 after paint correction at SKIDMO Riyadh',
  },
  {
    _id: 'g4',
    title: 'Range Rover — Window Tint',
    image: { asset: { url: unsplash('1606664515524-ed2f786a0bd6') }, alt: 'Range Rover window tint' },
    category: 'Tint',
    description: 'Premium ceramic tint with 35% VLT all around.',
    altText: 'White Range Rover with ceramic window tinting',
  },
  {
    _id: 'g5',
    title: 'Lamborghini Huracán — Full Protection',
    image: { asset: { url: unsplash('1503376780353-7e6692767b70') }, alt: 'Lamborghini Huracan PPF' },
    category: 'PPF',
    description: 'Full body STEK DYNOshield with ceramic top coat.',
    altText: 'Orange Lamborghini Huracan with full body PPF',
  },
  {
    _id: 'g6',
    title: 'Audi RS6 — Interior Detail',
    image: { asset: { url: unsplash('1606664515524-ed2f786a0bd6', 600) }, alt: 'Audi RS6 interior' },
    category: 'Interior',
    description: 'Complete leather restoration and ozone treatment.',
    altText: 'Audi RS6 luxury interior detailing',
  },
  {
    _id: 'g7',
    title: 'Ferrari 488 — Track Package PPF',
    image: { asset: { url: unsplash('1492144534655-ae79c964c9d7') }, alt: 'Ferrari 488 PPF' },
    category: 'PPF',
    description: 'High-impact areas protected for track day readiness.',
    altText: 'Red Ferrari 488 with track package paint protection',
  },
  {
    _id: 'g8',
    title: 'Tesla Model S Plaid — Full Detail',
    image: { asset: { url: unsplash('1563720223185-11003d516935') }, alt: 'Tesla Model S detailing' },
    category: 'Detailing',
    description: 'Exterior decontamination, correction, and ceramic coating.',
    altText: 'White Tesla Model S after premium detailing',
  },
  {
    _id: 'g9',
    title: 'McLaren 720S — Show Car Finish',
    image: { asset: { url: unsplash('1542362567-b07e54358753') }, alt: 'McLaren 720S' },
    category: 'Ceramic',
    description: 'Concours-level preparation with multi-layer protection.',
    altText: 'McLaren 720S with show car ceramic coating finish',
  },
  {
    _id: 'g10',
    title: 'Rolls-Royce Ghost — Bespoke Care',
    image: { asset: { url: unsplash('1549317661-bd32c8ce0db2') }, alt: 'Rolls Royce detailing' },
    category: 'Detailing',
    description: 'White-glove detailing for the pinnacle of luxury.',
    altText: 'Rolls-Royce Ghost premium detailing service',
  },
  {
    _id: 'g11',
    title: 'Nissan GT-R — Correction & PPF',
    image: { asset: { url: unsplash('1553440569-bcc63803a83d') }, alt: 'Nissan GTR PPF' },
    category: 'PPF',
    description: 'Correction followed by full front PPF package.',
    altText: 'Nissan GT-R with paint correction and PPF',
  },
  {
    _id: 'g12',
    title: 'Workshop — Precision Installation',
    image: { asset: { url: unsplash('1486262715619-67b85e0b08d3') }, alt: 'SKIDMO workshop' },
    category: 'Studio',
    description: 'Climate-controlled installation bay with LED lighting.',
    altText: 'SKIDMO premium automotive workshop in Riyadh',
  },
]

export const MOCK_OFFERS: Offer[] = [
  {
    _id: 'o1',
    title: 'Full Front PPF Package',
    bannerWeb: { asset: { url: unsplash('1492144534655-ae79c964c9d7', 1920) } },
    bannerMobile: { asset: { url: unsplash('1492144534655-ae79c964c9d7', 1080) } },
    description:
      'Protect your hood, fenders, bumper, mirrors, and headlights with XPEL Ultimate Plus. Includes complimentary paint decontamination wash.',
    startDate: '2026-01-01',
    expiryDate: '2026-06-30',
    buttonText: 'Claim Offer',
    buttonLink: '/contact#quote-form',
    status: 'active',
    priority: 10,
  },
  {
    _id: 'o2',
    title: 'Ceramic Coating + Correction Bundle',
    bannerWeb: { asset: { url: unsplash('1619642751034-765dfdf7c58e', 1920) } },
    bannerMobile: { asset: { url: unsplash('1619642751034-765dfdf7c58e', 1080) } },
    description:
      'Save 20% when you combine our two-stage paint correction with Gtechniq Crystal Serum Ultra ceramic coating.',
    startDate: '2026-02-01',
    expiryDate: '2026-05-31',
    buttonText: 'Book Bundle',
    buttonLink: '/contact#quote-form',
    status: 'active',
    priority: 8,
  },
  {
    _id: 'o3',
    title: 'Window Tint Special',
    bannerWeb: { asset: { url: unsplash('1552519507-da3b142c6e3d', 1920) } },
    bannerMobile: { asset: { url: unsplash('1552519507-da3b142c6e3d', 1080) } },
    description:
      'Premium ceramic window film installation at 15% off. Includes lifetime warranty and free rear defroster check.',
    startDate: '2026-03-01',
    expiryDate: '2026-04-30',
    buttonText: 'Get Quote',
    buttonLink: '/contact#quote-form',
    status: 'active',
    priority: 5,
  },
]

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    _id: 't1',
    name: 'Abdullah Al-Rashid',
    role: 'Porsche 911 Turbo S Owner',
    content:
      'SKIDMO transformed my 911. The PPF installation is completely invisible — you cannot tell it\'s there until you see how the car handles daily driving in Riyadh. Exceptional craftsmanship.',
    rating: 5,
    date: '2026-02-15',
    source: 'Google',
  },
  {
    _id: 't2',
    name: 'Sarah Al-Mutairi',
    role: 'Range Rover Sport Owner',
    content:
      'From the moment I walked in, I knew this was different from other detailing shops. Professional, transparent pricing, and my Range Rover looks better than the day I bought it.',
    rating: 5,
    date: '2026-01-28',
    source: 'Google',
  },
  {
    _id: 't3',
    name: 'Faisal Al-Harbi',
    role: 'Mercedes-AMG GT Owner',
    content:
      'The ceramic coating on my AMG GT is phenomenal. Water beads off instantly and the depth of gloss is unreal. Worth every riyal for the protection and aesthetics.',
    rating: 5,
    date: '2026-01-10',
    source: 'Google',
  },
  {
    _id: 't4',
    name: 'Mohammed Al-Qahtani',
    role: 'Lamborghini Huracán Owner',
    content:
      'Full body PPF on a Huracán requires serious skill. SKIDMO delivered flawless edges, perfect alignment, and zero bubbles. This is the only shop I trust with my cars.',
    rating: 5,
    date: '2025-12-20',
    source: 'Google',
  },
]

export const MOCK_FAQS: FAQ[] = SITE_FAQS

export const MOCK_COMPANY_INFO: CompanyInfo = {
  _id: 'c1',
  name: 'SKIDMO',
  tagline: 'SKIDMO — a venture by Colmo',
  about:
    'Founded in Riyadh with a singular vision — to bring world-class automotive protection to Saudi Arabia\'s discerning car enthusiasts. SKIDMO was born from a passion for precision and an uncompromising standard of excellence. What started as a boutique detailing studio has evolved into the region\'s most trusted name in paint protection, ceramic coating, and luxury vehicle care.',
  mission:
    'To deliver flawless automotive protection using the finest products and certified techniques, ensuring every vehicle leaves our studio in pristine condition.',
  vision:
    'To be the Middle East\'s benchmark for premium automotive protection — where craftsmanship meets innovation.',
  values: [
    { title: 'Precision', description: 'Every cut, every edge, every application executed with surgical accuracy.' },
    { title: 'Integrity', description: 'Transparent pricing, honest recommendations, and products we stand behind.' },
    { title: 'Passion', description: 'We are car people first. Your vehicle receives the care we\'d give our own.' },
    { title: 'Innovation', description: 'Continuous training on the latest films, coatings, and installation techniques.' },
  ],
  workshopImages: [
    { asset: { url: unsplash('1486262715619-67b85e0b08d3', 1000) } },
    { asset: { url: unsplash('1619642751034-765dfdf7c58e', 1000) } },
    { asset: { url: unsplash('1618843479313-40f8afb4b4d8', 1000) } },
  ],
}
