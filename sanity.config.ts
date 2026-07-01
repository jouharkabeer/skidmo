import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || ''
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const token = import.meta.env.VITE_SANITY_WRITE_TOKEN || undefined

/** Shared Sanity Studio config — used by CLI (`npm run studio`) and embedded `/admin` route */
export default defineConfig({
  name: 'skidmo',
  title: 'SKIDMO CMS',
  projectId,
  dataset,
  basePath: '/admin',
  // Write token lets Studio upload/edit without a separate Sanity login
  ...(token ? { token } : {}),
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
})
