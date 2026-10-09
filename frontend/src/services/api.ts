/** Base URL for Django API. Empty = same-origin (Vite proxy in dev). */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${p}`
}

export function mediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    if (url.startsWith('/media/') && API_BASE) {
      return `${API_BASE}${url}`
    }
    return url
  }
  return url
}

const ADMIN_TOKEN_KEY = 'skidmo-admin-token'

export function getAdminToken(): string | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { token: string; expires: number }
    if (data.expires <= Date.now()) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY)
      return null
    }
    return data.token
  } catch {
    return null
  }
}

export function setAdminToken(token: string, expiresInHours = 12) {
  sessionStorage.setItem(
    ADMIN_TOKEN_KEY,
    JSON.stringify({
      token,
      expires: Date.now() + expiresInHours * 60 * 60 * 1000,
    }),
  )
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type RequestOptions = {
  method?: string
  body?: BodyInit | null
  auth?: boolean
  headers?: Record<string, string>
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { ...(options.headers || {}) }
  if (options.auth) {
    const token = getAdminToken()
    if (!token) throw new ApiError('Not authenticated', 401)
    headers.Authorization = `Bearer ${token}`
  }
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(apiUrl(path), {
    method: options.method || 'GET',
    headers,
    body: options.body,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data.error || data.detail || JSON.stringify(data)
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
