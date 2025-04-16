<template>
  <PageView bgColor="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>{{ info.title }}</template>
    <ScrollView v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false">
      <div class="html_time">修改时间: {{ info.time || '-' }}</div>
      <div class="html_body" v-html="info.content"></div>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
.html_time{line-height: 40px; text-align: center; font-size: 12px; color: @Info; background-color: #F6F6F6;}
.html_body{padding: 10px; line-height: 24px; font-size: 14px;}
</style>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const info = ref({name: <any>'', title:'', time:'', content:''});
const scroll = ref({refreshing: false, loading: false, finished: false});

/* 创建完成 */
onMounted(()=>{
});
onActivated(()=>{
  info.value.name = route.query.name;
  loadData();
});

/* 加载数据 */
const loadData = (): void => {
  if(info.value.name==='m_user') {
    info.value.title = '用户协议';
    info.value.content = '<p>用户协议</p>';
    let i: number = 0;
    for(i==1; i<=100; i++) {
      info.value.content += '<p>用户协议'+i+'</p>';
    }
  } else if(info.value.name==='m_service') {
    info.value.title = '隐私条款';
    info.value.content = '隐私条款';
  }
  setTimeout(()=>{
    scroll.value.refreshing = false;
    Ui.Toast(info.value.name);
  }, 1000);
}

</script>