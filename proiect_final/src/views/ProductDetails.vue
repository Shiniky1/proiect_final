<template>
  <div v-if="produs" class="p-6 max-w-3xl mx-auto">
    <img
      :src="produs.imagine"
      :alt="produs.nume"
      class="mb-6 w-full h-64 object-cover rounded"
    />
    <h1 class="text-3xl font-bold mb-2">{{ produs.nume }}</h1>
    <p class="text-gray-700 mb-4">{{ produs.descriere }}</p>
    <p class="text-xl font-bold text-green-700 mb-6">{{ produs.pret }} RON</p>
    <router-link
      to="/comanda"
      class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
    >
      Comandă produsul
    </router-link>
  </div>

  <div v-else class="p-6 text-center text-red-600">
    Produsul nu a fost găsit.
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const produs = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('/data/produse.json')
    produs.value = response.data.find(p => p.id === parseInt(route.params.id))
  } catch (error) {
    console.error('Eroare la încărcarea produsului:', error)
  }
})
</script>
