<template>
  <div>
    <span class="home_demo" @click="router.push({path: '/demo'})">Demo</span>
    <div>
      ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、ct、
    </div>
  </div>
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

// 是否加载
const isLoad = ref(false);
// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 全屏
const full_screen = ref(false);
// 图表
const chartActive = ref('c1');
const chartPie = ref([{}]);
const chartInterval = ref([]);

/* 监听 */
watch(()=>state.isLogin, (isLogin: boolean)=>{
  if(isLogin) loadData();
},{ deep: true });

/* 创建完成 */
onMounted(()=>{
  if(state.token) isLoad.value = true;
});
onActivated(()=>{
  if(isLoad && state.isLogin) loadData();
});

/* 加载数据 */
const loadData = (): void => {
}

</script>