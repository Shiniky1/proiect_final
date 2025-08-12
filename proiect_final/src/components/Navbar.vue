<script setup>
import { ref, onMounted } from 'vue'
import logoUrl from '@/assets/STO.png' // logo din assets

const cartCount = ref(0)

// număr produse din localStorage
function loadCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartCount.value = Array.isArray(cart) ? cart.length : 0
  } catch {
    cartCount.value = 0
  }
}

onMounted(() => {
  loadCartCount()
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') loadCartCount()
  })
})
</script>

<template>
  <nav class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between">
        
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3">
          <img :src="logoUrl" alt="STO Mob Design" class="h-14 w-auto drop-shadow-lg" />
          <span class="hidden sm:inline text-lg font-bold tracking-wide text-gray-900 dark:text-gray-100">
            STO Mob Design
          </span>
        </RouterLink>

        <!-- Meniu desktop -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink to="/" class="navlink">Acasă</RouterLink>
          <RouterLink to="/catalog" class="navlink">Catalog</RouterLink>
          <RouterLink to="/contact" class="navlink">Contact</RouterLink>
          <RouterLink to="/oferta" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
  Cere ofertă
</RouterLink>

        </div>

        <!-- Coș + Login -->
        <div class="flex items-center gap-2 sm:gap-4">
          <RouterLink to="/cart" class="relative inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 class="h-5 w-5 fill-current text-gray-700 dark:text-gray-300">
              <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 .001 4A2 2 0 0 0 17 18ZM3 4h2l2.4 9.6A3 3 0 0 0 10.3 16H18a3 3 0 0 0 2.9-2.2l1.6-6A1 1 0 0 0 21.6 6H6.2l-.5-2H3Z"/>
            </svg>
            <span class="text-sm font-medium">Coș</span>
            <span v-if="cartCount" class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center justify-center">
              {{ cartCount }}
            </span>
          </RouterLink>

          <RouterLink to="/login" class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition">
            Login
          </RouterLink>
        </div>
      </div>

      <!-- Meniu mobil -->
      <div class="md:hidden py-2 flex items-center justify-center gap-6">
        <RouterLink to="/" class="navlink">Acasă</RouterLink>
        <RouterLink to="/catalog" class="navlink">Catalog</RouterLink>
        <RouterLink to="/contact" class="navlink">Contact</RouterLink>
        <RouterLink to="/oferta" class="navlink font-semibold text-blue-700">
  Cere ofertă
</RouterLink>

      </div>
    </div>
  </nav>
</template>

<style scoped>
.navlink {
  @apply text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition;
}
</style>
