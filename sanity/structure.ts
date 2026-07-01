import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('SKIDMO Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('galleryImage').title('Gallery Images'),
      S.documentTypeListItem('offer').title('Offers'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('companyInfo').title('Company Info'),
      S.divider(),
      S.documentTypeListItem('seoPage').title('Page SEO'),
    ])
