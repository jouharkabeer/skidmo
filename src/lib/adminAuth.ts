const AUTH_KEY = 'skidmo-admin-session'
const SESSION_HOURS = 12

function getExpectedPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD || ''
}

/** Simple session token — not cryptographically strong; pair with Netlify env vars */
function createSessionToken(): string {
  return btoa(`skidmo:${Date.now()}:${getExpectedPassword().length}`)
}

export function isAdminAuthenticated(): boolean {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    if (!raw) return false
    const session = JSON.parse(raw) as { token: string; expires: number }
    return session.expires > Date.now()
  } catch {
    return false
  }
}

export function loginAdmin(password: string): boolean {
  const expected = getExpectedPassword()
  if (!expected) {
    console.warn('VITE_ADMIN_PASSWORD is not set')
    return false
  }
  if (password !== expected) return false

  sessionStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      token: createSessionToken(),
      expires: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
    })
  )
  return true
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(AUTH_KEY)
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(getExpectedPassword())
}
