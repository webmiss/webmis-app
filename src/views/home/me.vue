<template>
  <PageView bgColor="linear-gradient(to bottom, #007DFF 0%, #007DFF 50%, #FFF 50%, #F8F8F8 100%)" barBgColor="#007DFF" barShadow="">
    <template #bar_left>
      <div class="me_ico"><i class="ui ui_scan" @click="openScan()"></i></div>
    </template>
    <template #bar_right>
      <div class="me_ico"><i class="ui ui_setting" @click="openUrl('/user/setup')"></i></div>
    </template>
    <ScrollView :isUpper="false" :isLower="false">
      <div class="me_body">
        <div class="me_top">
          <div class="me_bg"></div>
          <div class="me_logo" :style="{backgroundImage:state.uinfo.img?'url('+(state.uinfo.img)+')':'', backgroundSize: state.uinfo.img?'100%':'60%'}" @click="openUrl('/user/info')"></div>
          <div class="me_info">
            <h1>{{ state.uinfo.nickname || '请设置' }}</h1>
            <span>部门: {{ state.uinfo.department || '-' }}&nbsp;&nbsp;职务: {{ state.uinfo.position || '-' }}</span>
          </div>
        </div>
        <ul class="menu_list mbottom10">
          <li class="flex mtop10" @click="openUrl('/user/info')">
            <div class="flex ico"><i class="ui ui_user"></i><b>个人资料</b></div>
            <div class="flex"><i class="ui ui_arrow_right"></i></div>
          </li>
          <li class="flex mtop1">
            <div class="flex ico"><i class="ui ui_edit"></i><b>意见反馈</b></div>
            <div class="flex"><i class="ui ui_arrow_right"></i></div>
          </li>
          <li class="flex mtop10" @click="openUrl('/base/html', {name:'m_service'})">
            <div class="flex ico"><i class="ui ui_order"></i><b>服务协议</b></div>
            <div class="flex"><i class="ui ui_arrow_right"></i></div>
          </li>
          <li class="flex mtop1" @click="openUrl('/base/html', {name:'m_privacy'})">
            <div class="flex ico"><i class="ui ui_safety"></i><b>隐私政策</b></div>
            <div class="flex"><i class="ui ui_arrow_right"></i></div>
          </li>
          <li class="flex mtop10" @click="openUrl('/user/setup')">
            <div class="flex ico"><i class="ui ui_setting"></i><b>设置</b></div>
            <div class="flex"><i class="ui ui_arrow_right"></i></div>
          </li>
        </ul>
      </div>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
/* 我的 */
.me_ico{height: 40px;}
.me_ico i{display: inline-block; width: 40px; height: 100%; text-align: center; color: #FFF;}
.me_ico .ui_scan{font-size: 24px;}
.me_ico .ui_setting{font-size: 24px;}
.me_body{overflow: hidden; background-color: #F8F8F8;}
.me_top{position: relative; height: 280px; background-color: #FFF;}
.me_bg{position: absolute; z-index: 1; width: 120%; height: 48%; left: 50%; transform: translateX(-50%); border-radius: 0 0 50% 50%; background: #007DFF;}
.me_logo{position: absolute; z-index: 2; width: 128px; height: 128px; left: 50%; top: 46%; transform: translate(-50%, -50%); border-radius: 50%; border: #FFF 1px solid; background-image: url('../../assets/logo.svg'); background-size: 60%; background-color: #F8F8F8; background-repeat: no-repeat; background-position: center;}
.me_info{position: absolute; padding: 16px 0; bottom: 0; text-align: center; left: 50%; transform: translateX(-50%);}
.me_info h1{line-height: 40px; font-size: 21px;}
.me_info span{line-height: 24px; color: @Info; font-size: 12px;}
</style>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 公共
const { proxy } = getCurrentInstance() as any ;
// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});

/* 打开连接 */
const openUrl = (url: string, params: any={}): void => {
  if(!state.isLogin) router.push({path: '/user/login'});
  router.push({path: url, query: params});
}

/* 我的-扫码 */
const openScan = async (): Promise<void> => {
  const res = await proxy.$showScan({title:'扫码登录'});
  if(res.confirm) console.log(res.content);
}

</script>