import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01'
const token = import.meta.env.VITE_SANITY_WRITE_TOKEN

function getApiHost(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/sanity-api`
  }
  return `https://${projectId}.api.sanity.io`
}

/** Sanity client with write access — used only in /admin */
export const sanityWriteClient = projectId && token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
      useProjectHostname: false,
      apiHost: getApiHost(),
      ignoreBrowserTokenWarning: true,
    })
  : null
