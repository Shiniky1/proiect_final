<script setup>
import { ref } from 'vue'

const nume = ref('')
const email = ref('')
const mesaj = ref('')
const trimis = ref(false)
const eroare = ref('')

function trimiteMesaj() {
  eroare.value = ''
  if (!nume.value.trim() || !email.value.trim() || !mesaj.value.trim()) {
    eroare.value = 'Completează toate câmpurile.'
    return
  }
  trimis.value = true
  nume.value = ''
  email.value = ''
  mesaj.value = ''
  setTimeout(() => (trimis.value = false), 4000)
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-12">
    <!-- titlu -->
    <header class="text-center space-y-2">
      <h1 class="text-3xl font-bold">Contact</h1>
      <p class="text-text-secondary dark:text-gray-300">Răspundem L–V, 09:00–18:00.</p>
    </header>

    <!-- info + formular -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- info -->
      <section class="card p-6 space-y-6">
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 mt-1 text-[var(--color-primary,#8B4513)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>
            <div>
              <p class="font-medium">Adresă</p>
              <p class="text-sm text-text-secondary dark:text-gray-300">Buftea, Ilfov</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 mt-1 text-[var(--color-primary,#8B4513)]" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.8 15.8 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.23c1.2.48 2.5.73 3.9.73a1 1 0 0 1 1 1V20a2 2 0 0 1-2 2C10.4 22 2 13.6 2 3a2 2 0 0 1 2-2h3.3a1 1 0 0 1 1 1c0 1.4.25 2.7.73 3.9a1 1 0 0 1-.23 1.1L6.6 10.8Z"/></svg>
            <div>
              <p class="font-medium">Telefon</p>
              <a href="tel:+40700000000" class="text-sm text-blue-700 dark:text-blue-400 hover:underline">+40 700 000 000</a>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 mt-1 text-[var(--color-primary,#8B4513)]" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>
            <div>
              <p class="font-medium">Email</p>
              <a href="mailto:contact@stomobdesign.ro" class="text-sm text-blue-700 dark:text-blue-400 hover:underline">contact@stomobdesign.ro</a>
            </div>
          </div>
        </div>

        <!-- social -->
        <div class="bg-white/70 dark:bg-gray-900/70 border dark:border-gray-700 rounded-lg p-4">
          <p class="font-medium mb-3">Urmărește-ne</p>
          <div class="flex flex-wrap gap-3">
            <a href="https://facebook.com" target="_blank"
               class="inline-flex items-center gap-2 px-3 py-2 rounded-full text-white shadow transition hover:scale-[1.02]"
               style="background: linear-gradient(135deg,#1877F2,#1461C6);">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h4a1 1 0 0 1 1 1v3h-3a1 1 0 0 0-1 1v3h4l-1 4h-3v6h-4v-6H7v-4h3V8a5 5 0 0 1 5-5Z"/></svg>
              <span class="text-sm">Facebook</span>
            </a>
            <a href="https://instagram.com" target="_blank"
               class="inline-flex items-center gap-2 px-3 py-2 rounded-full text-white shadow transition hover:scale-[1.02]"
               style="background: radial-gradient(120% 120% at 30% 20%,#FEDA75 0%,#FA7E1E 35%,#D62976 55%,#962FBF 75%,#4F5BD5 100%);">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.5-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"/></svg>
              <span class="text-sm">Instagram</span>
            </a>
          </div>
        </div>
      </section>

      <!-- formular -->
      <section class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Trimite-ne un mesaj</h2>
        <div class="space-y-4">
          <input v-model="nume" type="text" placeholder="Nume" class="input" />
          <input v-model="email" type="email" placeholder="Email" class="input" />
          <textarea v-model="mesaj" rows="5" placeholder="Mesaj" class="input"></textarea>
          <div class="flex items-center gap-3">
            <button @click="trimiteMesaj" class="btn-primary">Trimite</button>
            <p v-if="eroare" class="text-sm text-red-600">{{ eroare }}</p>
            <p v-if="trimis" class="text-sm text-green-600">Mesaj trimis. Mulțumim!</p>
          </div>
        </div>
      </section>
    </div>

    <!-- proces -->
    <section class="card p-6">
      <h2 class="text-2xl font-semibold mb-6 text-center">Procesul nostru</h2>

      <!-- desktop -->
      <div class="hidden md:grid grid-cols-4 gap-6">
        <div class="step text-center px-3">
          <div class="step-bullet">1</div>
          <h3 class="mt-3 font-semibold">Ne contactezi</h3>
          <p class="text-sm text-text-secondary dark:text-gray-300">Telefon, email sau formularul de mai sus.</p>
        </div>
        <div class="step text-center px-3">
          <div class="step-bullet">2</div>
          <h3 class="mt-3 font-semibold">Măsurători</h3>
          <p class="text-sm text-text-secondary dark:text-gray-300">Stabilim detaliile și dimensiunile.</p>
        </div>
        <div class="step text-center px-3">
          <div class="step-bullet">3</div>
          <h3 class="mt-3 font-semibold">Proiectare</h3>
          <p class="text-sm text-text-secondary dark:text-gray-300">Propuneri vizuale și ofertă.</p>
        </div>
        <div class="step text-center px-3">
          <div class="step-bullet">4</div>
          <h3 class="mt-3 font-semibold">Livrare & montaj</h3>
          <p class="text-sm text-text-secondary dark:text-gray-300">Producție, livrare și montaj la timp.</p>
        </div>
      </div>

      <!-- mobil -->
      <div class="md:hidden grid grid-cols-1 gap-4">
        <div class="step-card">
          <div class="step-chip">1</div>
          <div><h3 class="font-semibold">Ne contactezi</h3><p class="text-sm text-text-secondary dark:text-gray-300">Telefon, email sau formular.</p></div>
        </div>
        <div class="step-card">
          <div class="step-chip">2</div>
          <div><h3 class="font-semibold">Măsurători</h3><p class="text-sm text-text-secondary dark:text-gray-300">Stabilim dimensiunile exacte.</p></div>
        </div>
        <div class="step-card">
          <div class="step-chip">3</div>
          <div><h3 class="font-semibold">Proiectare</h3><p class="text-sm text-text-secondary dark:text-gray-300">Propuneri și ofertă.</p></div>
        </div>
        <div class="step-card">
          <div class="step-chip">4</div>
          <div><h3 class="font-semibold">Livrare & montaj</h3><p class="text-sm text-text-secondary dark:text-gray-300">Producție și montaj.</p></div>
        </div>
      </div>
    </section>

    <!-- hartă -->
    <section class="card overflow-hidden">
      <iframe
        class="w-full h-[320px]"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2821.642702509314!2d25.94580117640427!3d44.5614431710726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f8a2a6a26e6f%3A0x5c7fbb65d0a8e10!2sBuftea!5e0!3m2!1sro!2sro!4v1691849723456!5m2!1sro!2sro"
        style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  </div>
</template>

<style scoped>
.step { animation: fadeUp .5s ease both; }
.step:nth-child(2){ animation-delay:.05s }
.step:nth-child(3){ animation-delay:.1s }
.step:nth-child(4){ animation-delay:.15s }

.step-bullet{
  margin: 0 auto; width: 3rem; height: 3rem; border-radius: 9999px;
  display: flex; align-items: center; justify-content: center; color: #fff;
  background: linear-gradient(135deg, var(--color-primary,#8B4513), #B87333);
  box-shadow: 0 12px 30px rgba(0,0,0,.12);
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}
.step:hover .step-bullet{ transform: translateY(-3px) scale(1.03); filter: brightness(1.05); box-shadow: 0 16px 35px rgba(0,0,0,.16); }

.step-card{
  display:flex; gap:.75rem; align-items:center; padding:1rem; border-radius:.75rem;
  border:1px solid rgba(0,0,0,.06); background: rgba(255,255,255,.7);
}
:global(.dark) .step-card{ border-color: rgba(255,255,255,.08); background: rgba(17,24,39,.7); }
.step-chip{
  width:2.5rem; height:2.5rem; border-radius:9999px; display:flex; align-items:center; justify-content:center; color:#fff;
  background: linear-gradient(135deg, var(--color-primary,#8B4513), #B87333);
}

@keyframes fadeUp{ from{ opacity:0; transform:translateY(8px) } to{ opacity:1; transform:translateY(0) } }
</style>
