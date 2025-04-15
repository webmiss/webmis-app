<template>
  <PageView bgColor="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>用户登录</template>
    <template #bar_right><a class="text" @click="router.push({path: '/user/register'})">注册</a></template>
    <div class="login_ct">
      <div class="login_logo"></div>
      <ul class="login_form">
        <li>
          <wmInput v-model:value="form.uname" icon="ui ui_user" padding="0 10px 0 40px" :placeholder="form.type==='tel'?'手机号码':'用户名 / 手机号码 / 邮箱'"></wmInput>
        </li>
        <li v-if="form.type==='passwd'">
          <wmInput v-model:value="form.passwd" icon="ui ui_safety" padding="0 10px 0 40px" placeholder="请输入密码"></wmInput>
        </li>
        <li v-if="form.type==='tel'">
          <wmInput v-model:value="form.code" icon="ui ui_safety" padding="0 10px 0 40px" maxlength="4" placeholder="验证码" :text="login.text"></wmInput>
        </li>
        <li>
          <wmButton width="100%" height="40px" @click="clickLogin()">{{ login.botton }}</wmButton>
        </li>
        <li class="other">
          <span @click="changeType('passwd')">帐号密码</span>|<span @click="changeType('tel')">手机号码</span>
        </li>
      </ul>
    </div>
  </PageView>
</template>

<style lang="less" scoped>
.login_body{position: relative; background-color: #FFF; width: 100%; height: 100%;}
.login_ct{position: absolute; width: calc(100% - 64px); max-width: 360px; min-width: 240px; left: 50%; top: 48%; transform: translate(-50%, -50%);}
.login_logo{margin: 16px auto; width: 136px; height: 136px; background-color: #F6F6F6; background-size: 60%; background-image: url('../../assets/logo.svg'); border-radius: 50%; background-repeat: no-repeat; background-position: center; transition: All 0.5s ease-in-out;}
.login_form{overflow: hidden;}
.login_form li{padding: 10px;}
.login_form .other{color: @Info; text-align: center;}
.login_form .other span{padding: 5px 10px; color: @Primary;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';
import wmInput from '../../components/form/input/index.vue';
import wmButton from '../../components/form/button/index.vue';

// 是否加载
const isLoad = ref(false);
// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const login = ref({text: '获取验证码', botton: '登 录'});
const form = ref({type:'passwd', uname:'', passwd:'', code:'', vcode:''});

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

/* 登录方式 */
const changeType = (type: string): void => {
  form.value.type = type;
}

/* 登录 */
const clickLogin = (): void => {
  const uname: string = form.value.uname;
  const passwd: string = form.value.passwd;
}

</script>