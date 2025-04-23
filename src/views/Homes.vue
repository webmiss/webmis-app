<template>
  <TabBar v-model:active="tabbar.active" :color="tabbar.color" :bgColor="tabbar.bgColor" :activeColor="tabbar.activeColor" :columns="tabbar.columns" @update:change="tabChange">
    <template #home>
      <PageView bgColor="#0064C8" barColor="#FFF" barBgColor="#0064C8" barShadow="">
        <template #bar_title>
          <div class="home_sea flex_center"><i class="ui ui_search"></i><span>货品查询</span></div>
        </template>
        <ScrollView v-model:refreshing="scrollHome.refreshing" @refresh="loadData" :isLower="false">
          <div class="home_body">
            <div class="bubble bubble1" :style="{left: bubble.left1+'%', top: bubble.top1+'%'}"></div>
            <div class="bubble bubble2" :style="{left: bubble.left2+'%', top: bubble.top2+'%'}"></div>
            <div class="home_stock">
              <div class="title">剩余库存</div>
              <div class="num">239405</div>
              <div class="day">2025/04/19</div>
              <div class="time">14:24:32</div>
            </div>
            <div class="home_total">
              <ul class="flex_center">
                <li class="active">今日</li>
                <li>昨日</li>
                <li>近7天</li>
                <li>近1月</li>
              </ul>
            </div>
            <ul class="home_total_list flex">
              <li>
                <div class="title">采购入库</div>
                <div class="num flex"><h3>201</h3><span class="red">+10.52%</span></div>
              </li>
              <li>
                <div class="title">采购退货</div>
                <div class="num flex"><h3>168</h3><span class="green">-8.36%</span></div>
              </li>
              <li>
                <div class="title">调拨出</div>
                <div class="num flex"><h3>298</h3><span class="green">-4.53%</span></div>
              </li>
              <li>
                <div class="title">调拨入</div>
                <div class="num flex"><h3>309</h3><span class="red">+3.08%</span></div>
              </li>
              <li>
                <div class="title">销售出仓</div>
                <div class="num flex"><h3>24</h3><span class="green">-39.73%</span></div>
              </li>
              <li>
                <div class="title">售后退货</div>
                <div class="num flex"><h3>16</h3><span class="green">-9.16%</span></div>
              </li>
            </ul>
          </div>
        </ScrollView>
      </PageView>  
    </template>
    <template #msg>
      <PageView bgColor="linear-gradient(to bottom, #FFF 0%, #F8F8F8 100%)" barColor="#FFF" barBgColor="#007DFF">
        <template #bar_title>消息中心</template>
        <div class="msg_sea_body">
          <div class="msg_sea flex_center"><i class="ui ui_search"></i><span>搜索</span></div>
        </div>
        <div class="msg_body">
          <ScrollView v-model:refreshing="scrollMsg.refreshing" @refresh="loadData" :isLower="false">
            <ul class="msg_list">
              <li class="flex mtop1">
                <div class="img"><i class="ui ui_menus"></i></div>
                <div class="msg_list_info">
                  <div class="title flex">
                    <h2>订单信息</h2><span class="time">10:20</span>
                  </div>
                  <div class="msg flex">
                    <span class="text nowrap">S2504152003 已结算</span><span class="num">2</span>
                  </div>
                </div>
              </li>
              <li class="flex mtop1">
                <div class="img"><i class="ui ui_user"></i></div>
                <div class="msg_list_info">
                  <div class="title flex">
                    <h2>Hewen</h2><span class="time">09:53</span>
                  </div>
                  <div class="msg flex">
                    <span class="text nowrap">你好，中午吃什么好</span><span class="num">1</span>
                  </div>
                </div>
              </li>
              <li class="flex mtop1">
                <div class="img"><i class="ui ui_user"></i></div>
                <div class="msg_list_info">
                  <div class="title flex">
                    <h2>Liu Hongchun</h2><span class="time">昨天</span>
                  </div>
                  <div class="msg flex">
                    <span class="text nowrap">可能今天又要加班了</span>
                  </div>
                </div>
              </li>
              <li class="flex mtop1">
                <div class="img"><i class="ui ui_user"></i></div>
                <div class="msg_list_info">
                  <div class="title flex">
                    <h2>Li zhikun</h2><span class="time">04-17</span>
                  </div>
                  <div class="msg flex">
                    <span class="text nowrap">今天进展不错，已提前完成上个月目标。</span>
                  </div>
                </div>
              </li>
              <li class="flex mtop1">
                <div class="img"><i class="ui ui_user"></i></div>
                <div class="msg_list_info">
                  <div class="title flex">
                    <h2>Anjie</h2><span class="time">04-16</span>
                  </div>
                  <div class="msg flex">
                    <span class="text nowrap">[图片]</span>
                  </div>
                </div>
              </li>
              <li class="flex mtop1">
                <div class="img"><i class="ui ui_user"></i></div>
                <div class="msg_list_info">
                  <div class="title flex">
                    <h2>Hong Liwei</h2><span class="time">04-16</span>
                  </div>
                  <div class="msg flex">
                    <span class="text nowrap">[语音]</span>
                  </div>
                </div>
              </li>
            </ul>
          </ScrollView>
        </div>
      </PageView>
    </template>
    <template #me>
      <PageView bgColor="linear-gradient(to bottom, #007DFF 0%, #007DFF 50%, #FFF 50%, #F8F8F8 100%)" barBgColor="#007DFF" barShadow="">
        <template #bar_left>
          <div class="me_ico"><i class="ui ui_scan"></i></div>
        </template>
        <template #bar_right>
          <div class="me_ico"><i class="ui ui_setting" @click="openUrl('/user/setup')"></i></div>
        </template>
        <ScrollView v-model:refreshing="scrollMe.refreshing" @refresh="loadData" :isLower="false">
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
              <li class="flex mtop10" @click="openUrl('/base/html', {name:'m_user'})">
                <div class="flex ico"><i class="ui ui_order"></i><b>服务协议</b></div>
                <div class="flex"><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="flex mtop1" @click="openUrl('/base/html', {name:'m_service'})">
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
  </TabBar>
