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
        class="w-full h-72 object-cover rounded border dark:border-gray-700"
      />
      <h1 class="text-3xl font-bold">{{ produs.nume }}</h1>

      <div class="flex gap-2 text-xs opacity-80">
        <span v-if="produs.categorie" class="px-2 py-1 rounded border dark:border-gray-700">{{ produs.categorie }}</span>
        <span v-if="produs.material" class="px-2 py-1 rounded border dark:border-gray-700">{{ produs.material }}</span>
      </div>

      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {{ produs.descriere }}
      </p>

      <RouterLink
        :to="`/oferta?prod=${produs.id}&nume=${encodeURIComponent(produs.nume)}`"
        class="btn-primary inline-block"
      >
        Cere ofertă
      </RouterLink>
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

onMounted(async () => {
  try {
    const id = route.params.id
    const { data } = await api.get(`/api/products/${id}`)
    if (!data || !data.id) eroare.value = 'Produsul nu a fost găsit.'
    else produs.value = data
  } catch (e) {
    console.error('Eroare la încărcarea produsului:', e)
    eroare.value = 'Nu am putut încărca produsul.'
  } finally {
    loading.value = false
  }
})
</script>
