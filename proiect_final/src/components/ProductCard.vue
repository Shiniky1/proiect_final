<template>
  <div class="border p-4 rounded shadow hover:shadow-md transition flex flex-col">
    <h2 class="text-xl font-semibold">{{ produs.nume }}</h2>
    <img :src="produs.imagine" alt="" class="w-full h-48 object-contain rounded bg-gray-100" />

    <p class="text-gray-600">{{ produs.descriere }}</p>
    <p class="font-bold mt-2">{{ produs.pret }} RON</p>

    <!-- Buton Adaugă în coș -->
    <button @click="addToCart(produs)" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Adaugă în coș
    </button>
    <router-link
  :to="`/oferta?produs=${encodeURIComponent(produs.nume || '')}`"
  class="mt-2 inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
>
  Cere ofertă
</router-link>
  </div>
</template>

<script setup>
// primește prop produs
defineProps({
  produs: {
    type: Object,
    required: true
  }
})

// import funcție din utilitarul coșului
import { addToCart } from '@/utils/cart'
</script>
