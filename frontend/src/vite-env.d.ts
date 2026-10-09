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
  readonly VITE_API_URL: string
  readonly VITE_DJANGO_PROXY: string
  readonly VITE_SITE_URL: string
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_GOOGLE_MAPS_EMBED_URL: string
  readonly VITE_ELFSIGHT_WIDGET_ID: string
  readonly VITE_FB_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