</template>

<style lang="less" scoped>
/* 首页 */
.home_sea{margin: 0 auto; width: calc(100% - 40px); height: 40px; line-height: 40px; font-size: 16px; color: rgba(255,255,255,0.8); background-color: rgba(255,255,255,0.08); border-radius: 20px;}
.home_body{overflow: hidden; position: relative; min-height: calc(100% - 20px); padding: 10px; color: #FFF;}
.home_body .bubble{position: absolute; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%); transition: all 15s ease; transform: translateZ(0);}
.home_body .bubble1{width: 160px; height: 160px; left: 1%; top: 3%;}
.home_body .bubble2{width: 320px; height: 320px; left: 40%; top: 20%;}
.home_stock{position: relative; margin: 10px auto; width: 210px; height: 210px; border: rgba(255,255,255,0.3) 3px solid; border-left-color: @Primary; border-right-color: @Primary; text-align: center; border-radius: 50%; background: #007DFF;}
.home_stock div{position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);}
.home_stock .title{margin-top: -40px; line-height: 20px; font-size: 14px;}
.home_stock .num{line-height: 60px; padding: 0 16px; font-size: 36px; font-weight: bold; text-shadow: 0 0 4px rgba(0,0,0,0.3);}
.home_stock .day{margin-top: 50px; line-height: 20px; font-size: 14px;}
.home_stock .time{margin-top: 70px; line-height: 20px; font-size: 12px;}
.home_total{line-height: 40px; padding: 4px 0; margin-top: 30px;}
.home_total ul{margin: 0 auto;}
.home_total li{padding: 0 16px; margin: 0 8px; border-radius: 20px; color: rgba(255,255,255,0.8);}
.home_total .active{color: #FFF; background-color: #007DFF; font-weight: bold;}
.home_total_list{margin: 10px auto; max-width: 1024px; border-top: rgba(255,255,255,0.1) 1px solid;}
.home_total_list li{width: 50%; padding: 10px; border-bottom: rgba(255,255,255,0.1) 1px solid; box-sizing: border-box;}
.home_total_list li:nth-child(odd){border-right: rgba(255,255,255,0.1) 1px solid;}
.home_total_list .title{line-height: 32px; font-size: 12px; color: rgba(255,255,255,0.8);}
.home_total_list .num{position: relative; line-height: 28px;}
.home_total_list h3{font-size: 21px;}
.home_total_list span{position: absolute; right: 0; font-size: 14px;}
.home_total_list .green{color: @Success;}
.home_total_list .red{color: @Danger;}
/* 消息 */
.msg_sea_body{padding: 10px; background-color: #FFF;}
.msg_sea{height: 40px; line-height: 40px; font-size: 16px; color: @IconColor; background-color: #F2F4F8; border-radius: 20px;}
.msg_sea i{display: inline-block; width: 32px; font-size: 20px; text-align: center;}
.msg_body{width: 100%; height: calc(100% - 60px);}
.msg_list{overflow: hidden;}
.msg_list li{padding: 10px 16px; background-color: #FFF;}
.msg_list .img{width: 56px; height: 56px; line-height: 56px; text-align: center; background-color: #F2F4F8; border-radius: 50%;}
.msg_list .img i{font-size: 28px; color: @IconColor;}
.msg_list_info{width: calc(100% - 72px);}
.msg_list_info .title{line-height: 32px;}
.msg_list_info h2{font-size: 16px; font-weight: bold;}
.msg_list_info .time{font-size: 12px; color: @Info;}
.msg_list_info .msg{line-height: 20px;}
.msg_list_info .text{display: block; width: calc(100% - 40px); color: @Info;}
.msg_list_info .num{padding: 0 6px; font-size: 12px; background-color: @Danger; color: #FFF; border-radius: 10px;}
/* 我的 */
.me_ico{height: 40px;}
.me_ico i{display: inline-block; width: 40px; height: 100%; text-align: center; color: #FFF;}
.me_ico .ui_scan{font-size: 24px;}
.me_ico .ui_setting{font-size: 24px;}
.me_body{overflow: hidden; background-color: #F8F8F8;}
.me_top{position: relative; height: 280px; background-color: #FFF;}
.me_bg{position: absolute; z-index: 1; width: 120%; height: 48%; left: 50%; transform: translateX(-50%); border-radius: 0 0 50% 50%; background: #007DFF;}
.me_logo{position: absolute; z-index: 2; width: 120px; height: 120px; left: 50%; top: 46%; transform: translate(-50%, -50%); border-radius: 50%; border: #FFF 1px solid; background-image: url('../assets/logo.svg'); background-size: 60%; background-color: #F2F4F8; background-repeat: no-repeat; background-position: center;}
.me_info{position: absolute; padding: 16px 0; bottom: 0; text-align: center; left: 50%; transform: translateX(-50%);}
.me_info h1{line-height: 40px; font-size: 21px;}
.me_info span{line-height: 24px; color: @Info; font-size: 12px;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../library/ui';
import Util from '../library/utils';
import Request from '../library/request';
import Storage from '../library/storage';
/* 组件 */
import TabBar from '../components/tabs/tabbar.vue';
import PageView from '../components/view/page.vue';
import ScrollView from '../components/view/scroll.vue';

defineOptions({name: 'Home'});
// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const tabbar = ref({active: 'home', color: '', bgColor: '', activeColor: '', columns:[
  {label: '首页', icon: 'icons icon_home', slot: 'home'},
  {label: '消息', icon: 'icons icon_msg', slot: 'msg'},
  {label: '我的', icon: 'icons icon_me', slot: 'me'},
]});
const scrollHome = ref({refreshing: false, loading: false, finished: false});
const scrollMsg = ref({refreshing: false, loading: false, finished: false});
const scrollMe = ref({refreshing: false, loading: false, finished: false});
const bubble = ref({left1:1, top1:3, left2:40, top2:20});
let time: any = null;

/* 监听 */
watch(()=>route.path, (now: string)=>{
  if(now!=='/') clearInterval(time);
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
  tabChange({slot: 'home'});
});
onActivated(()=>{
  if(!state.isLogin) {
    router.push({path: '/user/login'});
  } else {
    // 首页背景动画
    setTimeout(()=>{ homeAnimation(); }, 3000);
    time = setInterval(()=>{ homeAnimation(); }, 20000);
  }
});

/* 登录 */
const openUrl = (url: string, params: any={}): void => {
  if(!state.isLogin) router.push({path: '/user/login'});
  router.push({path: url, query: params});
}

/* 切换菜单 */
const tabChange = (d: any): void => {
  if(d.slot==='home') {
    tabbar.value.color = 'rgba(255,255,255,0.7)';
    tabbar.value.bgColor = '#0064C8';
    tabbar.value.activeColor = '#FFF';
  } else {
    tabbar.value.color = '#999';
    tabbar.value.bgColor = '#FFF';
    tabbar.value.activeColor = '#0064C8';
  }
}

/* 首页动画 */
const homeAnimation = (): void => {
  bubble.value.left1 = Util.getRandomInt(1, 20);
  bubble.value.top1 = Util.getRandomInt(3, 70);
  bubble.value.left2 = Util.getRandomInt(10, 60);
  bubble.value.top2 = Util.getRandomInt(30, 80);
}

/* 加载数据 */
const loadData = (): void => {
  console.log('首页数据');
}

</script>