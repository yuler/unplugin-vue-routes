import {createApp} from 'vue'
import {createRouter, createWebHistory, RouteRecord} from 'vue-router'

import App from './App.vue'

const routes: RouteRecord[] = []
const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
