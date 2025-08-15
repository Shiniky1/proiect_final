<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Catalog produse</h1>

    <div v-if="loading">Se încarcă produsele...</div>
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard
        v-for="produs in produse"
        :key="produs.id"
        :produs="produs"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'

const produse = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await axios.get('/data/produse.json')
    produse.value = data
  } catch (e) {
    console.error('Eroare la încărcarea produselor:', e)
  } finally {
    loading.value = false
  }
})

function addToCart(p) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const i = cart.findIndex(x => x.id === p.id)
  if (i >= 0) cart[i].qty += 1
  else cart.push({ id: p.id, nume: p.nume, pret: p.pret, imagine: p.imagine, qty: 1 })
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }))
}
</script>
