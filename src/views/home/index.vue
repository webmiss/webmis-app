<template>
  <TabBar v-model:active="tabbar.active" :color="tabbar.color" :bgColor="tabbar.bgColor" :activeColor="tabbar.activeColor" :columns="tabbar.columns" @update:change="tabChange">
    <template #home>
      <Stock></Stock>
    </template>
    <template #msg>
      <Msg></Msg>
    </template>
    <template #me>
      <Me></Me>
    </template>
  </TabBar>
</template>

<style lang="less" scoped>

</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated, getCurrentInstance, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';

/* JS组件 */
import Env from '../../config/Env';
/* UI组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
import Storage from '../../library/storage';
/* 组件 */
import TabBar from '../../components/tabs/tabbar.vue';
import Stock from './stock.vue';
import Msg from './msg/index.vue';
import Me from './me.vue';

// 配置
defineOptions({name: 'Home'});
// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const tabbar = ref({active: 'home', color: '', bgColor: '', activeColor: '', columns:[
  {label: '首页', icon: 'icons icon_home', slot: 'home'},
  {label: '消息', icon: 'icons icon_msg', slot: 'msg'},
  {label: '我的', icon: 'icons icon_me', slot: 'me'},
]});
// Token验证
let TokenTime: any = null;
const verifyTokenTime = ref(30000);     // 间隔时间

/* 监听 */
watch(()=>state.isLogin, (val: boolean)=>{
  if(val) {
    clearInterval(TokenTime);
    TokenTime = setInterval(()=>{ verifyToken(); }, verifyTokenTime.value);
  } else {
    setTimeout(()=>{ router.push({path: '/user/login'}); }, 1000);
  }
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
  // 首页数据
  tabChange({slot: 'home'});
});
onActivated(()=>{
  /* 验证登录 */
  if(Env.isLogin) isLogin();
});

/* 切换菜单 */
const tabChange = (d: any): void => {
  if(d.slot==='home') {
    tabbar.value.color = 'rgba(255,255,255,0.7)';
    tabbar.value.bgColor = '#0064C8';
    tabbar.value.activeColor = '#FFF';
  } else {
    tabbar.value.color = '#999';
    tabbar.value.bgColor = '#FFF';
    tabbar.value.activeColor = '#0064C8';
  }
}

/* 验证登录 */
const isLogin = (): void => {
  const token: string = Storage.getItem('token') || '';
  if(!token) setTimeout(()=>{ router.push({path: '/user/login'}); }, 1000);
  else {
    state.token = token;
    verifyToken(true);
  }
}

/* 验证Token */
const verifyToken = (uinfo: boolean=false): void => {
  if(!state.token) return;
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