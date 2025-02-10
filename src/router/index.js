import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from "../layouts/MainLayout.vue"
import MainPlayerPage from '@/pages/MainPlayerPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
      children: [
        {
          path: "",
          name: "mainPlayer",
          component: MainPlayerPage
        }
      ]
    },
  ]
})

export default router
