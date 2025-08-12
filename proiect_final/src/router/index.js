import { createRouter, createWebHistory } from 'vue-router'

// Views principale
import Home from '@/views/Home.vue'
import Catalog from '@/views/Catalog.vue'
import ProductDetails from '@/views/ProductDetails.vue'

// Funcționalități speciale
import Cart from '@/views/Cart.vue'
import Oferta from '@/views/Oferta.vue'
import FormularComanda from '@/views/FormularComanda.vue'

// Autentificare și panou utilizator
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserPanel from '@/views/UserPanel.vue'

// Alte pagini
import Contact from '@/views/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalog', name: 'Catalog', component: Catalog },
  { path: '/produs/:id', name: 'ProductDetails', component: ProductDetails },

  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/oferta', name: 'Oferta', component: Oferta },
  { path: '/comanda', name: 'FormularComanda', component: FormularComanda },

  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/user', name: 'UserPanel', component: UserPanel },

  { path: '/contact', name: 'Contact', component: Contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

