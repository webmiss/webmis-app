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
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

/* 组件 */
import TabBar from '../../components/tabs/tabbar.vue';
import Stock from './stock.vue';
import Msg from '../msg/index.vue';
import Me from './me.vue';

// 公共
defineOptions({name: 'Home'});
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const tabbar = ref({active: 'home', color: '', bgColor: '', activeColor: '', columns:[
  {label: '首页', icon: 'icons icon_home', slot: 'home'},
  {label: '消息', icon: 'icons icon_msg', slot: 'msg', num: state.msg.num},
  {label: '我的', icon: 'icons icon_me', slot: 'me'},
]});

/* 监听-消息数量 */
watch(()=>state.msg.num, (val: number)=>{
  tabbar.value.columns[1].num = val;
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
  // 首页数据
  tabChange({slot: 'home'});
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

</script>