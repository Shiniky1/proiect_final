<script setup>
import { ref, onMounted } from 'vue'

const oferte = ref([])
const selectImg = ref(null) // preview mare

function load() {
  try {
    const list = JSON.parse(localStorage.getItem('oferte') || '[]')
    oferte.value = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch {
    oferte.value = []
  }
}

function removeOferta(id) {
  const list = oferte.value.filter(o => o.id !== id)
  localStorage.setItem('oferte', JSON.stringify(list))
  oferte.value = list
}

onMounted(load)
</script>

<template>
  <div class="max-w-6xl mx-auto p-4">
    <div class="flex items-end justify-between mb-4">
      <h1 class="text-2xl font-bold">Oferte primite</h1>
      <span class="text-sm text-gray-500">Total: {{ oferte.length }}</span>
    </div>

    <div v-if="!oferte.length" class="p-6 text-center border rounded">
      Nu există oferte salvate.
    </div>

    <div v-else class="grid md:grid-cols-2 gap-4">
      <div v-for="o in oferte" :key="o.id" class="border rounded p-4 space-y-2">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">{{ new Date(o.createdAt).toLocaleString() }}</div>
          <button @click="removeOferta(o.id)" class="px-3 py-1 border rounded text-red-600 hover:bg-red-50">
            Șterge
          </button>
        </div>

        <div class="font-semibold">{{ o.produs || '—' }}</div>

        <div class="grid sm:grid-cols-2 gap-2 text-sm">
          <div><span class="font-medium">Nume:</span> {{ o.nume }}</div>
          <div><span class="font-medium">Telefon:</span> {{ o.telefon }}</div>
          <div class="sm:col-span-2 break-words">
            <span class="font-medium">Email:</span> {{ o.email || '—' }}
          </div>
        </div>

        <div class="text-sm whitespace-pre-line bg-gray-50 p-2 rounded">
          {{ o.mesaj || 'Fără mesaj' }}
        </div>

        <!-- miniaturi schițe -->
        <div v-if="o.schite?.length" class="grid grid-cols-3 gap-2">
          <button
            v-for="(s, i) in o.schite"
            :key="i"
            class="relative group"
            @click="selectImg = s.data"
            title="Deschide"
          >
            <img :src="s.data" :alt="s.name" class="h-24 w-full object-contain border rounded p-1 bg-white" />
            <span class="absolute bottom-1 left-1 right-1 text-[10px] bg-black/60 text-white px-1 rounded opacity-0 group-hover:opacity-100 truncate">
              {{ s.name }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- overlay preview mare -->
    <div
      v-if="selectImg"
      class="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
      @click.self="selectImg = null"
    >
      <div class="max-w-4xl w-full">
        <img :src="selectImg" alt="" class="w-full max-h-[80vh] object-contain rounded shadow" />
        <div class="mt-3 flex justify-end">
          <button @click="selectImg = null" class="px-4 py-2 bg-white rounded">Închide</button>
        </div>
      </div>
    </div>
  </div>
</template>
