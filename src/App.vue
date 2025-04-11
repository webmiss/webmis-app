<template>
  <!-- 软件升级 -->
  <Update></Update>
  <!-- 路由 -->
  <router-view v-slot="{ Component, route }">
    <transition :name="transitionName">
      <keep-alive :include="state.keepAlive">
        <component :is="Component" :key="route.path" class="view" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style lang="less">
/* 表单缩放问题 */
@media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
  select:focus, textarea:focus, input:focus { font-size: 16px !important; }
}
/* 样式 */
@import url('./assets/style/icon.less');
@import url('./assets/style/ui.less');
@import url('./assets/style/app.less');
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* UI组件 */
import Env from './config/Env';
import Request from './library/request';
import Storage from './library/storage';
import Ui from './library/ui';
/* 组件 */
// import wmPopup from './components/popup/index.vue';
/* Tools */
import Update from './views/tools/Update.vue';

const emit = defineEmits(['update:show', 'close']);
const userLogin = ref();
// 变量
const store = useStore();
const state = store.state;
const route = useRoute();
const router: any = useRouter();
// 切换动画
const transitionName = ref('');

/* 监听 */
watch(()=>route.path, (now: string, old: string)=>{
  // 首页
  if(now=='/' && old=='/') return Storage.setItem('lastRoute', old);
  // 页面切换动画
  const lastRoute = Storage.getItem('lastRoute');
  transitionName.value = lastRoute===now?'slide-right':'slide-left';
  Storage.setItem('lastRoute', now==='/'?now:old);
}, { deep: true });

/* 加载完成 */
onMounted(()=>{
  window.addEventListener('orientationchange', () => {
    if (Math.abs(window.orientation) === 90) Ui.Toast('请切换竖屏方式');
  }, false); 
});

</script>
