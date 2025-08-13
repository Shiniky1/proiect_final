import { createRouter, createWebHistory } from 'vue-router'

// ——— Public (landing / informare)
import Home from '@/views/Home.vue'
import Contact from '@/views/Contact.vue'

// ——— Catalog / Produse
import Catalog from '@/views/Catalog.vue'
import ProductDetails from '@/views/ProductDetails.vue'   // /produs/:id

// ——— Coș / Formulare
import Cart from '@/views/Cart.vue'
import Oferta from '@/views/Oferta.vue'
import FormularComanda from '@/views/FormularComanda.vue'

// ——— User / Auth / Admin
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserPanel from '@/views/UserPanel.vue'
import Oferte from '@/views/Oferte.vue'                   // mini-admin local

// ——— (opțional) 404
const NotFound = { template: '<div class="p-6">Pagina nu există (404)</div>' }

const routes = [
  // ——— Public
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: Contact },

  // ——— Catalog / Produse
  { path: '/catalog', name: 'Catalog', component: Catalog },
  { path: '/produs/:id', name: 'ProductDetails', component: ProductDetails },

  // ——— Coș / Formulare
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/oferta', name: 'Oferta', component: Oferta },
  { path: '/comanda', name: 'FormularComanda', component: FormularComanda },

  // ——— User / Auth / Admin
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/user', name: 'UserPanel', component: UserPanel },
  { path: '/oferte', name: 'Oferte', component: Oferte },

  // ——— 404 (mereu la final)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
