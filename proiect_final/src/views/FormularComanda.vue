<script setup>
import { reactive, ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { getCart, clearCart, removeFromCart, setQty } from '@/utils/cart'
import axios from "axios";
const AXIOS_BASE = import.meta.env.VITE_API_URL || "http://localhost:5174";
const router = useRouter()

// state formular
const form = reactive({
  nume: '',
  email: '',
  telefon: '',
  adresa: '',
  observatii: '',
  acceptGDPR: false,
})

// stare UI
const touched = reactive({})
const sending = ref(false)
const succes = ref(false)
const eroare = ref('')

// coș curent
const cartItems = ref([])

// calcule coș
const subtotal = computed(() =>
  cartItems.value.reduce((s, it) => s + Number(it.pret || 0) * Number(it.qty || 1), 0)
)
const shipping = computed(() => 0)
const total = computed(() => subtotal.value + shipping.value)

// reîncarcă coșul
function loadCart() {
  cartItems.value = getCart()
}

// marchează câmp atins
function markTouched(k) {
  touched[k] = true
}

// validări
const errors = computed(() => {
  const e = {}
  if (!form.nume.trim()) e.nume = 'Completează numele.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email invalid.'
  if (!/^[0-9+\s-]{7,}$/.test(form.telefon)) e.telefon = 'Telefon invalid.'
  if (!form.adresa.trim()) e.adresa = 'Adresa este obligatorie.'
  if (!form.acceptGDPR) e.acceptGDPR = 'Trebuie să accepți prelucrarea datelor.'
  if (!cartItems.value.length) e.cart = 'Coșul este gol.'
  return e
})
const isValid = computed(() => Object.keys(errors.value).length === 0)

// scade qty
function dec(it) {
  const next = (it.qty || 1) - 1
  if (next < 1) {
    remove(it)
  } else {
    setQty(it.id, next)
    loadCart()
  }
}

// crește qty
function inc(it) {
  setQty(it.id, (it.qty || 1) + 1)
  loadCart()
}

// șterge produs
function remove(it) {
  removeFromCart(it.id)
  loadCart()
}

// trimite comanda
async function submitOrder() {
  Object.keys(form).forEach(k => k !== 'observatii' && (touched[k] = true))
  if (!isValid.value) { eroare.value = 'Verifică câmpurile marcate.'; return }

  sending.value = true
  eroare.value = ''
  succes.value = false

  const payload = {
    nume: form.nume.trim(),
    email: form.email.trim(),
    telefon: form.telefon.trim(),
    adresa: form.adresa.trim(),
    observatii: form.observatii.trim(),
    items: cartItems.value,
    total: total.value,
  }

  try {
    await axios.post(`${AXIOS_BASE}/api/orders`, payload, { headers: { 'Content-Type': 'application/json' } })
    succes.value = true
    clearCart()
    localStorage.removeItem('checkout_draft')
    loadCart()
    setTimeout(() => router.push('/user'), 1200)
  } catch (e) {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push({ id: 'ORD-' + Date.now(), ...payload, createdAt: new Date().toISOString(), status: 'plasata' })
      localStorage.setItem('orders', JSON.stringify(orders))
      succes.value = true
      clearCart()
      localStorage.removeItem('checkout_draft')
      loadCart()
      setTimeout(() => router.push('/user'), 1200)
    } catch {
      eroare.value = 'Nu am putut salva comanda.'
    }
  } finally {
    sending.value = false
  }
}

// autosave draft
watchEffect(() => {
  localStorage.setItem('checkout_draft', JSON.stringify({ form, items: cartItems.value }))
})

// restaurare draft + încărcare coș
onMounted(() => {
  loadCart()
  const d = localStorage.getItem('checkout_draft')
  if (d) {
    try {
      const v = JSON.parse(d)
      Object.assign(form, v.form || {})
      if (Array.isArray(v.items) && !cartItems.value.length) cartItems.value = v.items
    } catch {}
  }
})

