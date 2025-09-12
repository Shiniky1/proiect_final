<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from "axios"
const AXIOS_BASE = import.meta.env.VITE_API_URL || "http://localhost:5174"

const loading = ref(false)
const eroare = ref('')
const items = ref([])

const q = ref('')
const sortBy = ref('createdAt_desc')
const tipFilter = ref('all') 

function isContactOffer(o) {
  return typeof o?.produs === 'string' && o.produs.trim().startsWith('[CONTACT]')
}

const statusOpts = ['noua','in_lucru','inchisa']

function fmtDate(iso) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

async function load() {
  loading.value = true
  eroare.value = ''
  try {
    const { data } = await axios.get(`${AXIOS_BASE}/api/oferte`)
    const arr = Array.isArray(data) ? data : []
    
    arr.forEach(o => { o._statusDraft = o.status || 'noua' })
    items.value = arr
  } catch (e) {
    eroare.value = 'Nu am putut încărca ofertele.'
  } finally {
    loading.value = false
  }
}

const filtrate = computed(() => {
  let arr = [...items.value]
  const s = q.value.trim().toLowerCase()

  if (tipFilter.value === 'contact') {
    arr = arr.filter(isContactOffer)
  } else if (tipFilter.value === 'oferte') {
    arr = arr.filter(o => !isContactOffer(o))
  }

  if (s) {
    arr = arr.filter(o =>
      (o.nume||'').toLowerCase().includes(s) ||
      (o.email||'').toLowerCase().includes(s) ||
      (o.produs||'').toLowerCase().includes(s) ||
      (o.telefon||'').toLowerCase().includes(s) ||
      (o.status||'').toLowerCase().includes(s)
    )
  }
  const [field, dir] = sortBy.value.split('_')
  arr.sort((a,b) => {
    const A = (a?.[field] ?? '')
    const B = (b?.[field] ?? '')
    return (A > B ? 1 : A < B ? -1 : 0) * (dir === 'desc' ? -1 : 1)
  })
  return arr
})

async function saveStatus(o){
  try {
    const { data } = await axios.put(`${AXIOS_BASE}/api/oferte/${o.id}`, { status: o._statusDraft })
    o.status = data.status
  } catch {
    alert('Nu am putut salva statusul.')
  }
}

async function removeOffer(o){
  if (!confirm(`Ștergi oferta ${o.id}?`)) return
  try {
    await axios.delete(`${AXIOS_BASE}/api/oferte/${o.id}`)
    items.value = items.value.filter(x => x.id !== o.id)
  } catch {
    alert('Nu am putut șterge oferta.')
  }
}

onMounted(load)
</script>


<template>
  <div class="max-w-7xl mx-auto px-4 py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-semibold mb-6">Admin · Oferte</h1>

    <!-- Controls -->
     <div class="card p-4 mb-6 grid gap-3 md:grid-cols-4">
      <input
        v-model.trim="q"
        class="input w-full"
        placeholder="Caută după nume, email, produs, telefon, status…"
      />
      <select v-model="sortBy" class="input">
        <option value="createdAt_desc">Cele mai noi</option>
        <option value="createdAt_asc">Cele mai vechi</option>
        <option value="nume_asc">Nume A–Z</option>
        <option value="nume_desc">Nume Z–A</option>
        <option value="status_asc">Status A–Z</option>
        <option value="status_desc">Status Z–A</option>
      </select>
      <select v-model="tipFilter" class="input">
  <option value="all">Toate</option>
 <option value="contact">Doar Contact</option>
<option value="oferte">Doar Oferte</option>
</select>
      <div class="flex gap-2">
        <button class="btn-outline" @click="load">Reîncarcă</button>
        <span v-if="loading" class="self-center text-sm opacity-70">Se încarcă…</span>
      </div>
    </div>

    <p v-if="eroare" class="text-red-600 mb-4">{{ eroare }}</p>

    <!-- Listă -->
    <div v-if="!loading && filtrate.length === 0" class="opacity-70">
      Nicio ofertă găsită.
    </div>

    <div class="grid gap-4">
      <div v-for="o in filtrate" :key="o.id" class="card p-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">{{ o.id }}</span>
          <span
  v-if="isContactOffer(o)"
  class="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-amber-500/90 text-white"
>
  Contact
</span>

          <span class="font-medium">{{ o.nume }}</span>
          <span class="text-sm opacity-75">{{ o.email }}</span>
          <span class="text-sm opacity-75">{{ o.telefon }}</span>
          <span class="ml-auto text-sm opacity-70">{{ fmtDate(o.createdAt) }}</span>
        </div>

        <div class="mt-2 text-sm">
          <div><span class="opacity-70">Produs:</span> {{ o.produs }}</div>
          <div v-if="o.mesaj"><span class="opacity-70">Mesaj:</span> {{ o.mesaj }}</div>
          <div class="mt-1">
            <span class="opacity-70">Status curent:</span>
            <span class="font-medium">{{ o.status || 'noua' }}</span>
          </div>
        </div>

        <!-- Thumbs -->
        <div v-if="Array.isArray(o.schite) && o.schite.length" class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <a
            v-for="(img, idx) in o.schite.slice(0,3)"
            :key="idx"
            :href="img"
            target="_blank"
            rel="noopener"
            class="block"
            title="Deschide imaginea"
          >
            <img
  :src="img"
  class="h-48 w-full object-contain border dark:border-gray-700 rounded bg-white dark:bg-gray-900"
  alt="schiță"
/>
          </a>
          <div v-if="o.schite.length > 3" class="text-xs opacity-70 self-center">
            + {{ o.schite.length - 3 }} imagini
          </div>
        </div>

        <!-- Acțiuni -->
        <div class="mt-3 flex flex-wrap gap-2 items-center">
          <select v-model="o._statusDraft" class="input w-40">
            <option v-for="s in statusOpts" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
          <button class="btn-outline" @click="saveStatus(o)">Salvează status</button>
          <button class="btn-outline" @click="removeOffer(o)">Șterge</button>
        </div>
      </div>
    </div>
  </div>
</template>
