<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const AXIOS_BASE = import.meta.env.VITE_API_URL || 'http://localhost/sto_api'

// stare pagină
const loading = ref(false)
const eroare = ref('')
const items = ref([])

// filtre & sort
const q = ref('')
const sortBy = ref('createdAt_desc')
const statusOpts = ['plasata','in_procesare','livrata','anulata']

// format dată
function fmtDate(iso) {
  try { return new Date(iso).toLocaleString() } catch { return iso || '' }
}

// încarcă comenzi
async function load() {
  loading.value = true
  eroare.value = ''
  try {
    const { data } = await axios.get(`${AXIOS_BASE}/api/orders`)
    const arr = Array.isArray(data) ? data : []
    arr.forEach(o => { o._statusDraft = o.status || 'plasata' })
    items.value = arr
  } catch {
    eroare.value = 'Nu am putut încărca comenzile.'
  } finally {
    loading.value = false
  }
}
// șterge comandă
async function deleteOrder(o) {
  if (!confirm(`Ștergi comanda ${o.id}?`)) return;
  try {
    await axios.delete(`${AXIOS_BASE}/api/orders/${o.id}`)
    items.value = items.value.filter(x => x.id !== o.id)
  } catch {
    alert('Nu am putut șterge comanda.')
  }
}

// liste filtrate + sortate
const filtrate = computed(() => {
  let arr = [...items.value]
  const s = q.value.trim().toLowerCase()
  if (s) {
    arr = arr.filter(o =>
      (o.id||'').toLowerCase().includes(s) ||
      (o.nume||'').toLowerCase().includes(s) ||
      (o.email||'').toLowerCase().includes(s) ||
      (o.telefon||'').toLowerCase().includes(s) ||
      (o.adresa||'').toLowerCase().includes(s) ||
      (o.status||'').toLowerCase().includes(s)
    )
  }
  const [field, dir] = sortBy.value.split('_')
  arr.sort((a,b)=>{
    const A = (a?.[field] ?? '')
    const B = (b?.[field] ?? '')
    return (A > B ? 1 : A < B ? -1 : 0) * (dir==='desc'?-1:1)
  })
  return arr
})

// salvează status comandă
async function saveStatus(o) {
  try {
    await axios.put(`${AXIOS_BASE}/api/orders/${o.id}`, { status: o._statusDraft })
    o.status = o._statusDraft
  } catch {
    alert('Nu am putut salva statusul.')
  }
}
onMounted(load)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-semibold mb-6">Admin · Comenzi</h1>

    <div class="card p-4 mb-6 grid gap-3 md:grid-cols-3">
      <input v-model.trim="q" class="input w-full" placeholder="Caută după nume, email, status, adresă, ID..." />
      <select v-model="sortBy" class="input">
        <option value="createdAt_desc">Cele mai noi</option>
        <option value="createdAt_asc">Cele mai vechi</option>
        <option value="nume_asc">Nume A–Z</option>
        <option value="nume_desc">Nume Z–A</option>
        <option value="status_asc">Status A–Z</option>
        <option value="status_desc">Status Z–A</option>
      </select>
      <div class="flex gap-2">
        <button class="btn-outline" @click="load">Reîncarcă</button>
        <span v-if="loading" class="self-center text-sm opacity-70">Se încarcă…</span>
      </div>
    </div>

    <p v-if="eroare" class="text-red-600 mb-4">{{ eroare }}</p>
    <div v-if="!loading && filtrate.length===0" class="opacity-70">Nicio comandă găsită.</div>

    <div class="grid gap-4">
      <div v-for="o in filtrate" :key="o.id" class="card p-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">{{ o.id }}</span>
          <span class="font-medium">{{ o.nume }}</span>
          <span class="text-sm opacity-75">{{ o.email }}</span>
          <span class="text-sm opacity-75">{{ o.telefon }}</span>
          <span class="ml-auto text-sm opacity-70">{{ fmtDate(o.createdAt) }}</span>
        </div>

        <div class="mt-2 text-sm space-y-1">
          <div><span class="opacity-70">Adresă:</span> {{ o.adresa }}</div>
          <div v-if="o.observatii"><span class="opacity-70">Observații:</span> {{ o.observatii }}</div>
          <div><span class="opacity-70">Status curent:</span> <b>{{ o.status || 'plasata' }}</b></div>
        </div>

        <div class="mt-3 grid gap-2">
          <div class="text-sm opacity-70">Produse:</div>
          <div v-for="(it, idx) in (o.items||[])" :key="idx" class="flex items-center gap-3">
            <img :src="it.imagine" alt="" class="w-14 h-14 object-cover rounded border dark:border-gray-700" />
            <div class="flex-1">
              <div class="font-medium">{{ it.nume }}</div>
              <div class="text-xs opacity-70">Cantitate: {{ it.qty }} · Preț: {{ it.pret }} RON</div>
            </div>
          </div>
        </div>
<div class="mt-3 flex flex-wrap items-center gap-2">
  <div class="ml-auto flex items-center gap-2">
    <select v-model="o._statusDraft" class="input w-44">
      <option v-for="s in statusOpts" :key="s" :value="s">{{ s }}</option>
    </select>
    <button class="btn-outline" @click="saveStatus(o)">Salvează status</button>
    <button class="btn-outline text-red-600" @click="deleteOrder(o)">Șterge</button>
  </div>
  <div class="font-semibold ml-3">Total: {{ o.total }} RON</div>
</div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <div class="ml-auto flex items-center gap-2">
            <select v-model="o._statusDraft" class="input w-44">
              <option v-for="s in statusOpts" :key="s" :value="s">{{ s }}</option>
            </select>
            <button class="btn-outline" @click="saveStatus(o)">Salvează status</button>
          </div>
          <div class="font-semibold ml-3">Total: {{ o.total }} RON</div>
        </div>
      </div>
    </div>
  </div>
</template>
