import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import home from '@/views/home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: home,
    redirect: '/market',
    children: [
      {
        path: '',
        redirect: '/market',
      },
      {
        path: "market/",
        component: () => import('@/views/market.vue'),
        name: 'market',
      },
      {
        path: 'market/asset/:asset',
        name: 'market.asset',
        component: () => import('@/views/asset.vue'),
      },
      {
        path: "favorite",
        component: () => import('@/views/favorite.vue'),
        name: 'favorite',
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
