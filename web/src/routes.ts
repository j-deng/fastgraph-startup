import { createRouter, createWebHistory } from 'vue-router'
import { Entry as ResourceEntry } from 'fastgraph-vue'
import Home from './components/Home.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import UserResource from './components/UserResource.vue'
import Login from './components/user/Login.vue'
import UserProfile from './components/user/UserProfile.vue'

const routes = [
  {
    path: '/',
    redirect: '/index',
    component: DefaultLayout,
    children: [
      {
        path: 'index',
        component: Home
      },
      {
        path: 'resource/:key',
        component: ResourceEntry
      },
      {
        path: 'resource/User',
        component: UserResource
      },
      {
        path: '/user/profile',
        component: UserProfile
      }
    ]
  },
  {
    path: '/user/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
