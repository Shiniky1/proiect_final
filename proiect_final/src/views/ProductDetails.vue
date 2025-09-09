<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div v-if="loading" class="card p-6 text-center">Se încarcă…</div>

    <div v-else-if="eroare" class="card p-6 text-center text-red-600">
      {{ eroare }}
    </div>

    <div v-else-if="produs" class="space-y-4">
      <img
        :src="produs.imagine"
        :alt="produs.nume"
        class="w-full h-64 object-cover rounded border dark:border-gray-700"
      />
      <h1 class="text-3xl font-bold">{{ produs.nume }}</h1>
      <p class="text-gray-700 dark:text-gray-300">{{ produs.descriere }}</p>
      <p class="text-2xl font-semibold text-amber-700">
        {{ fmtPret(produs.pret) }} RON
      </p>

      <router-link
        to="/comanda"
        class="btn-primary inline-block"
      >
        Comandă produsul
      </router-link>
    </div>

    <div v-else class="card p-6 text-center text-red-600">
      Produsul nu a fost găsit.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/utils/api'

const route = useRoute()
const produs = ref(null)
const loading = ref(true)
const eroare = ref('')

const fmtPret = (n) =>
  new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0)

onMounted(async () => {
  try {
    const id = route.params.id
    const { data } = await api.get(`/api/products/${id}`)
    if (!data || !data.id) {
      eroare.value = 'Produsul nu a fost găsit.'
    } else {
      produs.value = data
    }
  } catch (e) {
    console.error('Eroare la încărcarea produsului:', e)
    eroare.value = 'Nu am putut încărca produsul.'
  } finally {
    loading.value = false
  }
})
</script>
