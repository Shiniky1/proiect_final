<template>
  <div class="min-h-screen flex flex-col bg-[#F7F3EA] text-gray-900 dark:bg-[#1A1310] dark:text-[#F5E9D0]">
    <Navbar />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
  </div>
</template>


<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>
