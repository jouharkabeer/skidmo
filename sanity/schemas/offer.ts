import { defineField, defineType } from 'sanity'

const WEB_BANNER_SIZE = '1920 × 720 px (8:3 ratio) — JPG or WebP, max 500 KB'
const MOBILE_BANNER_SIZE = '1080 × 1350 px (4:5 ratio) — JPG or WebP, max 300 KB'

export const offer = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Offer Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerWeb',
      title: 'Desktop Banner',
      type: 'image',
      description: `Required size: ${WEB_BANNER_SIZE}. Used on tablets and desktop screens.`,
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerMobile',
      title: 'Mobile Banner',
      type: 'image',
      description: `Required size: ${MOBILE_BANNER_SIZE}. Used on phones. Upload a portrait-oriented version of the offer.`,
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Claim Offer',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      initialValue: '/contact#quote-form',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Expired', value: 'expired' },
          { title: 'Draft', value: 'draft' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Higher numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'bannerWeb', subtitle: 'status' },
  },
})
