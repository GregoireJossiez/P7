import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from '../views/ContactView.vue'
import LogIn from '../views/LogIn.vue'
import SignIn from '../views/SignIn.vue'
import NewPost from '../views/newPost.vue'
import Posts from '../views/Posts.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn
  },
  {
    path: '/newpost',
    name: 'post',
    component: NewPost
  },
  {
    path: '/posts',
    name: 'posts',
    component: Posts
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