// format numere
const fmt = (n) => new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-semibold mb-6">Finalizare comandă</h1>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- formular -->
      <section class="lg:col-span-2 space-y-4">
        <div class="card p-6 space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Nume și prenume</label>
              <input
                class="input w-full"
                :class="touched.nume && errors.nume ? 'ring-1 ring-red-500' : ''"
                v-model="form.nume"
                @blur="markTouched('nume')"
                placeholder="Ex: Popescu Andrei"
                autocomplete="name"
              />
              <p v-if="touched.nume && errors.nume" class="text-red-600 text-sm mt-1">{{ errors.nume }}</p>
            </div>

            <div>
              <label class="block mb-1">Email</label>
              <input
                class="input w-full"
                :class="touched.email && errors.email ? 'ring-1 ring-red-500' : ''"
                v-model="form.email"
                @blur="markTouched('email')"
                placeholder="exemplu@email.com"
                autocomplete="email"
              />
              <p v-if="touched.email && errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block mb-1">Telefon</label>
              <input
                class="input w-full"
                :class="touched.telefon && errors.telefon ? 'ring-1 ring-red-500' : ''"
                v-model="form.telefon"
                @blur="markTouched('telefon')"
                placeholder="+40 7xx xxx xxx"
                autocomplete="tel"
              />
              <p v-if="touched.telefon && errors.telefon" class="text-red-600 text-sm mt-1">{{ errors.telefon }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1">Adresă livrare</label>
              <textarea
                class="input w-full min-h-[96px]"
                :class="touched.adresa && errors.adresa ? 'ring-1 ring-red-500' : ''"
                v-model="form.adresa"
                @blur="markTouched('adresa')"
                placeholder="Stradă, nr., bloc, localitate"
              ></textarea>
              <p v-if="touched.adresa && errors.adresa" class="text-red-600 text-sm mt-1">{{ errors.adresa }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1">Observații (opțional)</label>
              <textarea class="input w-full min-h-[96px]" v-model="form.observatii" placeholder="Detalii livrare, program, interfon..."></textarea>
            </div>
          </div>

          <label class="mt-1 flex items-start gap-3">
            <input type="checkbox" v-model="form.acceptGDPR" @blur="markTouched('acceptGDPR')" class="mt-1" />
            <span class="text-sm">Sunt de acord cu prelucrarea datelor pentru procesarea comenzii.</span>
          </label>
          <p v-if="touched.acceptGDPR && errors.acceptGDPR" class="text-red-600 text-sm mt-1">{{ errors.acceptGDPR }}</p>

          <div class="mt-6 flex gap-3">
            <button class="btn-primary" :disabled="!isValid || sending" @click="submitOrder">
              {{ sending ? 'Se trimite…' : 'Plasează comanda' }}
            </button>
            <router-link class="btn-outline" to="/cart">Înapoi la coș</router-link>
          </div>

          <p v-if="eroare" class="text-red-600 text-sm mt-3">{{ eroare }}</p>
          <p v-if="succes" class="text-green-700 text-sm mt-3">Comanda a fost trimisă. Mulțumim!</p>
        </div>
      </section>

      <!-- sumar coș -->
      <aside class="card p-6 h-fit lg:sticky lg:top-20">
        <h2 class="text-lg font-medium mb-4">Sumar comandă</h2>

        <div v-if="!cartItems.length" class="text-sm opacity-75">Coșul este gol.</div>

        <div v-else class="space-y-3">
          <div v-for="it in cartItems" :key="it.id" class="flex items-center gap-3">
            <img :src="it.imagine" alt="" class="w-16 h-16 object-cover rounded border dark:border-gray-700" />
            <div class="flex-1">
              <p class="font-medium">{{ it.nume }}</p>
              <div class="text-sm opacity-75">{{ fmt(it.pret) }} RON</div>
              <div class="text-xs opacity-70">Cantitate: {{ it.qty }}</div>
              <div class="mt-1 flex items-center gap-2 text-xs">
                <button class="btn-outline px-2 py-1" @click="dec(it)">−</button>
                <button class="btn-outline px-2 py-1" @click="inc(it)">+</button>
                <button class="underline" @click="remove(it)">Șterge</button>
              </div>
            </div>
          </div>

          <div class="border-t dark:border-gray-700 pt-3 mt-2 flex justify-between text-sm">
            <span>Subtotal</span><span>{{ fmt(subtotal) }} RON</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Transport</span><span>{{ fmt(shipping) }} RON</span>
          </div>
          <div class="border-t dark:border-gray-700 pt-3 mt-2 flex justify-between font-semibold">
            <span>Total</span><span>{{ fmt(total) }} RON</span>
          </div>

          <p v-if="errors.cart" class="text-red-600 text-sm">{{ errors.cart }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>
