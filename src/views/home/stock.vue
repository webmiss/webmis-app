<template>
  <PageView bgColor="#0064C8" barColor="#FFF" barBgColor="#0064C8" barShadow="">
    <template #bar_title>
      <div class="home_sea flex_center" @click="router.push({path: '/base/goods'})">
        <i class="ui ui_search"></i><span>货品查询</span>
      </div>
    </template>
    <ScrollView v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false">
      <div class="home_body">
        <div class="bubble bubble1" :style="{left: bubble.left1+'%', top: bubble.top1+'%'}"></div>
        <div class="bubble bubble2" :style="{left: bubble.left2+'%', top: bubble.top2+'%'}"></div>
        <div class="home_stock">
          <div class="waves">
            <div id="wave1" class="wave"></div>
            <div id="wave2" class="wave"></div>
            <div id="wave3" class="wave"></div>
            <div id="wave4" class="wave"></div>
          </div>
          <div class="title">剩余库存</div>
          <div class="num"><b @click="router.push({path: '/purchase/stock'})">{{ total.list.num || 0 }}</b></div>
          <div class="day">{{ total.time?total.time.split(' ')[0]:'年/月/日' }}</div>
          <div class="time">{{ total.time?total.time.split(' ')[1]:'00:00:00' }}</div>
        </div>
        <div class="home_total">
          <ul class="flex_center">
            <li :class="homeForm.active==='today'?'active':''" @click="changeDay('today')">今日</li>
            <li :class="homeForm.active==='yesterday'?'active':''" @click="changeDay('yesterday')">昨日</li>
            <li :class="homeForm.active==='week'?'active':''" @click="changeDay('week')">近7天</li>
            <li :class="homeForm.active==='month'?'active':''" @click="changeDay('month')">近1月</li>
          </ul>
        </div>
        <ul class="home_total_list flex">
          <li>
            <div class="title">采购入库</div>
            <div class="num flex" @click="router.push({path: '/purchase/in', query: {time: homeForm.active}})">
              <h3>{{ total.list.now.in_num || 0 }}</h3>
              <span v-html="total.list.now.in_num?getRatio(total.list.now.in_num, total.list.old.in_num):'-'"></span>
            </div>
          </li>
          <li>
            <div class="title">采购退货</div>
            <div class="num flex" @click="router.push({path: '/purchase/out', query: {time: homeForm.active}})">
              <h3>{{ total.list.now.out_num || 0 }}</h3>
              <span v-html="total.list.now.out_num?getRatio(total.list.now.out_num, total.list.old.out_num):'-'"></span>
            </div>
          </li>
          <li>
            <div class="title">调拨出</div>
            <div class="num flex" @click="router.push({path: '/allocate/out', query: {time: homeForm.active}})">
              <h3>{{ total.list.now.allocate_out || 0 }}</h3>
              <span v-html="total.list.now.allocate_out?getRatio(total.list.now.allocate_out, total.list.old.allocate_out):'-'"></span>
            </div>
          </li>
          <li>
            <div class="title">调拨入</div>
            <div class="num flex" @click="router.push({path: '/allocate/in', query: {time: homeForm.active}})">
              <h3>{{ total.list.now.allocate_in || 0 }}</h3>
              <span v-html="total.list.now.allocate_in?getRatio(total.list.now.allocate_in, total.list.old.allocate_in):'-'"></span>
            </div>
          </li>
          <li>
            <div class="title">
              <span class="title_num" @click="router.push({path: '/order/out', query: {time: homeForm.active, state: '1'}})">
                销售出仓<span class="redNum">{{ total.list.pay_num<99?total.list.pay_num:99 }}</span>
              </span>
            </div>
            <div class="num flex" @click="router.push({path: '/order/out', query: {time: homeForm.active}})">
              <h3>{{ total.list.now.order_out || 0 }}</h3>
              <span v-html="total.list.now.order_out?getRatio(total.list.now.order_out, total.list.old.order_out):'-'"></span>
            </div>
          </li>
          <li>
            <div class="title">售后退货</div>
            <div class="num flex" @click="router.push({path: '/order/in', query: {time: homeForm.active}})">
              <h3>{{ total.list.now.order_in || 0 }}</h3>
              <span v-html="total.list.now.order_in?getRatio(total.list.now.order_in, total.list.old.order_in):'-'"></span>
            </div>
          </li>
        </ul>
      </div>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
