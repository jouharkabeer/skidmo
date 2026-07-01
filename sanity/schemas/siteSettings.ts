import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', initialValue: 'SKIDMO' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'heroVideo', title: 'Hero Video URL', type: 'url' }),
    defineField({ name: 'heroImage', title: 'Hero Fallback Image', type: 'image' }),
    defineField({
      name: 'elfsightWidgetId',
      title: 'Elfsight Google Reviews Widget ID',
      type: 'string',
      description:
        'Your Elfsight app ID (the part after "elfsight-app-" in the embed code). Example: if your embed is class="elfsight-app-abc123-def456", enter abc123-def456. Create a free widget at elfsight.com/google-reviews-widget and connect your Google Business profile.',
    }),
    defineField({
      name: 'elfsightEmbedCode',
      title: 'Elfsight Embed Code (optional)',
      type: 'text',
      rows: 6,
      description:
        'Paste the full Elfsight embed code from your dashboard if you prefer. This overrides the Widget ID field. Include both the script tag and the div.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
        defineField({ name: 'snapchat', title: 'Snapchat', type: 'url' }),
        defineField({ name: 'google', title: 'Google Business', type: 'url' }),
      ],
    }),
  ],
})
