<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/utils/api'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const produse = ref([])
const loading = ref(true)
const eroare = ref('')

const q = ref('')
const selectedCat = ref('')

// unele versiuni de ProductCard emit @add-to-cart; dacă nu folosești coșul, lăsăm un no-op
const addToCart = () => {}

function syncCatFromRoute () {
  selectedCat.value = String(route.query.cat || '').trim().toLowerCase()
}

const filtered = computed(() => {
  let list = Array.isArray(produse.value) ? [...produse.value] : []

  // filtru categorie strict pe câmpul "categorie"
  if (selectedCat.value) {
    list = list.filter(p =>
      String(p?.categorie || '').toLowerCase().includes(selectedCat.value)
    )
  }

  // căutare doar pe nume + descriere (nu și pe categorie)
  const s = q.value.trim().toLowerCase()
  if (s) {
    list = list.filter(p =>
      String(p?.nume || '').toLowerCase().includes(s) ||
      String(p?.descriere || '').toLowerCase().includes(s)
    )
  }

  // poți adăuga sort aici dacă vrei
  return list
})

async function load() {
  loading.value = true
  eroare.value = ''
  try {
    const { data } = await api.get('/api/products')
    produse.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    eroare.value = 'Nu am putut încărca produsele.'
  } finally {
    loading.value = false
  }
}

function clearCategory() {
  router.replace({ path: '/catalog', query: {} })
}

// inițializare
onMounted(async () => {
  await load()
  syncCatFromRoute()
})
watch(() => route.query.cat, syncCatFromRoute)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- heading + bar filtre -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Catalog produse</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Găsite: <b>{{ filtered.length }}</b> din {{ produse.length }}
        </p>
      </div>

      <!-- bară simplă: căutare -->
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative">
          <input
            v-model.trim="q"
            type="text"
            class="input pr-9 w-full sm:w-72"
            placeholder="Caută în nume sau descriere"
          />
          <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2a8 8 0 1 1 5.293 13.707l4 4-1.414 1.414-4-4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 10 4Z"/>
          </svg>
        </div>

        <!-- chip pentru categorie din URL -->
        <div v-if="selectedCat" class="flex items-center gap-2">
          <span class="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 text-sm">
            Categorie: {{ selectedCat }}
          </span>
          <button class="btn-outline" @click="clearCategory">Șterge filtru</button>
        </div>
      </div>
    </div>

    <!-- stări -->
    <div v-if="loading" class="card p-6 text-center">Se încarcă produsele...</div>
    <p v-else-if="eroare" class="text-red-600 mb-4">{{ eroare }}</p>
    <div v-else-if="!filtered.length" class="card p-6">Niciun produs după criteriile curente.</div>

    <!-- grilă produse -->
    <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <ProductCard
        v-for="produs in filtered"
        :key="produs.id"
        :produs="produs"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>
