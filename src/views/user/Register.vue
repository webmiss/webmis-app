<template>
  <PageView bgColor="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>新用户注册</template>
    <template #bar_right><a class="text" @click="router.go(-1)">登录</a></template>
    <div class="login_ct">
      <div class="login_logo"></div>
      <div>手机号码</div>
      <div>验证码</div>
      <div>服务条款</div>
      <div>按钮</div>
    </div>
  </PageView>
</template>

<style lang="less" scoped>
.login_body{position: relative; background-color: #FFF; width: 100%; height: 100%;}
.login_ct{position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);}
.login_logo{margin: 16px auto; width: 160px; height: 160px; background-color: #F2F4F8; background-size: 60%; background-image: url('../../assets/logo.svg'); border-radius: 50%; background-repeat: no-repeat; background-position: center; transition: All 0.5s ease-in-out;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';

// 是否加载
const isLoad = ref(false);
// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
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