<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Catalog produse</h1>

    <div v-if="loading">Se încarcă produsele...</div>
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard v-for="produs in produse" :key="produs.id" :produs="produs" />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '../components/ProductCard.vue'

const produse = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get('/data/produse.json')
    produse.value = response.data
  } catch (error) {
    console.error('Eroare la încărcarea produselor:', error)
  } finally {
    loading.value = false
  }
})
</script>
