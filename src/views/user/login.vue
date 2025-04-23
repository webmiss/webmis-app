<template>
  <PageView bgColor="#FFF">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>用户登录</template>
    <div class="login_ct">
      <div class="login_logo" :style="{backgroundImage:form.uname===login.local_uname&&login.img?'url('+(login.img)+')':'', backgroundSize: form.uname===login.local_uname&&login.img?'100%':'60%'}"></div>
      <ul class="login_form">
        <li>
          <wmInput v-model:value="form.uname" icon="ui ui_user" padding="0 10px 0 40px" :placeholder="form.type==='tel'?'手机号码':'用户名 / 手机号码 / 邮箱'" @keyup.enter="clickLogin()"></wmInput>
        </li>
        <li v-if="form.type==='passwd'&&login.is_safety">
          <img class="vcode" :src="login.vcode_url" alt="点击刷新" @click="changeVcode()">
          <wmInput v-model:value="form.vcode" icon="ui ui_safety" padding="0 10px 0 40px" maxlength="4" placeholder="验证码" @keyup.enter="clickLogin()"></wmInput>
        </li>
        <li v-if="form.type==='passwd'">
          <form onsubmit="return false">
            <wmInput type="password" v-model:value="form.passwd" icon="ui ui_safety" padding="0 10px 0 40px" placeholder="请输入密码" @keyup.enter="clickLogin()"></wmInput>
          </form>
        </li>
        <li v-if="form.type==='tel'">
          <wmInput v-model:value="form.vcode" icon="ui ui_safety" padding="0 10px 0 40px" maxlength="4" placeholder="验证码" :text="login.text" @textClick="getVcode()" @keyup.enter="clickLogin()"></wmInput>
        </li>
        <li class="agreement flex_left">
          <wmCheckbox :options="login.agreement"></wmCheckbox>
          <span>已阅读并同意<b @click="router.push({path: '/base/html', query:{name:'m_user'}})">《服务协议》</b>和<b @click="router.push({path: '/base/html', query:{name:'m_service'}})">《隐私条款》</b></span>
        </li>
        <li>
          <wmButton width="100%" height="40px" @click="clickLogin()" :disabled="login.disabled">{{ login.botton_text }}</wmButton>
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
.login_logo{margin: 16px auto; width: 120px; height: 120px; background-image: url('../../assets/logo.svg'); background-size: 60%; background-repeat: no-repeat; background-position: center; background-color: #F2F4F6; border-radius: 50%; transition: All 0.5s ease-in-out;}
.login_form{overflow: hidden;}
.login_form li{position: relative; padding: 10px;}
.login_form .vcode{position: absolute; z-index: 1; height: 40px; top: 50%; right: 10px; transform: translateY(-50%); border-radius: 4px;}
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
import Time from '../../library/time';
import Safety from '../../library/safety';
import Request from '../../library/request';
import Storage from '../../library/storage';
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
let time: any;
const login = ref({
  text: '获取验证码', disabled: false, botton_text: '登 录', is_safety: false, vcode_url: '', local_uname:'', img:'', num: 60,
  agreement:{label:'', value:'agreement', checked:false}
});
const form = ref({type:'passwd', uname:'', passwd:'', vcode:''});

/* 创建完成 */
onMounted(()=>{
  const uname: string = Storage.getItem('uname') || '';
  const img: string = Storage.getItem('user_img') || '';
  form.value.uname = uname;
  login.value.local_uname = uname;
  login.value.img = img;
});

/* 登录方式 */
const changeType = (type: string): void => {
  form.value.type = type;
  if(type==='passwd') form.value.vcode = '';
  if(type==='tel') form.value.passwd = '';
}

/* 刷新验证码 */
const changeVcode = (): void => {
  let arr = login.value.vcode_url.split('?');
  login.value.vcode_url = arr[0]+'?'+Time.Time();
}

/* 获取验证码 */
const getVcode = (): void => {
  if(login.value.num!=60) return;
  // 类型
  let type: string='';
  if(Safety.IsRight('tel', form.value.uname)) type='tel';
  else return Ui.Toast('请填写手机号码');
  // 获取验证码
  const load: any = Ui.Loading();
  Request.Post('user/get_vcode', {
    type: type,
    uname: form.value.uname
  }, (res:any)=>{
    load.clear();
    const {code, msg, data}: any = res.data;
    if(code==0) {
      vcodeTime();
      form.value.vcode = data.toString();
    }else if(code==4001) {
      login.value.num = data;
      vcodeTime();
    }
    return Ui.Toast(msg);
  });
}
/* 验证码倒计时 */
const vcodeTime = (): void => {
  clearInterval(time);
  time = setInterval(()=>{
    login.value.num--;
    login.value.text = login.value.num+ ' 秒后重试';
    if(login.value.num<=0) {
      clearInterval(time);
      login.value.num = 60;
      login.value.text = '重新发送';
    }
  }, 1000);
}

/* 验证 */
const verify = (form: any): any => {
  if(form.type==='passwd') {
    if(form.uname.trim().length<4) return Ui.Toast('请输入帐号');
    if(form.passwd.length<6) return Ui.Toast('请输入密码');
    if(login.value.is_safety && form.vcode.length!=4) return Ui.Toast('请输入验证码');
  } else if(form.type==='tel') {
    if(form.uname.trim().length!==11) return Ui.Toast('请输入手机号码');
    if(form.vcode.length!==4) return Ui.Toast('请输入验证码');
  }
  // 服务协议
  if(!login.value.agreement.checked) return Ui.Toast('请阅读并同意服务协议');
  return form;
}

/* 登录 */
const clickLogin = (): void => {
  // 验证
  const data = verify(form.value);
  if(!data) return;
  // 请求
  login.value.disabled = true;
  login.value.botton_text = '正在登录';
  Request.Post('user/login', {
    uname: data.uname,
    passwd: data.passwd,
    vcode: data.vcode,
  }, (res:any)=>{
    login.value.disabled = false;
    login.value.botton_text = '重试';
    // 数据
    const {code, msg, data, vcode_url}: any = res.data;
    if(code===0) {
      login.value.is_safety = false;
      login.value.img = data.uinfo.img;
      form.value.passwd = '';
      form.value.vcode = '';
      // 缓存信息
      state.isLogin = true;
      state.token = data.token;
      state.uinfo = data.uinfo;
      Storage.setItem('token', data.token);
      Storage.setItem('uname', data.uinfo.uname);
      Storage.setItem('uinfo', JSON.stringify(data.uinfo));
      Storage.setItem('user_img', data.uinfo.img);
      // 返回
      router.go(-1);
    } else {
      // 验证
      form.value.vcode = '';
      if(vcode_url && code==4001){
        // 开启验证
        login.value.is_safety = true;
        login.value.vcode_url = vcode_url;
      }else if(vcode_url && code==4002){
        // 验证码错误
        changeVcode();
      }else{
        // 帐号密码错误
        login.value.is_safety = false;
        form.value.passwd = '';
        form.value.vcode = '';
      }
      return Ui.Toast(msg);
    }
  });
}

</script>