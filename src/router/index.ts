import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Homes.vue';

/* 路由 */
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/refresh', name: 'Refresh', component: ()=>import('../views/tools/Refresh.vue') },
  { path: '/demo', name: 'Demo', component: ()=>import('../views/demo/index.vue') },
  { path: '/base/html', name: 'BaseHtml', component: ()=>import('../views/base/html.vue') },
  { path: '/base/msg', name: 'BaseMsg', component: ()=>import('../views/base/msg.vue') },
  /* 用户 */
  { path: '/user/login', name: 'UserLogin', component: ()=>import('../views/user/login.vue') },
  { path: '/user/setup', name: 'UserSetup', component: ()=>import('../views/user/setup/index.vue') },
  { path: '/user/info', name: 'UserInfo', component: ()=>import('../views/user/info/index.vue') },
]
/* 创建 */
export default createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})
