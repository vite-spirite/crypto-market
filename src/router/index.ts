import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import home from '@/views/home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: home,
    redirect: '/market',
    children: [
      {
        path: "market/",
        component: () => import('@/views/market.vue'),
        children: [
          {
            path: ':asset',
            component: () => import('@/views/asset.vue'),
          }
        ]
      },
      {
        path: "favorite",
        component: () => import('@/views/favorite.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
