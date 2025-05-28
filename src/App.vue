<template>
  <!-- 启动页 -->
  <Start></Start>
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
import { useRoute, useRouter } from 'vue-router';
/* UI组件 */
import Ui from './library/ui';
import Request from './library/request';
import Storage from './library/storage';
import Plus from './library/plus';
/* 组件 */
import Start from './views/tools/Start.vue';
import Update from './views/tools/Update.vue';

// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const transitionName = ref('');         // 页面切换样式
let time: any = null;                   // Token验证-对象
const verifyTokenTime = ref(30000);     // Token验证-间隔时间

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
  /* 屏幕转动 */
  window.addEventListener('orientationchange', () => {
    if (Math.abs(window.orientation) === 90) Ui.Toast('请切换竖屏方式');
  }, false);

  /* 手机设置 */
  Plus.Ready(()=>{
    // @ts-ignore 竖屏
    plus.screen.lockOrientation("portrait-primary");
    // @ts-ignore 状态栏-文本颜色
    plus.navigator.setStatusBarStyle('dark');
    // @ts-ignore 状态栏-背景颜色
    plus.navigator.setStatusBarBackground('#FFFFFF');
    // @ts-ignore
    if(plus.os.name.toLowerCase()!=='ios') {
      // @ts-ignore 状态栏高度
      state.statusHeight = plus.navigator.getStatusbarHeight();
      // 背景音乐
      document.createElement('audio');
    }
  });

  /* Android返回键 */
  let backcount = 0;
  Plus.Back((e: any)=>{
    // @ts-ignore
    if(backcount>0) plus.runtime.quit();
    Ui.Toast('再按一次退出应用!');
    backcount++;
    setTimeout(()=>{ backcount=0; },2000);
  });

  /* 首页位置 */
  Storage.setItem('routePosition', '0');
  
  /* 验证Token */
  isLogin();
  clearInterval(time);
  time = setInterval(()=>{ isLogin(); }, verifyTokenTime.value);
});

/* 是否登录 */
const isLogin = (): void => {
  if(state.token) {
    verifyToken();
  } else {
    const token: string = Storage.getItem('token') || '';
    state.isLogin = true;
    state.token = token;
    verifyToken(true);
  }
}

/* 验证Token */
const verifyToken = (uinfo: boolean=false): void => {
  // 是否登录
  if(!state.token) {
    setTimeout(()=>{ router.push({path: '/user/login'}); }, 1000);
    return;
  }
  // 请求
  Request.Post('user/token', {token: state.token, uinfo: uinfo}, (res:any)=>{
    const {code, msg, data}: any = res.data;
    if(code==0 && data.token_time>0) {
      state.isLogin = true;
      // 修改密码
      if(!state.isPasswd && state.lang) state.isPasswd = data.isPasswd;
      // 用户信息
      if(Object.keys(data.uinfo).length!=0) {
        state.uinfo = data.uinfo;
        Storage.setItem('uname', data.uinfo.uname);
        Storage.setItem('uinfo', JSON.stringify(data.uinfo));
        Storage.setItem('user_img', data.uinfo.img);
      }
    } else {
      Ui.Toast(msg);
      logout().then(()=>{
        router.push({path: '/user/login'});
      });
    }
  },()=>{
    Ui.Toast('网络错误');
    logout().then(()=>{
      router.push({path: '/user/login'});
    });
  });
}

/* 退出登录 */
const logout = async (): Promise<void> => {
  // 缓存信息
  state.isLogin = false;
  state.token = '';
  state.uinfo = {};
  Storage.removeItem('token');
  Storage.removeItem('uinfo');
}

</script>
