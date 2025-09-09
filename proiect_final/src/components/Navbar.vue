<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logoUrl from '@/assets/STO.png'
import { getTheme, toggleTheme } from '@/utils/theme'
import { getUser, isAdmin, logout } from '@/utils/auth'

const mode = ref('light')
const cartCount = ref(0)
const user = ref(getUser())
const admin = ref(isAdmin())

function loadCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartCount.value = Array.isArray(cart) ? cart.reduce((s, it) => s + (it.qty || 1), 0) : 0
  } catch { cartCount.value = 0 }
}
function refreshAuth() {
  user.value = getUser()
  admin.value = isAdmin()
}
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
      <!-- rând principal -->
      <div class="h-16 flex items-center justify-between gap-4">
        <!-- brand -->
        <RouterLink to="/" class="flex items-center gap-3 shrink-0">
          <img :src="logoUrl" alt="STO Mob Design" class="h-12 w-auto drop-shadow" />
          <span class="hidden sm:inline text-lg font-bold tracking-wide text-gray-900 dark:text-gray-100">
            STO Mob Design
          </span>
        </RouterLink>

        <!-- linkuri desktop -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink
            to="/"
            class="nav-link"
            :class="$route.path === '/' ? 'active' : ''"
          >Acasă</RouterLink>

          <RouterLink
            to="/catalog"
            class="nav-link"
            :class="$route.path.startsWith('/catalog') ? 'active' : ''"
          >Catalog</RouterLink>

          <RouterLink
            to="/contact"
            class="nav-link"
            :class="$route.path.startsWith('/contact') ? 'active' : ''"
          >Contact</RouterLink>

          <RouterLink
            to="/oferta"
            class="btn-primary"
            :class="$route.path.startsWith('/oferta') ? 'ring-2 ring-amber-300' : ''"
          >Cere ofertă</RouterLink>

          <template v-if="admin">
            <RouterLink
              to="/admin/oferte"
              class="nav-link"
              :class="$route.path.startsWith('/admin/oferte') ? 'active' : ''"
            >Admin · Oferte</RouterLink>

            <RouterLink
              to="/admin/comenzi"
              class="nav-link"
              :class="$route.path.startsWith('/admin/comenzi') ? 'active' : ''"
            >Admin · Comenzi</RouterLink>
          </template>
        </div>

        <!-- acțiuni -->
        <div class="flex items-center gap-2 sm:gap-3">
          <RouterLink
            to="/cart"
            class="relative inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            :class="$route.path.startsWith('/cart') ? 'ring-2 ring-amber-300' : ''"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="h-5 w-5 fill-current text-gray-700 dark:text-gray-300" aria-hidden="true">
              <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 .001 4A2 2 0 0 0 17 18ZM3 4h2l2.4 9.6A3 3 0 0 0 10.3 16H18a3 3 0 0 0 2.9-2.2l1.6-6A1 1 0 0 0 21.6 6H6.2l-.5-2H3Z"/>
            </svg>
            <span class="text-sm font-medium">Coș</span>
            <span v-if="cartCount"
              class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full text-xs font-bold bg-amber-600 text-white flex items-center justify-center">
              {{ cartCount }}
            </span>
          </RouterLink>

          <button
            @click="mode = toggleTheme()"
            class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
            :title="mode === 'dark' ? 'Comută pe Light' : 'Comută pe Dark'">
            <span v-if="mode === 'dark'">🌙</span>
            <span v-else>☀️</span>
          </button>

          <RouterLink
            v-if="!user"
            to="/login"
            class="btn-outline"
            :class="$route.path.startsWith('/login') ? 'ring-2 ring-amber-300' : ''"
          >Login</RouterLink>

          <button
            v-else
            @click="logout()"
            class="btn-outline"
          >Logout</button>
        </div>
      </div>

      <!-- rând mobil  -->
      <div class="md:hidden py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <RouterLink to="/" class="nav-link">Acasă</RouterLink>
        <RouterLink to="/catalog" class="nav-link">Catalog</RouterLink>
        <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
        <RouterLink to="/oferta" class="nav-link-strong">Cere ofertă</RouterLink>
        <RouterLink v-if="admin" to="/admin/oferte" class="nav-link">Admin · Oferte</RouterLink>
        <RouterLink v-if="admin" to="/admin/comenzi" class="nav-link">Admin · Comenzi</RouterLink>
      </div>
    </div>
  </nav>
</template>

