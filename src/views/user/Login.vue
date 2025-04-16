<template>
  <PageView bgColor="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>用户登录</template>
    <div class="login_ct">
      <div class="login_logo"></div>
      <ul class="login_form">
        <li>
          <wmInput v-model:value="form.uname" icon="ui ui_user" padding="0 10px 0 40px" :placeholder="form.type==='tel'?'手机号码':'用户名 / 手机号码 / 邮箱'"></wmInput>
        </li>
        <li v-if="form.type==='passwd'">
          <wmInput type="password" v-model:value="form.passwd" icon="ui ui_safety" padding="0 10px 0 40px" placeholder="请输入密码"></wmInput>
        </li>
        <li v-if="form.type==='tel'">
          <wmInput v-model:value="form.code" icon="ui ui_safety" padding="0 10px 0 40px" maxlength="4" placeholder="验证码" :text="login.text"></wmInput>
        </li>
        <li class="agreement flex_left">
          <wmCheckbox :options="form.agreement"></wmCheckbox>
          <span>已阅读并同意<b @click="router.push({path: '/html', query:{name:'m_user'}})">《用户协议》</b>和<b @click="router.push({path: '/html', query:{name:'m_service'}})">《隐私条款》</b></span>
        </li>
        <li>
          <wmButton width="100%" height="40px" @click="clickSub()" :disabled="login.disabled">{{ login.botton_text }}</wmButton>
        </li>
        <li class="other">
          <span @click="changeType('passwd')">密码登录</span>|<span @click="changeType('tel')">手机号码</span>
        </li>
      </ul>
    </div>
  </PageView>
</template>

<style lang="less" scoped>
.login_body{position: relative; background-color: #FFF; width: 100%; height: 100%;}
.login_ct{position: absolute; width: calc(100% - 64px); max-width: 360px; min-width: 240px; left: 50%; top: 48%; transform: translate(-50%, -50%);}
.login_logo{margin: 16px auto; width: 120px; height: 120px; background-color: #F6F6F6; background-size: 60%; background-image: url('../../assets/logo.svg'); border-radius: 50%; background-repeat: no-repeat; background-position: center; transition: All 0.5s ease-in-out;}
.login_form{overflow: hidden;}
.login_form li{padding: 10px;}
.login_form .agreement{font-size: 12px; line-height: 24px;}
.login_form .agreement b{font-size: 12px; color: @Primary;}
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
import wmCheckbox from '../../components/form/checkbox/index.vue';

// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const login = ref({text: '获取验证码', disabled: false, botton_text: '登 录'});
const form = ref({type:'passwd', uname:'', passwd:'', code:'', vcode:'', agreement:{label:'', value:'agreement', checked:false}});

/* 创建完成 */
onMounted(()=>{
});
onActivated(()=>{
});

/* 登录方式 */
const changeType = (type: string): void => {
  form.value.type = type;
}

/* 验证 */
const verify = (form: any): any => {
  if(form.type==='passwd') {
    if(form.uname.trim().length<4) return Ui.Toast('请输入帐号');
    if(form.passwd.length<6) return Ui.Toast('请输入密码');
  } else if(form.type==='tel') {
    if(form.uname.trim().length!==11) return Ui.Toast('请输入手机号码');
    if(form.code.length!==4) return Ui.Toast('请输入验证码');
  }
  // 服务协议
  if(!form.agreement.checked) return Ui.Toast('请阅读并同意服务协议');
  return form;
}

/* 登录 */
const clickSub = (): void => {
  // 验证
  const data = verify(form.value);
  if(!data) return;
  console.log(data);
  // 请求
  login.value.disabled = true;
  login.value.botton_text = '正在登录';
  setTimeout(()=>{
    login.value.disabled = false;
    login.value.botton_text = '重试';
  }, 3000);
}

</script>