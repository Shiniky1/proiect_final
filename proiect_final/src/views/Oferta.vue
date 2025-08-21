<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// câmpuri formular
const produs = ref('')
const nume = ref('')
const telefon = ref('')
const email = ref('')
const mesaj = ref('')

// imagini încărcate
const schite = ref([]) // [{ name, data }]
const dragging = ref(false)

const succes = ref(false)
const eroare = ref('')

// precompletare: /oferta?produs=...
onMounted(() => {
  if (route.query.produs) produs.value = String(route.query.produs)
})

// validare + citire fișiere
function handleFiles(filesList) {
  const files = Array.from(filesList || [])
  for (const f of files) {
    if (!/\.jpe?g$/i.test(f.name)) { eroare.value = 'Încarcă doar JPG/JPEG.'; return }
    if (f.size > 10 * 1024 * 1024) { eroare.value = 'Maxim 10MB per fișier.'; return }
  }
  files.forEach(f => {
    const reader = new FileReader()
    reader.onload = () => schite.value.push({ name: f.name, data: reader.result })
    reader.readAsDataURL(f)
  })
}

function onFileInput(e) {
  eroare.value = ''
  handleFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  e.preventDefault()
  dragging.value = false
  eroare.value = ''
  handleFiles(e.dataTransfer.files)
}

function removeSchita(i) {
  schite.value.splice(i, 1)
}

function trimite() {
  eroare.value = ''
  if (!nume.value.trim() || !telefon.value.trim()) {
    eroare.value = 'Completează nume și telefon.'
    return
  }
  const oferta = {
    id: crypto.randomUUID(),
    produs: produs.value.trim(),
    nume: nume.value.trim(),
    telefon: telefon.value.trim(),
    email: email.value.trim(),
    mesaj: mesaj.value.trim(),
    schite: schite.value,
    createdAt: new Date().toISOString()
  }
  try {
    const list = JSON.parse(localStorage.getItem('oferte') || '[]')
    list.push(oferta)
    localStorage.setItem('oferte', JSON.stringify(list))
    succes.value = true
    mesaj.value = ''
    schite.value = []
    setTimeout(() => succes.value = false, 4000)
  } catch {
    eroare.value = 'Eroare la salvare.'
  }
}

function inapoi() { router.push('/') }
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-10">
    <!-- titlu -->
    <header class="text-center space-y-2">
      <h1 class="text-3xl font-bold">Cere o ofertă</h1>
      <p class="text-gray-600 dark:text-gray-400">Completează detaliile și atașează schițe (JPG). Răspundem rapid.</p>
    </header>

    <!-- ghid + formular -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- ghid -->
      <aside class="lg:col-span-1 space-y-6">
        <div class="card p-6 space-y-4">
          <h2 class="text-lg font-semibold">Ghid rapid</h2>
          <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>Măsoară pereții (L × H) și notează prize/țevi/ferestre.</li>
            <li>Desenează o schiță simplă cu dimensiuni.</li>
            <li>Fă 2–3 poze ale spațiului (opțional).</li>
          </ul>
          <div class="rounded-lg p-3 text-sm bg-white/70 dark:bg-gray-900/70 border dark:border-gray-700">
            <p class="font-medium mb-1">Recomandări fișiere</p>
            <p>Format: JPG/JPEG • Max: 10MB/fișier • Poți încărca mai multe imagini.</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold">1</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Discuție inițială</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold">2</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Măsurători</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold">3</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Proiect & ofertă</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold">4</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Producție & montaj</p>
          </div>
        </div>
      </aside>

      <!-- formular -->
      <section class="lg:col-span-2 card p-6 space-y-6">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm mb-1">Produs / Proiect</label>
            <input v-model="produs" type="text" class="input w-full" placeholder="Ex: Bucătărie colț, dressing, bibliotecă" />
          </div>

          <div>
            <label class="block text-sm mb-1">Nume *</label>
            <input v-model="nume" type="text" class="input w-full" autocomplete="name" />
          </div>

          <div>
            <label class="block text-sm mb-1">Telefon *</label>
            <input v-model="telefon" type="tel" class="input w-full" placeholder="07xxxxxxxx" autocomplete="tel" />
          </div>

          <div>
            <label class="block text-sm mb-1">Email</label>
            <input v-model="email" type="email" class="input w-full" placeholder="optional" autocomplete="email" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm mb-1">Mesaj</label>
            <textarea v-model="mesaj" rows="4" class="input w-full" placeholder="Dimensiuni, materiale/culori dorite, buget estimat..."></textarea>
          </div>
        </div>

        <!-- upload -->
        <div class="space-y-3">
          <label class="block text-sm">Încarcă schițe (JPG/JPEG)</label>

          <div
            class="rounded-lg border-2 border-dashed dark:border-gray-700 p-6 text-center transition bg-white/60 dark:bg-gray-900/60"
            :class="dragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' : ''"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop="onDrop"
          >
            <p class="text-sm mb-3">Trage fișiere aici sau</p>
            <label class="inline-block">
              <input type="file" accept=".jpg,.jpeg" multiple class="hidden" @change="onFileInput" />
              <span class="btn-outline cursor-pointer">Selectează imagini</span>
            </label>
            <p class="text-xs mt-2 text-gray-500">Doar JPG/JPEG • Max 10MB/fișier</p>
          </div>

          <div v-if="schite.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div v-for="(s,i) in schite" :key="i" class="relative">
              <img :src="s.data" :alt="s.name" class="h-40 w-full object-contain border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 p-2" />
              <button @click="removeSchita(i)" class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700">✕</button>
              <p class="mt-1 text-xs text-gray-600 dark:text-gray-300 truncate">{{ s.name }}</p>
            </div>
          </div>
        </div>

        <!-- acțiuni -->
        <div class="flex flex-wrap gap-2">
          <button class="btn-primary" @click="trimite">Trimite cererea</button>
          <button class="btn-outline" @click="inapoi">Înapoi</button>
        </div>

        <p v-if="eroare" class="text-sm text-red-600">{{ eroare }}</p>
        <p v-if="succes" class="text-sm text-green-700">Cererea a fost salvată. Te contactăm în curând.</p>
      </section>
    </div>
  </div>
</template>
