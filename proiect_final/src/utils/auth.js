// stochează/recuperează utilizatorul curent
const KEY = 'authUser'

// obține utilizatorul curent
export function getUser() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}

// verifică dacă e admin
export function isAdmin() {
  const u = getUser()
  return u && u.role === 'admin'
}

// autentifică utilizatorul (mock)
export async function login(username, password) {
  // exemplu simplu: admin / admin123
  if (username === 'admin' && password === 'admin123') {
    const u = { name: 'Admin', role: 'admin' }
    localStorage.setItem(KEY, JSON.stringify(u))
    window.dispatchEvent(new Event('auth-changed'))
    return u
  }
  throw new Error('Date de login incorecte')
}

// logout
export function logout() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event('auth-changed'))
}
