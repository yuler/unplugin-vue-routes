import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home.vue'),
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/pages/me.vue'),
  },
  {
    path: '/profile/:id',
    name: 'ProfileId',
    component: () => import('@/pages/profile/[id].vue'),
  }
]

export default routes
