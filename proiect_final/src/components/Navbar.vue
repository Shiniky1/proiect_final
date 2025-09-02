<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logoUrl from '@/assets/STO.png'
import { getTheme, toggleTheme } from '@/utils/theme'
import { getUser, isAdmin, logout } from '@/utils/auth'

const mode = ref('light')
const cartCount = ref(0)
const user = ref(getUser())
const admin = ref(isAdmin())

// actualizează badge coș
function loadCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartCount.value = Array.isArray(cart) ? cart.reduce((s, it) => s + (it.qty || 1), 0) : 0
  } catch { cartCount.value = 0 }
}

// actualizează stare auth
function refreshAuth() {
  user.value = getUser()
  admin.value = isAdmin()
}

// ascultă schimbări coș și auth
function onStorage(e) {
  if (!e || e.type === 'cart-storage' || e.key === 'cart') loadCartCount()
}
function onAuthChanged() {
  refreshAuth()
}

onMounted(() => {
  loadCartCount()
  refreshAuth()
  window.addEventListener('storage', onStorage)
  window.addEventListener('cart-storage', onStorage)
  window.addEventListener('auth-changed', onAuthChanged)
  mode.value = getTheme()
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
  window.removeEventListener('cart-storage', onStorage)
  window.removeEventListener('auth-changed', onAuthChanged)
})
</script>

<template>
  <nav class="wood-bg-navbar sticky top-0 z-40 bg-white/80 dark:bg-transparent backdrop-blur border-b border-gray-200 dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-3">
          <img :src="logoUrl" alt="STO Mob Design" class="h-14 w-auto drop-shadow-lg" />
          <span class="hidden sm:inline text-lg font-bold tracking-wide text-gray-900 dark:text-gray-100">STO Mob Design</span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-6">
          <RouterLink to="/" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Acasă</RouterLink>
          <RouterLink to="/catalog" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Catalog</RouterLink>
          <RouterLink to="/contact" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Contact</RouterLink>
          <RouterLink to="/oferta" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Cere ofertă</RouterLink>
          <RouterLink v-if="admin" to="/admin/oferte" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Admin</RouterLink>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <RouterLink to="/cart" class="relative inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="h-5 w-5 fill-current text-gray-700 dark:text-gray-300" aria-hidden="true">
              <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 .001 4A2 2 0 0 0 17 18ZM3 4h2l2.4 9.6A3 3 0 0 0 10.3 16H18a3 3 0 0 0 2.9-2.2l1.6-6A1 1 0 0 0 21.6 6H6.2l-.5-2H3Z"/>
            </svg>
            <span class="text-sm font-medium">Coș</span>
            <span v-if="cartCount" class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center justify-center">{{ cartCount }}</span>
          </RouterLink>

          <button
            @click="mode = toggleTheme()"
            class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
            :title="mode === 'dark' ? 'Comută pe Light' : 'Comută pe Dark'"
          >
            <span v-if="mode === 'dark'">🌙</span>
            <span v-else>☀️</span>
          </button>

          <RouterLink v-if="!user" to="/login" class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition">Login</RouterLink>
          <button v-else @click="logout()" class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition">Logout</button>
        </div>
      </div>

      <div class="md:hidden py-2 flex items-center justify-center gap-6">
        <RouterLink to="/" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Acasă</RouterLink>
        <RouterLink to="/catalog" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Catalog</RouterLink>
        <RouterLink to="/contact" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Contact</RouterLink>
        <RouterLink to="/oferta" class="text-blue-700 font-semibold transition">Cere ofertă</RouterLink>
        <RouterLink v-if="admin" to="/admin/oferte" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition">Admin</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style>
.wood-bg-navbar{
  background-color:#F5F1E6;
  background-image:
    repeating-linear-gradient(90deg,rgba(169,113,66,.06) 0,rgba(169,113,66,.06) 2px,transparent 2px,transparent 6px),
    linear-gradient(0deg,rgba(169,113,66,.05),rgba(169,113,66,.02) 60%,rgba(169,113,66,.05)),
    linear-gradient(#F5F1E6,#F5F1E6);
}
.dark .wood-bg-navbar{
  background-color:#2A1B14;
  background-image:
    repeating-linear-gradient(90deg,rgba(193,135,90,.10) 0,rgba(193,135,90,.10) 2px,transparent 2px,transparent 6px),
    linear-gradient(0deg,rgba(161,113,77,.12),rgba(161,113,77,.06) 60%,rgba(161,113,77,.12)),
    linear-gradient(#2A1B14,#2A1B14);
}
</style>
