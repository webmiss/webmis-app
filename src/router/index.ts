import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Homes.vue';

/* 路由 */
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/refresh', name: 'Refresh', component: ()=>import('../views/tools/Refresh.vue') },
  { path: '/demo', name: 'Demo', meta: {keepAlive:false}, component: ()=>import('../views/demo/Demo.vue') },
  /* 用户 */
  { path: '/user/login', name: 'UserLogin', meta: {keepAlive:true}, component: ()=>import('../views/user/Login.vue') },
  { path: '/html', name: 'Html', meta: {keepAlive:false}, component: ()=>import('../views/user/Html.vue') },
]
/* 创建 */
export default createRouter({
  history: createWebHistory(),
  routes
})
