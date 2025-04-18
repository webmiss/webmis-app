<template>
  <TabBar v-model:active="tabbar.active" :color="tabbar.color" :bgColor="tabbar.bgColor" :activeColor="tabbar.activeColor" :columns="tabbar.columns" @update:change="tabChange">
    <template #index>
      <span @click="router.push({path: '/demo'})">测试</span>
    </template>
    <template #msg>
      Msg
    </template>
    <template #me>
      <PageView :immersed="true" bgColor="linear-gradient(to bottom, #007DFF 0%, #007DFF 50%, #F2F4F8 50%, #F2F4F8 100%)" barBgColor="#007DFF" barShadow="">
        <ScrollView v-model:refreshing="scrollMe.refreshing" @refresh="loadData" :isLower="false">
          <div class="home_me_body">
            <div class="home_me_top">
              <div class="home_me_bg"></div>
              <div class="home_me_logo"></div>
              <div class="home_me_info">
                <h1>用户昵称</h1>
                <span>部门: 信息技术&nbsp;&nbsp;职务: 软件开发</span>
              </div>
            </div>
            <ul class="home_me_list">
              <li class="mtop10">
                <div class="flex ico"><i class="ui ui_user"></i><b>个人信息</b></div>
                <div class="flex"><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><i class="ui ui_user"></i><b>意见反馈</b></div>
                <div class="flex"><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="mtop10">
                <div class="flex ico"><i class="ui ui_user"></i><b>服务协议</b></div>
                <div class="flex"><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><i class="ui ui_user"></i><b>隐私政策</b></div>
                <div class="flex"><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><i class="ui ui_user"></i><b>关于我们</b></div>
                <div class="flex"><span>{{ Env.version }}</span><i class="ui ui_arrow_right"></i></div>
              </li>
            </ul>
          </div>
          <div class="bLine"></div>
        </ScrollView>
      </PageView>
    </template>
  </TabBar>
</template>

<style lang="less" scoped>
.home_me_body{overflow: hidden; background-color: #F2F4F8;}
.home_me_top{position: relative; height: 300px; background-color: #FFF;}
.home_me_bg{position: absolute; z-index: 1; width: 120%; height: 54%; left: 50%; transform: translateX(-50%); border-radius: 0 0 50% 50%; background-color: #007DFF;}
.home_me_logo{position: absolute; z-index: 2; width: 120px; height: 120px; left: 50%; top: 54%; transform: translate(-50%, -50%); border-radius: 50%; border: #FFF 2px solid; background-color: #F2F4F8; background-image: url('../assets/logo.svg'); background-size: 60%; background-repeat: no-repeat; background-position: center;}
.home_me_info{position: absolute; padding: 8px 0; width: 100%; bottom: 0; text-align: center;}
.home_me_info h1{line-height: 40px; font-size: 21px;}
.home_me_info span{line-height: 24px; color: @Info; font-size: 12px;}
.home_me_list{overflow: hidden;}
.home_me_list li{height: 40px; line-height: 40px; padding: 8px 10px 8px 16px; background-color: #FFF; display: flex; justify-content: space-between; flex-wrap: wrap;}
.home_me_list i{display: inline-block; text-align: center;}
.home_me_list b{padding: 0 5px;}
.home_me_list .ico i{width: 40px; font-size: 20px; background-color: #F2F4F8; border-radius: 50%;}
.home_me_list span{font-size: 14px; color: @Info;}
.home_me_list .ui_arrow_right{width: 28px; font-size: 14px; color: @Info;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Env from '../config/Env';
import Ui from '../library/ui';
/* 组件 */
import TabBar from '../components/tabs/tabbar.vue';
import PageView from '../components/view/page.vue';
import ScrollView from '../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const tabbar = ref({active: 'index', color: '', bgColor: '', activeColor: '', columns:[
  {label: '首页', icon: 'icons icon_home', slot: 'index'},
  {label: '消息', icon: 'icons icon_msg', slot: 'msg'},
  {label: '我的', icon: 'icons icon_me', slot: 'me'},
]});
const scrollMe = ref({refreshing: false, loading: false, finished: false});

/* 监听 */
watch(()=>state.isLogin, (isLogin: boolean)=>{
  if(isLogin) loadData();
  else login();
},{ deep: true });

/* 创建完成 */
onMounted(()=>{
  tabChange({slot: 'index'});
});
onActivated(()=>{
  // if(!state.isLogin) login();
});

/* 登录 */
const login = (): void => {
  setTimeout(()=>{ router.push({path: '/user/login'}); }, 1000);
}

/* 切换菜单 */
const tabChange = (d: any): void => {
  if(d.slot==='index') {
    tabbar.value.color = 'rgba(255,255,255,0.7)';
    tabbar.value.bgColor = '#0064C8';
    tabbar.value.activeColor = '#FFF';
  } else {
    tabbar.value.color = '#999';
    tabbar.value.bgColor = '#FFF';
    tabbar.value.activeColor = '#0064C8';
  }
}

/* 加载数据 */
const loadData = (): void => {
  console.log('首页数据');
}

</script>