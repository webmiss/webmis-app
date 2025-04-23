<template>
  <PageView bgColor="#595" color="#FFF" barBgColor="#595">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>测试页面</template>
    <ScrollView v-model:refreshing="scroll.refreshing" @refresh="onRefresh" v-model:loading="scroll.loading" v-model:finished="scroll.finished" @load="onLoad">
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
      <p>内容</p>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
</style>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const page = ref({num: 1, limit: 30});

/* 创建完成 */
onMounted(()=>{
});
onActivated(()=>{
  loadData();
});

/* 下拉刷新 */
const onRefresh = (): void => {
  page.value.num = 1;
  loadData();
}
/* 上拉加载 */
const onLoad = (): void => {
  page.value.num += 1;
  loadData();
}

/* 加载数据 */
const loadData = (): void => {
  setTimeout(()=>{
    if(page.value.num===1){
      scroll.value.refreshing = false;
    } else {
      scroll.value.loading = false;
      scroll.value.finished = true;
    }
  }, 1000);
}

</script>