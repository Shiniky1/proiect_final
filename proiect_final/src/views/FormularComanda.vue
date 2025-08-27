<script setup>
import { reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCart, updateQty, removeFromCart, clearCart } from '@/utils/cart'
import axios from 'axios'

const router = useRouter()
const AXIOS_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5174'

// formular + state
const form = reactive({
  nume: '',
  email: '',
  telefon: '',
  adresa: '',
  observatii: '',
  acceptGDPR: false,
})
const touched = reactive({})
const cart = reactive({ items: getCart() })

const total = computed(() =>
  cart.items.reduce((s, it) => s + Number(it.pret || 0) * (it.qty || 1), 0)
)

watch(cart.items, () => {
  // draft local, util dacă se închide tab-ul
  localStorage.setItem('checkout_draft', JSON.stringify({ form, items: cart.items }))
}, { deep: true })

const errors = computed(() => {
  const e = {}
  if (!form.nume.trim()) e.nume = 'Te rugăm să introduci numele.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email invalid.'
  if (!/^[0-9+\s-]{7,}$/.test(form.telefon)) e.telefon = 'Telefon invalid.'
  if (!form.adresa.trim()) e.adresa = 'Adresa este obligatorie.'
  if (!form.acceptGDPR) e.acceptGDPR = 'Trebuie să accepți prelucrarea datelor.'
  if (!cart.items.length) e.cart = 'Coșul este gol.'
  return e
})

function markTouched(field){ touched[field] = true }

function inc(it){ updateQty(it.id, (it.qty || 1) + 1); cart.items = getCart() }
function dec(it){ if ((it.qty || 1) > 1){ updateQty(it.id, it.qty - 1); cart.items = getCart() } }
function delItem(id){ removeFromCart(id); cart.items = getCart() }

async function submit() {
  Object.keys(form).forEach(k => touched[k] = true)
  if (Object.keys(errors.value).length) return

  const order = {
    id: 'ORD-' + Date.now(),
    ...form,
    items: cart.items,
    total: total.value,
    createdAt: new Date().toISOString(),
    status: 'plasata'
  }

  // 1) Încearcă API
  try {
    await axios.post(`${AXIOS_BASE}/api/orders`, order)
  } catch {
    // 2) Fallback local
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))
  }

  clearCart()
  localStorage.removeItem('checkout_draft')
  router.push('/user') // sau creează o pagină /comanda-succes
}

function backToCart() {
  router.push('/cart')
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-semibold mb-6">Finalizare comandă</h1>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Formular -->
      <div class="lg:col-span-2 space-y-4">
        <div class="card p-4 lg:p-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Nume și prenume</label>
              <input class="input w-full" v-model="form.nume" @blur="markTouched('nume')" placeholder="Ex: Popescu Andrei" />
              <p v-if="touched.nume && errors.nume" class="text-red-600 text-sm mt-1">{{ errors.nume }}</p>
            </div>

            <div>
              <label class="block mb-1">Email</label>
              <input class="input w-full" v-model="form.email" @blur="markTouched('email')" placeholder="exemplu@email.com" />
              <p v-if="touched.email && errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block mb-1">Telefon</label>
              <input class="input w-full" v-model="form.telefon" @blur="markTouched('telefon')" placeholder="+40 7xx xxx xxx" />
              <p v-if="touched.telefon && errors.telefon" class="text-red-600 text-sm mt-1">{{ errors.telefon }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1">Adresă livrare</label>
              <textarea class="input w-full min-h-[96px]" v-model="form.adresa" @blur="markTouched('adresa')" placeholder="Stradă, număr, bloc/scară, etaj, apartament, localitate"></textarea>
              <p v-if="touched.adresa && errors.adresa" class="text-red-600 text-sm mt-1">{{ errors.adresa }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1">Observații (opțional)</label>
              <textarea class="input w-full min-h-[96px]" v-model="form.observatii" placeholder="Detalii despre program, interfon, etc."></textarea>
            </div>
          </div>

          <label class="mt-4 flex items-start gap-3">
            <input type="checkbox" v-model="form.acceptGDPR" @blur="markTouched('acceptGDPR')" class="mt-1" />
            <span class="text-sm">Sunt de acord cu prelucrarea datelor pentru procesarea comenzii.</span>
          </label>
          <p v-if="touched.acceptGDPR && errors.acceptGDPR" class="text-red-600 text-sm mt-1">{{ errors.acceptGDPR }}</p>

          <div class="mt-6 flex gap-3">
            <button class="btn-primary" @click="submit">Plasează comanda</button>
            <button class="btn-outline" @click="backToCart">Înapoi la coș</button>
          </div>
        </div>
      </div>

      <!-- Sumar coș -->
      <aside class="card p-4 lg:p-6 h-fit lg:sticky lg:top-20">
        <h2 class="text-lg font-medium mb-4">Sumar comandă</h2>

        <div v-if="!cart.items.length" class="text-sm opacity-75">
          Coșul este gol.
        </div>

        <div v-else class="space-y-3">
          <div v-for="it in cart.items" :key="it.id" class="flex items-center gap-3">
            <img :src="it.imagine" alt="" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
              <p class="font-medium">{{ it.nume }}</p>
              <div class="text-sm opacity-75">{{ it.pret }} RON</div>
              <div class="flex items-center gap-2 mt-1">
                <button class="btn-outline px-2" @click="dec(it)">−</button>
                <span class="w-8 text-center">{{ it.qty }}</span>
                <button class="btn-outline px-2" @click="inc(it)">+</button>
                <button class="ml-auto text-sm underline" @click="delItem(it.id)">Șterge</button>
              </div>
            </div>
          </div>

          <div class="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span><span>{{ total }} RON</span>
          </div>
          <p v-if="errors.cart" class="text-red-600 text-sm">{{ errors.cart }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>
