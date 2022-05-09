import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {name: 'home', path: '/home', component: () => import('@/pages/home.vue')},
  {name: 'index', path: '/', component: () => import('@/pages/index.vue')},
  {
    name: 'layout',
    path: '/layout',
    component: () => import('@/pages/layout.vue'),
  },
  {name: 'me', path: '/me', component: () => import('@/pages/me.vue')},
  {
    name: 'profile',
    path: '/profile',
    component: () => import('@/pages/profile.vue'),
    children: [
      {
        name: 'profile-id',
        path: ':id',
        component: () => import('@/pages/profile/[id].vue'),
      },
    ],
  },
]

export default routes
