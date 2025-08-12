<script setup>
import { ref } from 'vue'

// câmpuri formular
const nume = ref('')
const email = ref('')
const mesaj = ref('')
const trimis = ref(false)

function trimiteMesaj() {
  if (!nume.value || !email.value || !mesaj.value) return
  // momentan doar simulăm trimiterea
  trimis.value = true
  nume.value = ''
  email.value = ''
  mesaj.value = ''
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-12">
    <!-- Titlu -->
    <h1 class="text-3xl font-bold text-center">Contactează-ne</h1>

    <!-- Informații de contact -->
    <div class="grid md:grid-cols-3 gap-8 text-center">
      <div>
        <p class="text-lg font-semibold">Telefon</p>
        <p class="text-gray-600">+40 7xx xxx xxx</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Email</p>
        <p class="text-gray-600">contact@stomobdesign.ro</p>
      </div>
      <div>
        <p class="text-lg font-semibold">Adresă</p>
        <p class="text-gray-600">Str. Exemplu nr. 10, București</p>
      </div>
    </div>

    <!-- Social media -->
    <div class="flex justify-center gap-6">
      <a href="https://facebook.com" target="_blank" class="text-blue-600 hover:scale-110 transition">
        <i class="fab fa-facebook fa-2x"></i>
      </a>
      <a href="https://instagram.com" target="_blank" class="text-pink-600 hover:scale-110 transition">
        <i class="fab fa-instagram fa-2x"></i>
      </a>
    </div>

    <!-- Hartă -->
    <div class="rounded overflow-hidden shadow">
      <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2821.642702509314!2d25.94580117640427!3d44.5614431710726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f8a2a6a26e6f%3A0x5c7fbb65d0a8e10!2sBuftea!5e0!3m2!1sro!2sro!4v1691849723456!5m2!1sro!2sro"
  width="100%"
  height="300"
  style="border:0;"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>

    </div>

    <!-- Formular -->
    <div class="bg-gray-50 p-6 rounded shadow max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Trimite-ne un mesaj</h2>
      <div class="space-y-4">
        <input v-model="nume" type="text" placeholder="Nume" class="w-full border p-2 rounded" />
        <input v-model="email" type="email" placeholder="Email" class="w-full border p-2 rounded" />
        <textarea v-model="mesaj" rows="4" placeholder="Mesaj" class="w-full border p-2 rounded"></textarea>
        <button @click="trimiteMesaj" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Trimite
        </button>
        <p v-if="trimis" class="text-green-600 text-sm mt-2">Mesaj trimis cu succes!</p>
      </div>
    </div>

    <!-- Ghid colaborare -->
    <div class="grid md:grid-cols-4 gap-6 text-center mt-10">
      <div>
        <p class="text-2xl font-bold">1</p>
        <p class="text-gray-600">Ne contactezi</p>
      </div>
      <div>
        <p class="text-2xl font-bold">2</p>
        <p class="text-gray-600">Facem măsurători</p>
      </div>
      <div>
        <p class="text-2xl font-bold">3</p>
        <p class="text-gray-600">Realizăm proiectul</p>
      </div>
      <div>
        <p class="text-2xl font-bold">4</p>
        <p class="text-gray-600">Livrare & montaj</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