/* 首页 */
.home_sea{display: inline-block; margin: 0 auto; padding: 0 16px; height: 40px; line-height: 40px; font-size: 16px; color: rgba(255,255,255,0.8); border-radius: 20px;}
.home_sea:active{background-color: rgba(255,255,255,0.04);}
.home_body{overflow: hidden; position: relative; min-height: calc(100% - 20px); padding: 10px; color: #FFF;}
.home_body .bubble{position: absolute; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%); transition: all 15s ease; transform: translateZ(0);}
.home_body .bubble1{width: 160px; height: 160px; left: 1%; top: 3%;}
.home_body .bubble2{width: 320px; height: 320px; left: 40%; top: 20%;}
.home_stock{overflow: hidden; position: relative; margin: 10px auto; width: 210px; height: 210px; border: rgba(255,255,255,0.3) 3px solid; border-left-color: @Primary; border-right-color: @Primary; text-align: center; border-radius: 50%; background: #007DFF;}
.home_stock div{position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);}
.home_stock .title{margin-top: -40px; line-height: 24px; font-size: 14px;}
.home_stock .num{position: relative; z-index: 2; line-height: 60px; display: flex; justify-content: center; text-align: center;}
.home_stock .num b{padding: 0 8px; font-size: 36px; text-shadow: 0 0 4px rgba(0,0,0,0.3);}
.home_stock .day{position: relative; z-index: 2; line-height: 20px; font-size: 14px;}
.home_stock .time{position: relative; z-index: 2; line-height: 20px; font-size: 12px;}
/* 首页-水波纹 */
.home_stock .waves{position: absolute; z-index: 1; top: 100%; width: 100%; height: 100px; zoom: 0.74;}
.home_stock .wave{position: absolute; top: 0px; left: 50%; width: 100%; height: 100%; background: url(../../assets/img/wave.svg); background-size: 990px 100px;}
.home_stock .wave#wave1 {z-index: 1000; opacity: 1; bottom: 0; animation: animateWave 6s linear infinite;}
.home_stock .wave#wave2 {z-index: 999; opacity: 0.5; bottom: 10px; animation: animateWave2 6s linear infinite;}
.home_stock .wave#wave3 {z-index: 1000; opacity: 0.2; bottom: 15px; animation: animateWave 4s linear infinite;}
.home_stock .wave#wave4 {z-index: 999; opacity: 0.7; bottom: 20px; animation: animateWave2 4s linear infinite;}
@keyframes animateWave { 0% {background-position: 1000px;} 100% {background-position-x: 0px;}}
@keyframes animateWave2 { 0% {background-position: 0px;} 100% {background-position-x: 1000px;}}
/* 首页-统计 */
.home_total{position: relative; line-height: 40px; padding: 4px 0; margin-top: 30px;}
.home_total ul{margin: 0 auto; padding: 0 8px;}
.home_total li{flex: 1; padding: 0 16px; margin: 0 8px; border-radius: 20px; text-align: center; color: rgba(255,255,255,0.8);}
.home_total .active{color: #FFF; background-color: #007DFF; font-weight: bold;}
.home_total_list{position: relative; margin: 10px auto; border-top: rgba(255,255,255,0.08) 1px solid;}
.home_total_list li{width: 50%; padding: 10px; border-bottom: rgba(255,255,255,0.04) 1px solid; box-sizing: border-box;}
.home_total_list li:nth-child(odd){border-right: rgba(255,255,255,0.04) 1px solid;}
.home_total_list .title{padding: 0 8px; line-height: 30px; font-size: 12px; color: rgba(255,255,255,0.8);}
.home_total_list .title_num{position: relative;}
.home_total_list .title_num .redNum{top: -8px; right: -14px;}
.home_total_list .num{position: relative; line-height: 40px;}
.home_total_list .num h3{padding: 0 8px; font-size: 25px;}
.home_total_list .green{color: @Success;}
.home_total_list .red{color: @Danger;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
import Util from '../../library/utils';
import Request from '../../library/request';
import Time from '../../library/time';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
let time: any = null;
const scroll = ref({refreshing: false, loading: false, finished: false});
const total = ref({time: '', list: <any>{now:<any>{}, old:<any>{}}});
const homeForm = ref({active:'', stime: '', etime: ''});
const bubble = ref({left1:1, top1:3, left2:40, top2:20});

/* 监听 */
watch(()=>state.isLogin, (val: boolean)=>{
  if(val) {
    changeDay(homeForm.value.active?homeForm.value.active:'today');
  }
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
  // 背景动画
  setTimeout(()=>{ homeAnimation(); }, 3000);
  clearInterval(time);
  time = setInterval(()=>{ homeAnimation(); }, 20000);
});

/* 首页-动画 */
const homeAnimation = (): void => {
  bubble.value.left1 = Util.getRandomInt(1, 20);
  bubble.value.top1 = Util.getRandomInt(3, 70);
  bubble.value.left2 = Util.getRandomInt(10, 60);
  bubble.value.top2 = Util.getRandomInt(30, 80);
}

/* 首页-切换时间 */
const changeDay = (active: string): void => {
  homeForm.value.active = active;
  switch(active) {
    case 'today':
      homeForm.value.stime = Time.Date('Y/m/d');
      homeForm.value.etime = Time.Date('Y/m/d');
      break;
    case 'yesterday':
      homeForm.value.stime = Time.Date('Y/m/d', Time.StrToTime('-1 day'));
      homeForm.value.etime = Time.Date('Y/m/d', Time.StrToTime('-1 day'));
      break;
    case 'week':
      homeForm.value.stime = Time.Date('Y/m/d', Time.StrToTime('-7 day'));
      homeForm.value.etime = Time.Date('Y/m/d');
      break;
    case 'month':
      homeForm.value.stime = Time.Date('Y/m/d', Time.StrToTime('-1 month'));
      homeForm.value.etime = Time.Date('Y/m/d');
      break;
  }
  loadData();
}

/* 首页-数据 */
const loadData = (): void => {
  if(!state.token) return;
  // 统计-库存
  total.value.list.num = 0;
  total.value.list.pay_num = 0;
  Request.Post('stock/total', {
    token: state.token,
    data: {type: 'index', st: homeForm.value.stime, et: homeForm.value.etime},
  }, (res:any)=>{
    scroll.value.refreshing = false;
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      total.value.list.num = data.num;
      total.value.list.pay_num = data.pay_num;
    } else Ui.Toast(msg);
  });
  // 统计-全部
  total.value.list.now = {};
  total.value.list.old = {};
  Request.Post('stock/total_all', {
    token: state.token,
    data: homeForm.value,
  }, (res:any)=>{
    scroll.value.refreshing = false;
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      total.value.list.now = data.now;
      total.value.list.old = data.old;
    } else Ui.Toast(msg);
  });
}

/* 首页-比例 */
const getRatio = (now: number, old: number): string => {
  const ratio: number = old?(now-old)/old*100:100;
  return ratio>0?'<b style="color: #FF6600; font-size: 14px;">'+ratio.toFixed(1)+'%</b>':'<b style="color: #6AD177; font-size: 14px;">'+ratio.toFixed(1)+'%</b>'
}

</script>