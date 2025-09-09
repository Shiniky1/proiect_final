import { createRouter, createWebHistory } from 'vue-router'
import { isAdmin } from '@/utils/auth'

// --- Public (landing / informare)
import Home from '@/views/Home.vue'
import Contact from '@/views/Contact.vue'

// --- Catalog / Produse
import Catalog from '@/views/Catalog.vue'
import ProductDetails from '@/views/ProductDetails.vue' // /produs/:id

// --- Coș / Formulare
import Cart from '@/views/Cart.vue'
import Oferta from '@/views/Oferta.vue'
import FormularComanda from '@/views/FormularComanda.vue'

// --- Auth / Admin
import Login from '@/views/Login.vue'
import AdminComenzi from '@/views/AdminComenzi.vue'
import Oferte from '@/views/Oferte.vue'                 // Admin · Oferte (listă cereri)

// --- 404 (fallback)
const NotFound = () => import('@/views/NotFound.vue')   // încărcare lazy

// --- Definiția rutelor (grupate logic)
const routes = [
  // Public
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: Contact },

  // Catalog / Produse
  { path: '/catalog', name: 'Catalog', component: Catalog },
  { path: '/produs/:id', name: 'ProductDetails', component: ProductDetails },

  // Coș / Formulare
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/oferta', name: 'Oferta', component: Oferta },
  { path: '/comanda', name: 'FormularComanda', component: FormularComanda },

  // Auth
  { path: '/login', name: 'Login', component: Login },


  // Admin (protejat)
  { path: '/admin/oferte', name: 'AdminOferte', component: Oferte, meta: { requiresAdmin: true } },
  { path: '/admin/comenzi', name: 'AdminComenzi', component: AdminComenzi, meta: { requiresAdmin: true } },

  // 404 (mereu la final)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

// --- Instanța routerului
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// --- Guard global: blochează rutele cu meta.requiresAdmin
router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !isAdmin()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

export default router
