import { defineField, defineType } from 'sanity'

export const homeHero = defineType({
  name: 'homeHero',
  title: 'Homepage Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'badge',
      title: 'Location Badge',
      type: 'string',
      description: 'Small label above the headline, e.g. "Riyadh, Saudi Arabia"',
    }),
    defineField({
      name: 'titleBefore',
      title: 'Headline (before accent)',
      type: 'string',
    }),
    defineField({
      name: 'titleAccent',
      title: 'Headline Accent',
      type: 'string',
      description: 'Italic highlighted word in the headline',
    }),
    defineField({
      name: 'titleAfter',
      title: 'Headline (after accent)',
      type: 'string',
    }),
    defineField({
      name: 'slides',
      title: 'Hero Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'description',
              title: 'Slide Description',
              type: 'text',
              rows: 3,
              description: 'Shown below the headline when this slide is active',
            }),
            defineField({
              name: 'alt',
              title: 'Image Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'imageUrl',
              title: 'Image URL',
              type: 'url',
              description: 'External image link. Takes priority over uploaded image.',
            }),
            defineField({
              name: 'image',
              title: 'Uploaded Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Used when no image URL is set',
            }),
          ],
          preview: {
            select: { description: 'description', media: 'image' },
            prepare({ description, media }) {
              return {
                title: description?.slice(0, 60) || 'Hero slide',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
})
