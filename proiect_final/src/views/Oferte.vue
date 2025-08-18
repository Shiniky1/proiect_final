<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Oferte primite</h1>

    <div class="grid lg:grid-cols-12 gap-6">
      <!-- sidebar filtre -->
      <aside class="lg:col-span-3 card p-4 h-fit lg:sticky lg:top-20">
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Căutare</label>
            <input v-model.trim="filters.q" type="text" class="input" placeholder="Nume sau produs" />
          </div>

          <div>
            <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Sortare</label>
            <select v-model="filters.sort" class="input">
              <option value="recent">Cele mai recente</option>
              <option value="oldest">Cele mai vechi</option>
              <option value="nume_asc">Nume A→Z</option>
              <option value="nume_desc">Nume Z→A</option>
              <option value="produs_asc">Produs A→Z</option>
              <option value="produs_desc">Produs Z→A</option>
            </select>
          </div>

          <div class="flex gap-2">
            <button class="btn-primary flex-1" @click="applyNow">Aplică</button>
            <button class="btn-outline" @click="resetFilters">Reset</button>
          </div>
        </div>
      </aside>

      <!-- listă oferte -->
      <section class="lg:col-span-9">
        <div v-if="!oferte.length && !loading" class="card p-6 text-center">
          Nu există oferte salvate.
        </div>

        <div v-else>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Găsite: <strong>{{ filtered.length }}</strong> din {{ oferte.length }}
          </p>

          <div v-if="!filtered.length" class="card p-6">
            Nici o ofertă după filtrele curente.
          </div>

          <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div v-for="of in filtered" :key="of.id" class="card p-4 space-y-2">
              <h3 class="font-semibold text-lg">{{ of.produs || 'Produs neprecizat' }}</h3>
              <p class="text-sm"><strong>Nume:</strong> {{ of.nume }}</p>
              <p class="text-sm"><strong>Telefon:</strong> {{ of.telefon }}</p>
              <p v-if="of.email" class="text-sm"><strong>Email:</strong> {{ of.email }}</p>
              <p v-if="of.mesaj" class="text-sm">{{ of.mesaj }}</p>
              <p class="text-xs text-gray-500">Trimis: {{ new Date(of.createdAt).toLocaleString() }}</p>

              <div v-if="of.schite?.length" class="grid grid-cols-2 gap-2 mt-2">
                <img
                  v-for="(s, i) in of.schite"
                  :key="i"
                  :src="s.data"
                  :alt="s.name"
                  class="h-24 w-full object-cover border dark:border-gray-700 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const oferte = ref([])
const loading = ref(true)

const filters = ref({
  q: '',
  sort: 'recent',
})

function applyNow() {}
function resetFilters() {
  filters.value = { q: '', sort: 'recent' }
}

const filtered = computed(() => {
  let list = [...oferte.value]

  const q = filters.value.q.trim().toLowerCase()
  if (q) {
    list = list.filter(of =>
      String(of.nume || '').toLowerCase().includes(q) ||
      String(of.produs || '').toLowerCase().includes(q) ||
      String(of.mesaj || '').toLowerCase().includes(q)
    )
  }

  switch (filters.value.sort) {
    case 'recent':
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'nume_asc':
      list.sort((a, b) => String(a.nume || '').localeCompare(String(b.nume || '')))
      break
    case 'nume_desc':
      list.sort((a, b) => String(b.nume || '').localeCompare(String(a.nume || '')))
      break
    case 'produs_asc':
      list.sort((a, b) => String(a.produs || '').localeCompare(String(b.produs || '')))
      break
    case 'produs_desc':
      list.sort((a, b) => String(b.produs || '').localeCompare(String(a.produs || '')))
      break
  }

  return list
})

onMounted(() => {
  try {
    oferte.value = JSON.parse(localStorage.getItem('oferte') || '[]')
  } catch {
    oferte.value = []
  } finally {
    loading.value = false
  }
})
</script>
