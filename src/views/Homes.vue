<template>
  <TabBar v-model:active="tabbar.active" :color="tabbar.color" :bgColor="tabbar.bgColor" :activeColor="tabbar.activeColor" :columns="tabbar.columns" @update:change="tabChange">
    <template #index>
      <span @click="router.push({path: '/demo'})">测试</span>
    </template>
    <template #msg>
      Msg
    </template>
    <template #me>
      Me
    </template>
  </TabBar>
</template>

<style lang="less" scoped>
.home_demo{line-height: 80px; padding: 0 16px;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../library/ui';
/* 组件 */
import TabBar from '../components/tabs/tabbar.vue';

// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const tabbar = ref({active: 'index', color: '', bgColor: '', activeColor: '', columns:[
  {label: '首页', icon: 'icons icon_home', slot: 'index'},
  {label: '消息', icon: 'icons icon_msg', slot: 'msg'},
  {label: '我的', icon: 'icons icon_me', slot: 'me'},
]});

/* 监听 */
watch(()=>state.isLogin, (isLogin: boolean)=>{
  if(isLogin) loadData();
  else login();
},{ deep: true });

/* 创建完成 */
onMounted(()=>{
  tabChange({slot: 'index'});
});
onActivated(()=>{
  if(!state.isLogin) login();
});

/* 登录 */
const login = (): void => {
  setTimeout(()=>{
    router.push({path: '/user/login'});
  }, 3000);
}

/* 切换菜单 */
const tabChange = (d: any): void => {
  if(d.slot==='index') {
    tabbar.value.color = 'rgba(255,255,255,0.7)';
    tabbar.value.bgColor = '#0064C8';
    tabbar.value.activeColor = '#FFF';
  } else {
    tabbar.value.color = '#999';
    tabbar.value.bgColor = '#FFF';
    tabbar.value.activeColor = '#0064C8';
  }
}

/* 加载数据 */
const loadData = (): void => {
  console.log('首页数据');
}

</script>