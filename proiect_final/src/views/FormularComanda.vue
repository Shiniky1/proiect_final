<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nume = ref('')
const telefon = ref('')
const email = ref('')
const adresa = ref('')
const observatii = ref('')
const succes = ref(false)
const eroare = ref('')

function trimiteComanda() {
  eroare.value = ''
  if (!nume.value || !telefon.value || !adresa.value) {
    eroare.value = 'Completează nume, telefon și adresa de livrare.'
    return
  }

  const comanda = {
    id: crypto.randomUUID(),
    nume: nume.value,
    telefon: telefon.value,
    email: email.value,
    adresa: adresa.value,
    observatii: observatii.value,
    createdAt: new Date().toISOString(),
  }

  try {
    const list = JSON.parse(localStorage.getItem('comenzi') || '[]')
    list.push(comanda)
    localStorage.setItem('comenzi', JSON.stringify(list))
    succes.value = true
    observatii.value = ''
  } catch {
    eroare.value = 'Eroare la salvare.'
  }
}

function inapoi() {
  router.push('/cart')
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-4 space-y-6">
    <h1 class="text-2xl font-bold">Formular de comandă</h1>

    <!-- info -->
    <div class="card p-4">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        Completează datele de mai jos pentru livrare. Câmpurile marcate cu * sunt obligatorii.
      </p>
    </div>

    <!-- formular -->
    <div class="card p-6">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Nume complet *</label>
          <input v-model="nume" type="text" class="input" />
        </div>

        <div>
          <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Telefon *</label>
          <input v-model="telefon" type="tel" class="input" placeholder="07xxxxxxxx" />
        </div>

        <div>
          <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Email (opțional)</label>
          <input v-model="email" type="email" class="input" placeholder="exemplu@email.com" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Adresă de livrare *</label>
          <textarea v-model="adresa" rows="3" class="input" placeholder="Stradă, număr, bloc, scara, etaj, apartament, localitate"></textarea>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm mb-1 text-gray-800 dark:text-gray-300">Observații</label>
          <textarea v-model="observatii" rows="2" class="input" placeholder="Interval orar preferat, detalii suplimentare..."></textarea>
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button @click="trimiteComanda" class="btn-primary">Trimite comanda</button>
        <button @click="inapoi" class="btn-outline">Înapoi la coș</button>
      </div>

      <p v-if="eroare" class="mt-3 text-sm text-red-600">{{ eroare }}</p>
      <p v-if="succes" class="mt-3 text-sm text-green-700">
        Comanda a fost salvată. Te contactăm în curând.
      </p>
    </div>
  </div>
</template>
