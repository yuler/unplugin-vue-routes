import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/pages/Home.vue'),
    }
    ,
    {
      path: '/profile/:id',
      name: 'Profile-:id',
      component: () => import('@/pages/profile/$id.vue'),
    }
    
]

export default routes

