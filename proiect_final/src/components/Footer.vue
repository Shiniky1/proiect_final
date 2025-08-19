<template>
  <footer class="wood-bg-footer mt-12 border-t border-gray-200 dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
      
      <div>
        <h2 class="font-semibold mb-2">STO Mob Design</h2>
        <p class="text-sm">Mobilier personalizat din PAL și MDF, realizat la comandă cu atenție la detalii.</p>
      </div>

      <div>
        <h2 class="font-semibold mb-2">Link-uri utile</h2>
        <ul class="space-y-1 text-sm">
          <li><RouterLink to="/" class="hover:underline">Acasă</RouterLink></li>
          <li><RouterLink to="/catalog" class="hover:underline">Catalog</RouterLink></li>
          <li><RouterLink to="/contact" class="hover:underline">Contact</RouterLink></li>
          <li><RouterLink to="/oferta" class="hover:underline">Cere ofertă</RouterLink></li>
        </ul>
      </div>

      <div>
        <h2 class="font-semibold mb-2">Contact</h2>
        <ul class="text-sm space-y-1">
          <li>📞 07xx xxx xxx</li>
          <li>📧 contact@sto-mob.ro</li>
          <li>📍 București, România</li>
        </ul>
      </div>
    </div>

    <div class="text-center text-xs py-4 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
      © 2024 STO Mob Design. Toate drepturile rezervate.
    </div>
  </footer>
</template>
<style>
.wood-bg-footer{
  background-color:#F5F1E6;
  background-image:
    repeating-linear-gradient(90deg,rgba(169,113,66,.06) 0,rgba(169,113,66,.06) 2px,transparent 2px,transparent 6px),
    linear-gradient(0deg,rgba(169,113,66,.05),rgba(169,113,66,.02) 60%,rgba(169,113,66,.05)),
    linear-gradient(#F5F1E6,#F5F1E6);
}
.dark .wood-bg-footer{
  background-color:#2A1B14;
  background-image:
    repeating-linear-gradient(90deg,rgba(193,135,90,.10) 0,rgba(193,135,90,.10) 2px,transparent 2px,transparent 6px),
    linear-gradient(0deg,rgba(161,113,77,.12),rgba(161,113,77,.06) 60%,rgba(161,113,77,.12)),
    linear-gradient(#2A1B14,#2A1B14);
}
</style>
