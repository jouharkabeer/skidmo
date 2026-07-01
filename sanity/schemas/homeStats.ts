import { defineField, defineType } from 'sanity'

export const homeStats = defineType({
  name: 'homeStats',
  title: 'Homepage Statistics',
  type: 'document',
  fields: [
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'suffix',
              title: 'Suffix',
              type: 'string',
              description: 'Text after the number, e.g. "+" or " Yrs"',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { value: 'value', suffix: 'suffix', label: 'label' },
            prepare({ value, suffix, label }) {
              return { title: `${value ?? ''}${suffix ?? ''} — ${label ?? ''}` }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
})
