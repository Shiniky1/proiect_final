<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Formular de comandă</h1>

    <form @submit.prevent="trimiteComanda" class="space-y-5">
      <div>
        <label for="nume" class="block text-gray-700 font-medium mb-1">Nume complet *</label>
        <input
          v-model="nume"
          type="text"
          id="nume"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        />
      </div>

      <div>
        <label for="telefon" class="block text-gray-700 font-medium mb-1">Telefon *</label>
        <input
          v-model="telefon"
          type="tel"
          id="telefon"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        />
      </div>

      <div>
        <label for="email" class="block text-gray-700 font-medium mb-1">Email (opțional)</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="exemplu@email.com"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div>
        <label for="adresa" class="block text-gray-700 font-medium mb-1">Adresă de livrare *</label>
        <textarea
          v-model="adresa"
          id="adresa"
          rows="3"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        ></textarea>
      </div>

      <div>
        <label for="observatii" class="block text-gray-700 font-medium mb-1">Observații</label>
        <textarea
          v-model="observatii"
          id="observatii"
          rows="2"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
      >
        Trimite comandă
      </button>
    </form>

    <div
      v-if="mesajSucces"
      class="mt-6 bg-green-100 border border-green-300 text-green-800 font-semibold px-4 py-3 rounded"
    >
      ✅ {{ mesajSucces }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nume = ref('')
const telefon = ref('')
const email = ref('')
const adresa = ref('')
const observatii = ref('')
const mesajSucces = ref('')

function trimiteComanda() {
  const telefonTrim = telefon.value.trim()

  if (!nume.value || !telefonTrim || !adresa.value) {
    alert('Te rugăm să completezi toate câmpurile obligatorii.')
    return
  }

  const telefonValid = /^[0-9]{10,15}$/.test(telefonTrim)
  if (!telefonValid) {
    alert('Numărul de telefon trebuie să conțină între 10 și 15 cifre.')
    return
  }

  const comandaNoua = {
    id: Date.now(),
    nume: nume.value,
    telefon: telefonTrim,
    email: email.value,
    adresa: adresa.value,
    observatii: observatii.value
  }

  const comenziExistente = JSON.parse(localStorage.getItem('comenzi')) || []
  comenziExistente.push(comandaNoua)
  localStorage.setItem('comenzi', JSON.stringify(comenziExistente))

  mesajSucces.value = 'Comanda a fost trimisă și salvată local! ✅'

  nume.value = ''
  telefon.value = ''
  email.value = ''
  adresa.value = ''
  observatii.value = ''
}
</script>
