import { adminLogin as apiLogin, adminLogout as apiLogout } from '@/services/adminService'
import { getAdminToken, clearAdminToken } from '@/services/api'

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken())
}

export async function loginAdmin(password: string): Promise<boolean> {
  try {
    await apiLogin(password)
    return true
  } catch {
    return false
  }
}

export async function logoutAdmin(): Promise<void> {
  await apiLogout()
  clearAdminToken()
}

export function isAdminPasswordConfigured(): boolean {
  // Password is validated by Django; assume configured if API is reachable
  return true
}
