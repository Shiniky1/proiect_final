<template>
  <div class="min-h-screen bg-[#F7F3EA] text-gray-900 dark:bg-[#1A1310] dark:text-[#F5E9DD]">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
