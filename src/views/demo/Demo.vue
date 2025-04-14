<template>
  <PageView bgColor="#595" color="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>测试页面</template>
    <div>
      内容
    </div>
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

// 是否加载
const isLoad = ref(false);
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量

/* 创建完成 */
onMounted(()=>{
  isLoad.value = true;
});
onActivated(()=>{
  if(isLoad && state.isLogin) loadData();
});

/* 加载数据 */
const loadData = (): void => {
}

</script>