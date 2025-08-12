<script setup>
import { ref, onMounted } from 'vue'
import { getCart, removeFromCart, clearCart, cartTotal } from '@/utils/cart'

const items = ref([])
const total = ref(0)

function loadCart() {
  items.value = getCart()
  total.value = cartTotal()
}

function deleteItem(id) {
  removeFromCart(id)
  loadCart()
}

function emptyCart() {
  clearCart()
  loadCart()
}

onMounted(() => {
  loadCart()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Coș de cumpărături</h1>

    <div v-if="!items.length" class="p-4 border rounded text-center">
      Coșul este gol.
    </div>

    <div v-else>
      <div
        v-for="p in items"
        :key="p.id"
        class="flex justify-between items-center border-b py-3"
      >
        <div>
            <img v-if="p.imagine" :src="p.imagine" alt="" class="w-16 h-16 object-cover rounded" />

          <div class="font-medium">{{ p.nume }}</div>
          <div class="text-gray-500">{{ p.pret }} RON</div>
          <div class="text-sm text-gray-400">Cantitate: {{ p.qty }}</div>
        </div>
        <button
          @click="deleteItem(p.id)"
          class="text-red-600 hover:underline"
        >
          Șterge
        </button>
      </div>

      <div class="mt-4 flex justify-between font-semibold">
        <span>Total:</span>
        <span>{{ total }} RON</span>
      </div>

      <div class="mt-4 flex gap-2">
        <button
          @click="emptyCart"
          class="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Golește coșul
        </button>
        <router-link
          to="/formular"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cere ofertă
        </router-link>
      </div>
    </div>
  </div>
</template>
