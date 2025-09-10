<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Portofoliu lucrări</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Găsite: <b>{{ filtered.length }}</b> din {{ produse.length }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative">
          <input
            v-model.trim="filters.q"
            type="text"
            class="input pr-9 w-full sm:w-80"
            placeholder="Caută nume, descriere, categorie, material"
          />
          <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2a8 8 0 1 1 5.293 13.707l4 4-1.414 1.414-4-4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 10 4Z"/>
          </svg>
        </div>

        <select v-model="filters.sort" class="input">
          <option value="relevance">Relevanță</option>
          <option value="name_asc">Nume: A→Z</option>
          <option value="name_desc">Nume: Z→A</option>
          <option value="newest">Cele mai noi</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="card p-6 text-center">Se încarcă lucrările…</div>

    <div v-else>
      <div v-if="!filtered.length" class="card p-6">
        Niciun rezultat după criteriile curente.
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <ProductCard
          v-for="produs in filtered"
          :key="produs.id"
          :produs="produs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '@/utils/api'
import ProductCard from '@/components/ProductCard.vue'

const produse = ref([])
const loading = ref(true)
const filters = ref({ q: '', sort: 'relevance' })

const filtered = computed(() => {
  let list = [...produse.value]
  const q = filters.value.q.trim().toLowerCase()

  if (q) {
    list = list.filter(p => {
      const f = (v) => String(v || '').toLowerCase()
      return f(p.nume).includes(q)
          || f(p.descriere).includes(q)
          || f(p.categorie).includes(q)
          || f(p.material).includes(q)
    })
  }

  switch (filters.value.sort) {
    case 'name_asc':  list.sort((a,b)=>String(a.nume||'').localeCompare(String(b.nume||''))); break
    case 'name_desc': list.sort((a,b)=>String(b.nume||'').localeCompare(String(a.nume||''))); break
    case 'newest':    list.sort((a,b)=>(b.id||0)-(a.id||0)); break
    // relevance = fără schimbări
  }
  return list
})

onMounted(async () => {
  try {
    const { data } = await api.get('/api/products')
    produse.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Eroare la încărcarea produselor:', e)
  } finally {
    loading.value = false
  }
})
</script>
