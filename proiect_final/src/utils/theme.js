// src/utils/theme.js
export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
export function toggleTheme() {
  const toDark = !document.documentElement.classList.contains('dark')
  document.documentElement.classList.toggle('dark', toDark)
  localStorage.setItem('theme', toDark ? 'dark' : 'light')
  return toDark ? 'dark' : 'light'
}
