<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

// state formular
const user = ref('')
const pass = ref('')
const loading = ref(false)
const error = ref('')

// trimite formularul
async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(user.value.trim(), pass.value.trim())
    const redirect = String(route.query.redirect || '/')
    router.push(redirect)
  } catch (e) {
    error.value = e.message || 'Eroare la autentificare'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16 card p-6 space-y-4">
    <h1 class="text-xl font-bold">Autentificare</h1>
    <input v-model="user" class="input w-full" placeholder="Utilizator" autocomplete="username" />
    <input v-model="pass" type="password" class="input w-full" placeholder="Parolă" autocomplete="current-password" />
    <button class="btn-primary w-full" :disabled="loading" @click="submit">
      {{ loading ? 'Se conectează…' : 'Login' }}
    </button>
    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    <p class="text-xs text-gray-500">Demo: <b>admin</b> / <b>admin123</b></p>
  </div>
</template>
