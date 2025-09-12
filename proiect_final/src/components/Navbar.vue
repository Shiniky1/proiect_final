<script setup>
import { ref, onMounted } from 'vue'
import { getTheme, toggleTheme } from '@/utils/theme'
import { getUser, isAdmin, logout } from '@/utils/auth'

import logoLight from '@/assets/logoSto.png'
import logoDark  from '@/assets/logoSto_white.png'

const mode = ref('light')

const user = ref(getUser())
const admin = ref(isAdmin())

function refreshAuth() {
  user.value = getUser()
  admin.value = isAdmin()
}
function onAuthChanged() {
  refreshAuth()
}

onMounted(() => {
  mode.value = getTheme()
})
</script>

<template>
  <nav class="wood-bg-navbar sticky top-0 z-40 bg-white/80 dark:bg-transparent backdrop-blur border-b border-gray-200 dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-3 shrink-0">
          <img :src="mode === 'dark' ? logoDark : logoLight" alt="STO Mob Design" class="h-12 w-auto drop-shadow" />
          <span class="hidden sm:inline text-lg font-bold tracking-wide text-gray-900 dark:text-gray-100">
            STO Mob Design
          </span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-6">
          <RouterLink to="/" class="nav-link" :class="$route.path === '/' ? 'active' : ''">Acasă</RouterLink>
          <RouterLink
  to="/portofoliu"
  class="nav-link"
  :class="$route.path.startsWith('/portofoliu') ? 'active' : ''"
>Portofoliu</RouterLink>

          <RouterLink to="/contact" class="nav-link" :class="$route.path.startsWith('/contact') ? 'active' : ''">Contact</RouterLink>
          <RouterLink to="/oferta" class="btn-primary" :class="$route.path.startsWith('/oferta') ? 'ring-2 ring-amber-300' : ''">Cere ofertă</RouterLink>

          <template v-if="admin">
            <RouterLink to="/admin/oferte" class="nav-link" :class="$route.path.startsWith('/admin/oferte') ? 'active' : ''">Admin · Oferte</RouterLink>
          </template>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="mode = toggleTheme()"
            class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
            :title="mode === 'dark' ? 'Comută pe Light' : 'Comută pe Dark'">
            <span v-if="mode === 'dark'">🌙</span>
            <span v-else>☀️</span>
          </button>

          <RouterLink v-if="!user" to="/login" class="btn-outline" :class="$route.path.startsWith('/login') ? 'ring-2 ring-amber-300' : ''">Login</RouterLink>
          <button v-else @click="logout()" class="btn-outline">Logout</button>
        </div>
      </div>

      <div class="md:hidden py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <RouterLink to="/" class="nav-link">Acasă</RouterLink>
        <RouterLink to="/portofoliu" class="nav-link">Portofoliu</RouterLink>

        <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
        <RouterLink to="/oferta" class="nav-link-strong">Cere ofertă</RouterLink>
        <RouterLink v-if="admin" to="/admin/oferte" class="nav-link">Admin · Oferte</RouterLink>
      </div>
    </div>
  </nav>
</template>
