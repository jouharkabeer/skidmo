import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role / Vehicle', type: 'string' }),
    defineField({ name: 'content', title: 'Review Content', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image' }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: { list: ['Google', 'Instagram', 'Direct'] },
      initialValue: 'Google',
    }),
  ],
})
