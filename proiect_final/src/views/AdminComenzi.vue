<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "@/utils/api";

const loading = ref(false);
const eroare = ref("");
const items = ref([]);
const q = ref("");
const sortBy = ref("createdAt_desc"); 
const statusOpts = ["plasata", "in_procesare", "livrata", "anulata"];

function fmtDate(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString("ro-RO"); } catch { return iso; }
}
function money(n) {
  return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n||0));
}
function normLines(lines) {
  try {
    const arr = Array.isArray(lines) ? lines : JSON.parse(lines || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

async function load() {
  loading.value = true; eroare.value = "";
  try {
    const { data } = await api.get("/api/orders");
    items.value = (Array.isArray(data) ? data : []).map(o => {
      const lines = normLines(o.items).map(it => {
        const qty = Number(it.qty || 1);
        const pret = Number(it.pret || 0);
        return { ...it, qty, pret, subtotal: qty * pret };
      });
      const totalCalc = lines.reduce((s, it) => s + it.subtotal, 0);
      return { ...o, _lines: lines, _totalCalc: totalCalc, _statusDraft: o.status || "plasata" };
    });
  } catch {
    eroare.value = "Nu am putut încărca comenzile.";
  } finally {
    loading.value = false;
  }
}

async function saveStatus(o) {
  try {
    const { data } = await api.put(`/api/orders/${o.id}`, { status: o._statusDraft });
    o.status = data.status;
  } catch {
    alert("Nu am putut salva statusul.");
  }
}

const filtrate = computed(() => {
  let arr = [...items.value];
  const s = q.value.trim().toLowerCase();
  if (s) {
    arr = arr.filter(o =>
      (o.nume||"").toLowerCase().includes(s) ||
      (o.email||"").toLowerCase().includes(s) ||
      (o.telefon||"").toLowerCase().includes(s) ||
      (o.adresa||"").toLowerCase().includes(s) ||
      (o.status||"").toLowerCase().includes(s) ||
      String(o.id||"").toLowerCase().includes(s)
    );
  }
  const [field, dir] = sortBy.value.split("_");
  arr.sort((a,b) => {
    let A, B;
    if (field === "total") { A = Number(a.total||0); B = Number(b.total||0); }
    else { A = a?.[field] ?? ""; B = b?.[field] ?? ""; }
    return (A > B ? 1 : A < B ? -1 : 0) * (dir === "desc" ? -1 : 1);
  });
  return arr;
});

onMounted(load);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-semibold mb-6">Admin · Comenzi</h1>

    <!-- Controls -->
    <div class="card p-4 mb-6 grid gap-3 md:grid-cols-3">
      <input
        v-model.trim="q"
        class="input w-full"
        placeholder="Caută după nume, email, telefon, adresă, status, ID…"
      />
      <select v-model="sortBy" class="input">
        <option value="createdAt_desc">Cele mai noi</option>
        <option value="createdAt_asc">Cele mai vechi</option>
        <option value="nume_asc">Nume A–Z</option>
        <option value="nume_desc">Nume Z–A</option>
        <option value="total_asc">Total mic → mare</option>
        <option value="total_desc">Total mare → mic</option>
      </select>
      <div class="flex gap-2">
        <button class="btn-outline" @click="load">Reîncarcă</button>
        <span v-if="loading" class="self-center text-sm opacity-70">Se încarcă…</span>
      </div>
    </div>

    <p v-if="eroare" class="text-red-600 mb-4">{{ eroare }}</p>
    <div v-if="!loading && !filtrate.length" class="opacity-70">Nicio comandă.</div>

    <div class="grid gap-4">
      <div v-for="o in filtrate" :key="o.id" class="card p-4">
        <!-- header -->
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">{{ o.id }}</span>
          <span class="font-medium">{{ o.nume }}</span>
          <span class="text-sm opacity-75">{{ o.email }}</span>
          <span class="text-sm opacity-75">{{ o.telefon }}</span>
          <span class="ml-auto text-sm opacity-70">{{ fmtDate(o.createdAt) }}</span>
        </div>

        <!-- detalii -->
        <div class="mt-2 text-sm">
          <div><span class="opacity-70">Adresă:</span> {{ o.adresa }}</div>
          <div v-if="o.observatii"><span class="opacity-70">Obs:</span> {{ o.observatii }}</div>
          <div class="mt-1"><span class="opacity-70">Status curent:</span> <strong>{{ o.status }}</strong></div>
          <div><span class="opacity-70">Total (din comandă):</span> <strong>{{ money(o.total) }} RON</strong></div>
        </div>

        <!-- linii produse -->
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900">
                <th class="text-left px-3 py-2 border dark:border-gray-700">Produs</th>
                <th class="text-right px-3 py-2 border dark:border-gray-700">Preț</th>
                <th class="text-right px-3 py-2 border dark:border-gray-700">Cant.</th>
                <th class="text-right px-3 py-2 border dark:border-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, i) in o._lines" :key="i">
                <td class="px-3 py-2 border dark:border-gray-700">
                  <div class="font-medium">{{ it.nume || it.name || 'Produs' }}</div>
                  <div class="opacity-70 text-xs" v-if="it.id">ID: {{ it.id }}</div>
                </td>
                <td class="px-3 py-2 border dark:border-gray-700 text-right">{{ money(it.pret) }} RON</td>
                <td class="px-3 py-2 border dark:border-gray-700 text-right">{{ it.qty }}</td>
                <td class="px-3 py-2 border dark:border-gray-700 text-right font-medium">{{ money(it.subtotal) }} RON</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="px-3 py-2 border dark:border-gray-700 text-right font-semibold">Total din linii</td>
                <td class="px-3 py-2 border dark:border-gray-700 text-right font-semibold">{{ money(o._totalCalc) }} RON</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- acțiuni -->
        <div class="mt-3 flex flex-wrap gap-2 items-center">
          <select v-model="o._statusDraft" class="input w-44">
            <option v-for="s in statusOpts" :key="s" :value="s">{{ s }}</option>
          </select>
          <button class="btn-outline" @click="saveStatus(o)">Salvează status</button>
        </div>
      </div>
    </div>
  </div>
</template>
