import { createRouter, createWebHashHistory } from 'vue-router'
import LogIn from '../views/LogIn.vue'
import Posts from '../views/Posts.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Posts
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
