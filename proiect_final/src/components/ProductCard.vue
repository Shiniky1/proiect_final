<template>
  <div class="card p-3 flex flex-col">
    <div class="aspect-[4/3] bg-white dark:bg-gray-900 border dark:border-gray-700 rounded mb-3 overflow-hidden">
      <img :src="produs.imagine" :alt="produs.nume" class="w-full h-full object-cover" />
    </div>

    <h3 class="font-semibold text-base mb-1">{{ produs.nume }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{{ produs.descriere }}</p>
    <div class="font-bold mb-3">{{ produs.pret }} RON</div>

    <div class="mt-auto grid grid-cols-2 gap-2">
      <button class="btn-outline" @click="$emit('add-to-cart', produs)">Adaugă în coș</button>
      <RouterLink
        :to="`/oferta?produs=${encodeURIComponent(produs.nume)}`"
        class="btn-primary text-center"
      >
        Cere ofertă
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  produs: { type: Object, required: true }
})
defineEmits(['add-to-cart'])
</script>
