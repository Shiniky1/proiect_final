<script setup>
defineProps({ produs: { type: Object, required: true } })
</script>

<template>
  <div class="card overflow-hidden hover:shadow-lg transition">
    <img
      :src="produs.imagine"
      :alt="produs.nume"
      class="w-full h-56 object-cover border-b dark:border-gray-700"
      loading="lazy"
    />
    <div class="p-4 space-y-2">
      <h3 class="text-lg font-semibold leading-snug">{{ produs.nume }}</h3>
      <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {{ produs.descriere }}
      </p>
      <div class="flex flex-wrap gap-2 text-xs opacity-80">
        <span v-if="produs.categorie" class="px-2 py-1 rounded border dark:border-gray-700">{{ produs.categorie }}</span>
        <span v-if="produs.material" class="px-2 py-1 rounded border dark:border-gray-700">{{ produs.material }}</span>
      </div>
    </div>
  </div>
</template>
