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
const schite = ref([]) // [{ name, data }]

const succes = ref(false)
const eroare = ref('')

// precompletare produs din query: /oferta?produs=Nume
onMounted(() => {
  if (route.query.produs) produs.value = String(route.query.produs)
})

function onFileChange(e) {
  const files = Array.from(e.target.files || [])
  eroare.value = ''
  if (!files.length) return

  for (const file of files) {
    if (!/\.jpe?g$/i.test(file.name)) {
      eroare.value = 'Încarcă doar fișiere JPG/JPEG.'
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      eroare.value = 'Dimensiune maximă 10MB per fișier.'
      return
    }
  }

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      schite.value.push({ name: file.name, data: reader.result })
    }
    reader.readAsDataURL(file)
  })
}

function removeSchita(index) {
  schite.value.splice(index, 1)
}

function trimite() {
  eroare.value = ''
  if (!nume.value || !telefon.value) {
    eroare.value = 'Completează nume și telefon.'
    return
  }
  const oferta = {
    id: crypto.randomUUID(),
    produs: produs.value,
    nume: nume.value,
    telefon: telefon.value,
    email: email.value,
    mesaj: mesaj.value,
    schite: schite.value, // array cu imagini
    createdAt: new Date().toISOString()
  }
  try {
    const list = JSON.parse(localStorage.getItem('oferte') || '[]')
    list.push(oferta)
    localStorage.setItem('oferte', JSON.stringify(list))
    succes.value = true
    // reset câmpuri
    mesaj.value = ''
    schite.value = []
  } catch {
    eroare.value = 'Eroare la salvare.'
  }
}

function mergiAcasa() {
  router.push('/')
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cere o ofertă</h1>

    <div class="grid gap-6">
      <!-- ghid scurt -->
      <div class="p-4 rounded border bg-gray-50">
        <p class="font-medium mb-2">Ghid schiță (scurt):</p>
        <ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Măsoară pereții (lungime/înălțime).</li>
          <li>Desenează o schiță simplă cu dimensiuni.</li>
          <li>Fă 2–3 poze ale spațiului.</li>
        </ul>
      </div>

      <div class="p-4 rounded border">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm mb-1">Produs / Proiect</label>
            <input v-model="produs" type="text" class="w-full border rounded p-2"
              placeholder="Ex: Dulap dormitor Model X" />
          </div>

          <div>
            <label class="block text-sm mb-1">Nume *</label>
            <input v-model="nume" type="text" class="w-full border rounded p-2" />
          </div>

          <div>
            <label class="block text-sm mb-1">Telefon *</label>
            <input v-model="telefon" type="tel" class="w-full border rounded p-2" placeholder="07xxxxxxxx" />
          </div>

          <div>
            <label class="block text-sm mb-1">Email</label>
            <input v-model="email" type="email" class="w-full border rounded p-2" placeholder="optional" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm mb-1">Mesaj</label>
            <textarea v-model="mesaj" rows="4" class="w-full border rounded p-2"
              placeholder="Dimensiuni aproximative, preferințe materiale/culori..."></textarea>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm mb-2">Încarcă schițe (JPG/JPEG, max 10MB fiecare)</label>
            <input type="file" accept=".jpg,.jpeg" multiple @change="onFileChange" />

            <div v-if="schite.length" class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-for="(s, i) in schite" :key="i" class="relative">
                <img :src="s.data" :alt="s.name"
                  class="h-40 w-full object-contain border rounded p-2 bg-gray-50" />
                <button @click="removeSchita(i)"
                  class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  title="Șterge">
                  ✕
                </button>
                <p class="mt-1 text-xs text-gray-600 truncate">{{ s.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button @click="trimite" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Trimite
            cererea</button>
          <button @click="mergiAcasa" class="px-4 py-2 border rounded">Înapoi</button>
        </div>

        <p v-if="eroare" class="mt-3 text-sm text-red-600">{{ eroare }}</p>
        <p v-if="succes" class="mt-3 text-sm text-green-700">Cererea a fost salvată. Te contactăm în curând.</p>
      </div>
    </div>
  </div>
</template>
