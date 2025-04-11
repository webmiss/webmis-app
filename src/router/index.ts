import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Homes.vue';
import Demo from '../views/demo/Demo.vue';

/* 路由 */
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/refresh', name: 'Refresh', component: ()=>import('../views/tools/Refresh.vue') },
  { path: '/demo', name: 'Demo', meta: {keepAlive:false}, component: Demo },
]
/* 创建 */
export default createRouter({
  history: createWebHistory(),
  routes
})
