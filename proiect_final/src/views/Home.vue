<script setup>
</script>

<template>
  <section class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-[var(--color-surface,#F7F3EA)] to-[rgba(210,180,140,0.25)] dark:from-[#231814] dark:to-[#2b1d17]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h1 class="font-serif text-4xl lg:text-6xl font-semibold leading-tight text-[var(--color-text-primary,#1f2937)] dark:text-[#F5E9DD]">
            Mobilier <span class="text-[var(--color-primary,#8B4513)]">unic</span>, creat pe măsură
          </h1>
          <p class="text-lg text-text-secondary dark:text-gray-300 max-w-xl">
            Îmbinăm meșteșugul local cu tehnologia modernă pentru piese de mobilier personalizate — durabile, estetice, perfect adaptate spațiului tău.
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <RouterLink to="/catalog" class="btn-primary text-center">Vezi catalogul</RouterLink>
            <RouterLink to="/oferta" class="btn-primary text-center">Cere o ofertă</RouterLink>
          </div>
        </div>
        <div class="relative rounded-xl overflow-hidden workshop-shadow">
          <div class="aspect-video bg-gradient-to-br from-[rgba(139,69,19,.12)] to-[rgba(205,133,63,.2)] dark:from-[rgba(139,69,19,.25)] dark:to-[rgba(205,133,63,.25)]">
            <img
              src="@/assets/home.webp"
              alt="Atelier mobilier la comandă"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/20 dark:bg-black/30"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-6">
        <div class="card p-5">
          <div class="text-3xl font-bold text-[var(--color-primary,#8B4513)]">10+ ani</div>
          <p class="text-text-secondary dark:text-gray-300">Experiență în mobilier personalizat</p>
        </div>
        <div class="card p-5">
          <div class="text-3xl font-bold text-[var(--color-primary,#8B4513)]">300+ piese</div>
          <p class="text-text-secondary dark:text-gray-300">Proiecte livrate clienților</p>
        </div>
        <div class="card p-5">
          <div class="text-3xl font-bold text-[var(--color-primary,#8B4513)]">4.9/5</div>
          <p class="text-text-secondary dark:text-gray-300">Rating mediu satisfacție</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-semibold mb-5">Colecții populare</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="card overflow-hidden">
          <div class="aspect-[4/3]">
            <img class="w-full h-full object-cover" src="@/assets/produs-025.jpg" alt="Bucătării la comandă">
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Bucatarii</h3>
            <RouterLink to="/catalog?cat=bucatarie" class="btn-primary">Vezi modele</RouterLink>
          </div>
        </div>
        <div class="card overflow-hidden">
          <div class="aspect-[4/3]">
            <img class="w-full h-full object-cover" src="@/assets/produs-015.jpg" alt="Dulapuri și dressing">
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Dulapuri</h3>
          <RouterLink to="/catalog?cat=dressing" class="btn-primary">Vezi modele</RouterLink>
          </div>
        </div>
        <div class="card overflow-hidden">
          <div class="aspect-[4/3]">
            <img class="w-full h-full object-cover" src="@/assets/produs-023.jpg" alt="Living și biblioteci">
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Living</h3>
            <RouterLink to="/catalog?cat=living" class="btn-primary">Vezi modele</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-14">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-4">Ai un proiect în minte?</h2>
      <p class="text-text-secondary dark:text-gray-300 mb-6">
        Trimite-ne dimensiunile sau o schiță și revenim cu o propunere de buget și termen.
      </p>
      <RouterLink to="/oferta" class="btn-primary">Cere ofertă</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.workshop-shadow { box-shadow: 0 12px 30px rgba(0,0,0,.08), 0 2px 10px rgba(0,0,0,.06); }
.text-text-secondary { color: var(--color-text-secondary, #6B4E3D); }

</style>
