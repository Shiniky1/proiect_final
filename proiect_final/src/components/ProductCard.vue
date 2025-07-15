<template>
  <div class="border p-4 rounded shadow hover:shadow-md transition">
    <img
      :src="produs.imagine"
      alt="Imagine produs"
      class="mb-3 w-full h-48 object-cover rounded"
    />
    <h2 class="text-xl font-semibold">{{ produs.nume }}</h2>
    <p class="text-gray-600">{{ produs.descriere }}</p>
    <p class="font-bold mt-2">{{ produs.pret }} RON</p>
    <router-link
      :to="`/produs/${produs.id}`"
      class="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Vezi detalii
    </router-link>
  </div>
</template>


<script setup>
defineProps({
  produs: {
    type: Object,
    required: true
  }
})
</script>
