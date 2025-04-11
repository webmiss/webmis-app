<template>
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
// import Login from './views/tools/UserLogin.vue';

const emit = defineEmits(['update:show', 'close']);
const userLogin = ref();
// 变量
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 切换动画
const transitionName = ref('');

/* 监听 */
watch(()=>route.path, (now: string, old: string)=>{
  if(now=='/' && old=='/') return ;
  // 页面切换动画
  transitionName.value = router.isBack?'slide-right':'slide-left';
  console.log(now, old, transitionName.value, router.isBack);
}, { deep: true });

/* 加载完成 */
onMounted(()=>{
});

</script>
