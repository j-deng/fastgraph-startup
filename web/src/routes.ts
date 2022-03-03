import { createRouter, createWebHistory } from 'vue-router'
import { Entry } from 'fastgraph-vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/index',
    component: DefaultLayout,
    children: [
      {
        path: 'index',
        component: () => import('./components/Home.vue')
      },
      {
        path: 'resource/:key',
        component: Entry
      },
      {
        path: 'resource/User',
        component: () => import('./components/UserResource.vue')
      },
      {
        path: '/user/profile',
        component: () => import('./components/user/UserProfile.vue')
      }
    ]
  },
  {
    path: '/user/login',
    component: () => import('./components/user/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
