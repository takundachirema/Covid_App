import Vue from 'vue'
import App from './App.vue'

import VueSidebarMenu from 'vue-sidebar-menu'
// import the es6 version
import 'zingchart/es6'
import 'zingchart/modules-es6/zingchart-maps.min.js';

import ZingChartVue from 'zingchart-vue'
import ZingGrid from 'zinggrid'

import VueRouter from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Tables from './views/Tables.vue'
import About from './views/About.vue'

import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'vue-search-select/dist/VueSearchSelect.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/js/zingchart-navpie.min.js';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(VueSidebarMenu)
Vue.component('zinggrid', ZingGrid)
Vue.component('zingchart', ZingChartVue)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/betatables',
      name: 'Tables',
      component: Tables
    }
  ]
})

new Vue({
  router,
  render: h => h(App),
  methods: {
    addName: function() {
      console.log("add name")
    }
  }
}).$mount('#app')
