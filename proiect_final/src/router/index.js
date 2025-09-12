import { createRouter, createWebHistory } from 'vue-router'
import { isAdmin } from '@/utils/auth'

// --- Public (landing / informare)
import Home from '@/views/Home.vue'
import Contact from '@/views/Contact.vue'

// --- Portofoliu / Produse
import Portofoliu from '@/views/Portofoliu.vue'



// --- / Formulare

import Oferta from '@/views/Oferta.vue'


// --- Auth / Admin
import Login from '@/views/Login.vue'
import AdminComenzi from '@/views/AdminComenzi.vue'
import Oferte from '@/views/Oferte.vue'                 // Admin · Oferte (listă cereri)

// --- 404 (fallback)
const NotFound = () => import('@/views/NotFound.vue')   // încărcare lazy

// --- Definiția rutelor 
const routes = [
  // Public
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: Contact },

  // Portofoliu / Produse
  { path: '/portofoliu', component: Portofoliu, name: 'Portofoliu' },



  //  Formulare
  { path: '/oferta', name: 'Oferta', component: Oferta },
  

  // Auth
  { path: '/login', name: 'Login', component: Login },


  // Admin 
  { path: '/admin/oferte', name: 'AdminOferte', component: Oferte, meta: { requiresAdmin: true } },
  { path: '/admin/comenzi', name: 'AdminComenzi', component: AdminComenzi, meta: { requiresAdmin: true } },

  // 404 
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

// --- Instanța routerului
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// --- Guard global
router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !isAdmin()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

export default router
