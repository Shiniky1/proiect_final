<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const items = ref([])

function load() {
  try {
    items.value = JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    items.value = []
  }
}
function save() {
  localStorage.setItem('cart', JSON.stringify(items.value))
  window.dispatchEvent(new Event('cart-storage'))
}


function inc(i) {
  items.value[i].qty = Math.max(1, (items.value[i].qty || 1) + 1)
  save()
}
function dec(i) {
  const next = (items.value[i].qty || 1) - 1
  if (next < 1) {
    remove(i)
  } else {
    items.value[i].qty = next
    save()
  }
}
function remove(i) {
  items.value.splice(i, 1)
  save()
}
function clearCart() {
  if (confirm('Ești sigur că vrei să golești coșul?')) {
    items.value = []
    save()
  }
}

const subtotal = computed(() =>
  items.value.reduce((s, it) => s + Number(it.pret || 0) * Number(it.qty || 1), 0)
)
const shipping = computed(() => (items.value.length ? 0 : 0))
const total = computed(() => subtotal.value + shipping.value)
const itemCount = computed(() => items.value.reduce((s, it) => s + Number(it.qty || 1), 0))

const fmt = (n) => new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

function goCheckout() {
  if (!items.value.length) return
  router.push('/comanda')
}

function onStorage(e) {
  if (!e || e.type === 'cart-storage' || e.key === 'cart') {
    load()
  }
}


onMounted(() => {
  load()
  window.addEventListener('storage', onStorage)        
  window.addEventListener('cart-storage', onStorage)   
})
onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
  window.removeEventListener('cart-storage', onStorage)
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 space-y-6">
    <div class="flex items-end justify-between">
      <h1 class="text-2xl font-bold">Coș de cumpărături</h1>
      <span v-if="items.length" class="text-sm text-gray-600 dark:text-gray-300">Articole: {{ itemCount }}</span>
    </div>

    <div v-if="!items.length" class="card p-6 text-center">
      Coșul este gol.
      <RouterLink to="/catalog" class="btn-primary ml-2">Mergi la catalog</RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-6">
      <!-- listă produse -->
      <div class="lg:col-span-2 card p-0 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th class="text-left p-3">Produs</th>
              <th class="text-center p-3">Cantitate</th>
              <th class="text-right p-3">Preț</th>
              <th class="p-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it,i) in items" :key="it.id" class="border-t dark:border-gray-700">
              <td class="p-3">
                <div class="flex items-center gap-3">
                  <img :src="it.imagine" alt="" class="w-16 h-16 object-cover rounded border dark:border-gray-700" />
                  <div class="font-medium">{{ it.nume }}</div>
                </div>
              </td>
              <td class="p-3">
                <div class="flex items-center justify-center gap-2">
                  <button class="btn-outline px-2 py-1" @click="dec(i)" aria-label="Scade cantitatea">−</button>
                  <span class="min-w-[2rem] text-center">{{ it.qty }}</span>
                  <button class="btn-outline px-2 py-1" @click="inc(i)" aria-label="Crește cantitatea">+</button>
                </div>
              </td>
              <td class="p-3 text-right font-semibold">
                {{ fmt((it.pret || 0) * (it.qty || 1)) }} RON
              </td>
              <td class="p-3 text-right">
                <button class="btn-outline" @click="remove(i)">Șterge</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- sumar -->
      <div class="card p-4 h-fit">
        <h2 class="text-lg font-semibold mb-3">Sumar</h2>
        <div class="flex justify-between text-sm py-1">
          <span>Subtotal</span><span>{{ fmt(subtotal) }} RON</span>
        </div>
        <div class="flex justify-between text-sm py-1">
          <span>Transport</span><span>{{ fmt(shipping) }} RON</span>
        </div>
        <div class="border-t dark:border-gray-700 my-3"></div>
        <div class="flex justify-between font-bold text-base">
          <span>Total</span><span>{{ fmt(total) }} RON</span>
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <button class="btn-primary" :disabled="!items.length" @click="goCheckout">
            Finalizează comanda
          </button>
          <button class="btn-outline" @click="clearCart">Golește coșul</button>
          <RouterLink to="/catalog" class="btn-outline text-center">Continuă cumpărăturile</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
