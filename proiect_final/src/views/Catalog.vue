  <template>
    <div class="max-w-7xl mx-auto p-6">
      <!-- heading + bar filtre -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold">Catalog produse</h1>
          <p class="text-sm text-gray-600 dark:text-gray-300">Găsite: <b>{{ filtered.length }}</b> din {{ produse.length }}</p>
        </div>

        <!-- bară compactă: căutare + sortare -->
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <!-- căutare -->
          <div class="relative">
            <input
              v-model.trim="filters.q"
              type="text"
              class="input pr-9 w-full sm:w-72"
              placeholder="Caută produs sau descriere"
            />
            <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 2a8 8 0 1 1 5.293 13.707l4 4-1.414 1.414-4-4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 10 4Z"/>
            </svg>
          </div>

          <!-- sortare -->
          <select v-model="filters.sort" class="input">
            <option value="relevance">Relevanță</option>
            <option value="price_asc">Preț: crescător</option>
            <option value="price_desc">Preț: descrescător</option>
            <option value="name_asc">Nume: A→Z</option>
            <option value="name_desc">Nume: Z→A</option>
          </select>
        </div>
      </div>

      <!-- grid produse -->
      <div v-if="loading" class="card p-6 text-center">Se încarcă produsele...</div>

      <div v-else>
        <div v-if="!filtered.length" class="card p-6">
          Niciun produs după criteriile curente.
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <ProductCard
            v-for="produs in filtered"
            :key="produs.id"
            :produs="produs"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </div>
  </template>

  <script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import { addToCart as addToCartUtil } from '@/utils/cart'   // ✅ folosește utilitarul

const produse = ref([])
const loading = ref(true)

const filters = ref({ q: '', sort: 'relevance' })

const filtered = computed(() => {
  let list = [...produse.value]
  const q = filters.value.q.trim().toLowerCase()
  if (q) {
    list = list.filter(p =>
      String(p.nume || '').toLowerCase().includes(q) ||
      String(p.descriere || '').toLowerCase().includes(q)
    )
  }
  switch (filters.value.sort) {
    case 'price_asc':  list.sort((a,b)=>Number(a.pret||0)-Number(b.pret||0)); break
    case 'price_desc': list.sort((a,b)=>Number(b.pret||0)-Number(a.pret||0)); break
    case 'name_asc':   list.sort((a,b)=>String(a.nume||'').localeCompare(String(b.nume||''))); break
    case 'name_desc':  list.sort((a,b)=>String(b.nume||'').localeCompare(String(a.nume||''))); break
  }
  return list
})

onMounted(async () => {
  try {
    const { data } = await axios.get('/data/produse.json')
    produse.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Eroare la încărcarea produselor:', e)
  } finally {
    loading.value = false
  }
})

// 🔹 Adăugare în coș prin utilitar (emite automat cart-storage)
function addToCart(p) {
  addToCartUtil({
    id: p.id,
    nume: p.nume,
    pret: Number(p.pret) || 0,
    imagine: p.imagine,
    qty: 1,
  })
}
</script>

