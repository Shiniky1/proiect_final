import { createApp } from 'vue'
import '@/assets/theme.css'
import App from './App.vue'
import router from './router'
import './tailwind.css'

// setează tema la încărcare pe baza preferinței salvate sau a sistemului
const saved = localStorage.getItem('theme') // 'dark' | 'light' | null
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = saved ?? (prefersDark ? 'dark' : 'light')
document.documentElement.classList.toggle('dark', theme === 'dark')

// ... restul importurilor și createApp(...)




createApp(App).use(router).mount('#app')
