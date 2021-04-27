import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Dashboard.vue'

Vue.use(VueRouter)

const isLoggedIn = false;

const router = new VueRouter({
  routes,
  linkActiveClass: 'active', // have to do this because there's a clash between the bootstrap active class and the naming convention of the "active" class used automatically by Vue
  linkExactActiveClass: 'exact-active',
  mode: 'history' // to delete the hash in the website url
})

export default router
