<script setup>
import { ref } from 'vue'
import axios from 'axios'

const AXIOS_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5174'

const nume = ref('')
const email = ref('')
const telefon = ref('')
const mesaj = ref('')
const files = ref([])       
const previews = ref([])       

const sending = ref(false)
const trimis = ref(false)
const eroare = ref('')

function validEmail(v) { return /^\S+@\S+\.\S+$/.test(v) }
function validPhone(v) { return /^[0-9+\s-]{7,}$/.test(v) }

function onFiles(e) {
  const list = Array.from(e.target.files || [])
  files.value = list
  // previews
  previews.value = list.map(f => URL.createObjectURL(f))
}

async function trimiteMesaj() {
  eroare.value = ''

  if (!nume.value.trim() || !email.value.trim() || !telefon.value.trim() || !mesaj.value.trim()) {
    eroare.value = 'Completează toate câmpurile.'
    return
  }
  if (!validEmail(email.value)) { eroare.value = 'Email invalid.'; return }
  if (!validPhone(telefon.value)) { eroare.value = 'Telefon invalid.'; return }


  const fd = new FormData()
  fd.append('produs', '[CONTACT] Mesaj de pe site')
  fd.append('nume', nume.value.trim())
  fd.append('telefon', telefon.value.trim())
  fd.append('email', email.value.trim())
  fd.append('mesaj', mesaj.value.trim())

 
  for (const f of files.value) {
    fd.append('schite', f)
  }

  sending.value = true
  try {
    await axios.post(`${AXIOS_BASE}/api/oferta`, fd )
    trimis.value = true
    // reset
    nume.value = ''; email.value = ''; telefon.value = ''; mesaj.value = ''
    files.value = []; previews.value = []
    setTimeout(() => (trimis.value = false), 4000)
  } catch (e) {
    console.error(e)
    eroare.value = 'Nu am putut trimite mesajul. Încearcă din nou.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-12">
    <header class="text-center space-y-2">
      <h1 class="text-3xl font-bold">Contactează-ne</h1>
      <p class="text-gray-600 dark:text-gray-400">Răspundem L–V, 09:00–18:00.</p>
    </header>

    <div class="grid lg:grid-cols-2 gap-8">
      <section class="space-y-6">
        <div class="bg-white/70 dark:bg-gray-900/70 shadow rounded-lg p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full">📍</div>
            <div>
              <p class="font-semibold">Adresă</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Buftea, Ilfov</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full">📞</div>
            <div>
              <p class="font-semibold">Telefon</p>
              <a href="tel:+40700000000" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">+40 769 239 869</a>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full">✉️</div>
            <div>
              <p class="font-semibold">Email</p>
              <a href="mailto:contact@stomobdesign.ro" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">sto.design09@gmail.com</a>
            </div>
          </div>
        </div>

        <div class="rounded-lg overflow-hidden shadow">
          <iframe
            class="w-full h-[250px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2821.642702509314!2d25.94580117640427!3d44.5614431710726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f8a2a6a26e6f%3A0x5c7fbb65d0a8e10!2sBuftea!5e0!3m2!1sro!2sro!4v1691849723456!5m2!1sro!2sro"
            style="border:0;" allowfullscreen="" loading="lazy"
          ></iframe>
        </div>
      </section>

      <section class="bg-white/70 dark:bg-gray-900/70 shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Trimite-ne un mesaj</h2>
        <div class="space-y-4">
          <input v-model="nume" type="text" placeholder="Nume" class="input w-full" />
          <input v-model="email" type="email" placeholder="Email" class="input w-full" />
          <input v-model="telefon" type="text" placeholder="Telefon" class="input w-full" />
          <textarea v-model="mesaj" rows="5" placeholder="Mesaj" class="input w-full"></textarea>

          <!-- input fișiere -->
          <!-- <div class="space-y-2">
            <input type="file" multiple accept="image/*" @change="onFiles" class="block text-sm" />
            <div v-if="previews.length" class="grid grid-cols-3 gap-2">
              <img v-for="(src,i) in previews" :key="i" :src="src" class="w-full h-24 object-cover rounded border dark:border-gray-700" />
            </div>
          </div> -->

          <div class="flex items-center gap-3">
            <button @click="trimiteMesaj" class="btn-primary" :disabled="sending">
              {{ sending ? 'Se trimite…' : 'Trimite' }}
            </button>
            <p v-if="eroare" class="text-sm text-red-600">{{ eroare }}</p>
            <p v-if="trimis" class="text-sm text-green-600">Mesaj trimis. Mulțumim!</p>
          </div>
        </div>
      </section>
    </div>

    <section class="grid md:grid-cols-4 gap-6">
      <div class="bg-white/70 dark:bg-gray-900/70 p-4 rounded-lg shadow text-center">
        <h3 class="font-semibold mb-1">1. Ne contactezi</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Telefon, email sau formular.</p>
      </div>
      <div class="bg-white/70 dark:bg-gray-900/70 p-4 rounded-lg shadow text-center">
        <h3 class="font-semibold mb-1">2. Măsurători</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Stabilim dimensiunile exacte.</p>
      </div>
      <div class="bg-white/70 dark:bg-gray-900/70 p-4 rounded-lg shadow text-center">
        <h3 class="font-semibold mb-1">3. Proiectare</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Propuneri și ofertă.</p>
      </div>
      <div class="bg-white/70 dark:bg-gray-900/70 p-4 rounded-lg shadow text-center">
        <h3 class="font-semibold mb-1">4. Livrare & montaj</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Producție și montaj.</p>
      </div>
    </section>
  </div>
</template>
