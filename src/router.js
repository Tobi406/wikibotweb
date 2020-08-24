import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/dashboard/:id',
    name: 'Server Dashboard',
    component: Dashboard,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
