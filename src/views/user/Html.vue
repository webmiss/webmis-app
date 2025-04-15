<template>
  <PageView bgColor="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>{{ info.title }}</template>
    <ScrollView>
      <div class="html_time">最后修改时间: {{ info.time || '-' }}</div>
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
const info = ref({title:'', time:'', content:''});

/* 创建完成 */
onMounted(()=>{
});
onActivated(()=>{
  loadData();
});

/* 加载数据 */
const loadData = (): void => {
  if(route.query.name==='m_user') {
    info.value.title = '用户协议';
    info.value.content = '用户协议';
  } else if(route.query.name==='m_service') {
    info.value.title = '隐私条款';
    info.value.content = '隐私条款';
  }
}

</script>