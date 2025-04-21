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
  select:focus, textarea:focus, input:focus { font-size: 15px !important; }
}
/* 样式 */
@import url('./assets/style/icon.less');
@import url('./assets/style/ui.less');
@import url('./assets/style/app.less');
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
/* UI组件 */
import Storage from './library/storage';
import Ui from './library/ui';
import Plus from './library/plus';
/* 组件 */
import Update from './views/tools/Update.vue';

// 变量
const store = useStore();
const state = store.state;
const route = useRoute();
// 切换动画
const transitionName = ref('');

/* 监听 */
watch(()=>route.path, (now: string, old: string)=>{
  // 页面切换
  if(now!=old) {
    // 历史
    const currentPos = window.history.state?.position || 0;
    // 动画
    const lastPos = Storage.getItem('routePosition') || 0;
    transitionName.value = currentPos>lastPos?'slide-left':'slide-right';
    // 缓存
    Storage.setItem('routePosition', now==='/'?'0':currentPos);
  }
}, { deep: true });

/* 加载完成 */
onMounted(()=>{
  // 屏幕转动
  window.addEventListener('orientationchange', () => {
    if (Math.abs(window.orientation) === 90) Ui.Toast('请切换竖屏方式');
  }, false);
  // 默认值
  Plus.Ready(()=>{
    // @ts-ignore 竖屏
    plus.screen.lockOrientation("portrait-primary");
    // @ts-ignore 状态栏-文本颜色
    plus.navigator.setStatusBarStyle('dark');
    // @ts-ignore 状态栏-背景颜色
    plus.navigator.setStatusBarBackground('#FFFFFF');
    // @ts-ignore 状态栏高度
    state.statusHeight = plus.navigator.getStatusbarHeight();
  });
  // 首页位置
  Storage.setItem('routePosition', '0');
});

</script>
