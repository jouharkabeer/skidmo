import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 }),
    defineField({ name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
    defineField({ name: 'ogImage', title: 'OG Image', type: 'image' }),
  ],
})

export const seoPage = defineType({
  name: 'seoPage',
  title: 'Page SEO',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: ['home', 'about', 'services', 'gallery', 'offers', 'faq', 'contact'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 }),
    defineField({ name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
    defineField({ name: 'ogImage', title: 'OG Image', type: 'image' }),
  ],
})
