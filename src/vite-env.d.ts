/// <reference types="vite/client" />

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string
  readonly VITE_SANITY_DATASET: string
  readonly VITE_SANITY_API_VERSION: string
  readonly VITE_SANITY_WRITE_TOKEN: string
  readonly VITE_SITE_URL: string
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_GOOGLE_MAPS_EMBED_URL: string
  readonly VITE_ELFSIGHT_WIDGET_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
