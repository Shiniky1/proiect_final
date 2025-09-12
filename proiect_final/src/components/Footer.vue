<template>
  <footer class="wood-bg-footer mt-12 border-t border-amber-200 dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 text-amber-900 dark:text-gray-300">
      
      <div>
        <h2 class="font-semibold mb-2">STO Mob Design</h2>
        <p class="text-sm opacity-80">Mobilier personalizat din PAL și MDF, realizat la comandă cu atenție la detalii.</p>
      </div>

      <div>
        <h2 class="font-semibold mb-2">Link-uri utile</h2>
        <ul class="space-y-1 text-sm">
          <li><RouterLink to="/" class="hover:text-amber-700 transition">Acasă</RouterLink></li>
          <li><RouterLink to="/portofoliu" class="hover:text-amber-700 transition">Portofoliu</RouterLink></li>
          <li><RouterLink to="/contact" class="hover:text-amber-700 transition">Contact</RouterLink></li>
          <li><RouterLink to="/oferta" class="hover:text-amber-700 transition">Cere ofertă</RouterLink></li>
        </ul>
      </div>

      <div>
        <h2 class="font-semibold mb-2">Contact</h2>
        <ul class="text-sm space-y-1">
          <li>📞 0769 239 869</li>
          <li>📧 sto.design09@gmail.com</li>
          <li>📍 Buftea, România</li>
        </ul>
      </div>
    </div>

    <div class="text-center text-xs py-4 border-t border-amber-200 dark:border-gray-700 text-amber-800 dark:text-gray-400">
      © 2025 STO Mob Design. Toate drepturile rezervate.
    </div>
  </footer>
</template>

