<script setup>
import { ref } from 'vue'

const nume = ref('')
const email = ref('')
const mesaj = ref('')
const trimis = ref(false)

function trimiteMesaj() {
  if (!nume.value || !email.value || !mesaj.value) return
  trimis.value = true
  nume.value = ''
  email.value = ''
  mesaj.value = ''
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-10">
    <h1 class="text-3xl font-bold text-center">Contact</h1>

    <div class="card p-0 overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2821.642702509314!2d25.94580117640427!3d44.5614431710726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f8a2a6a26e6f%3A0x5c7fbb65d0a8e10!2sBuftea!5e0!3m2!1sro!2sro!4v1691849723456!5m2!1sro!2sro"
        width="100%" height="280" style="border:0" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="card p-4 flex flex-col items-center text-center gap-2">
        <i class="fas fa-phone fa-lg text-blue-600"></i>
        <p class="font-semibold">Telefon</p>
        <p class="text-sm text-gray-700 dark:text-gray-300">+40 7xx xxx xxx</p>
      </div>
      <div class="card p-4 flex flex-col items-center text-center gap-2">
        <i class="fas fa-envelope fa-lg text-green-600"></i>
        <p class="font-semibold">Email</p>
        <p class="text-sm text-gray-700 dark:text-gray-300">contact@stomobdesign.ro</p>
      </div>
      <div class="card p-4 flex flex-col items-center text-center gap-2">
        <i class="fas fa-location-dot fa-lg text-red-600"></i>
        <p class="font-semibold">Adresă</p>
        <p class="text-sm text-gray-700 dark:text-gray-300">Buftea, Ilfov</p>
      </div>
    </div>

    <div class="card p-6 max-w-2xl mx-auto w-full">
      <h2 class="text-2xl font-bold mb-4">Trimite-ne un mesaj</h2>
      <div class="space-y-4">
        <input v-model="nume" type="text" placeholder="Nume" class="input" />
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <textarea v-model="mesaj" rows="4" placeholder="Mesaj" class="input"></textarea>
        <button @click="trimiteMesaj" class="btn-primary">Trimite</button>
        <p v-if="trimis" class="text-green-600 text-sm mt-2">Mesaj trimis cu succes!</p>
      </div>
    </div>

    <div class="flex justify-center gap-8">
      <a href="https://facebook.com" target="_blank" rel="noopener"
         class="flex items-center gap-2 text-blue-600 hover:opacity-80 transition">
        <i class="fab fa-facebook fa-lg"></i><span class="font-medium">Facebook</span>
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener"
         class="flex items-center gap-2 text-pink-600 hover:opacity-80 transition">
        <i class="fab fa-instagram fa-lg"></i><span class="font-medium">Instagram</span>
      </a>
    </div>

    <div class="grid md:grid-cols-4 gap-6 text-center">
      <div>
        <p class="text-2xl font-bold">1</p>
        <p class="text-gray-700 dark:text-gray-300">Ne contactezi</p>
      </div>
      <div>
        <p class="text-2xl font-bold">2</p>
        <p class="text-gray-700 dark:text-gray-300">Facem măsurători</p>
      </div>
      <div>
        <p class="text-2xl font-bold">3</p>
        <p class="text-gray-700 dark:text-gray-300">Realizăm proiectul</p>
      </div>
      <div>
        <p class="text-2xl font-bold">4</p>
        <p class="text-gray-700 dark:text-gray-300">Livrare & montaj</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
