import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home/index.vue';

/* 路由 */
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/refresh', name: 'Refresh', component: ()=>import('../views/tools/Refresh.vue') },
  { path: '/demo', name: 'Demo', component: ()=>import('../views/demo/index.vue') },
  { path: '/base/html', name: 'BaseHtml', component: ()=>import('../views/base/html.vue') },
  /* 首页 */
  { path: '/purchase/stock', name: 'PurchaseStock', component: ()=>import('../views/purchase/stock.vue') },
  { path: '/purchase/in', name: 'PurchaseIn', component: ()=>import('../views/purchase/in.vue') },
  { path: '/purchase/out', name: 'PurchaseOut', component: ()=>import('../views/purchase/out.vue') },
  { path: '/allocate/out', name: 'AllocateOut', component: ()=>import('../views/purchase/allocate_out.vue') },
  { path: '/allocate/in', name: 'AllocateIn', component: ()=>import('../views/purchase/allocate_in.vue') },
  { path: '/order/out', name: 'OrderOut', component: ()=>import('../views/purchase/order_out.vue') },
  { path: '/order/in', name: 'OrderIn', component: ()=>import('../views/purchase/order_in.vue') },
  /* 消息 */
  { path: '/msg/show', name: 'MsgShow', component: ()=>import('../views/msg/show.vue') },
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
