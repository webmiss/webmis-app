<template>
  <PageView bgColor="linear-gradient(to bottom, #FFF 0%, #F8F8F8 100%)" barColor="#FFF" barBgColor="#007DFF">
    <template #bar_title>消息中心</template>
    <div class="msg_sea_body">
      <div class="msg_sea flex_center" @click="sea.show=true">
        <i class="ui ui_search"></i><span>搜索</span>
      </div>
    </div>
    <div class="msg_body">
      <ScrollView ref="scrollObj" v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false">
        <ul class="msg_list" v-if="state.msg.group.length>0">
          <li class="flex mtop1" v-for="v in state.msg.group" @click="msgClick(v)">
            <div class="bgImg" :style="{backgroundImage: v.img?'url('+v.img+')':''}">
              <i class="ui ui_user" v-if="!v.img"></i>
            </div>
            <div class="msg_list_info">
              <div class="title flex">
                <h2>{{ v.title }}</h2>
                <span class="time">{{ getMsgDate(v.time) }}</span>
              </div>
              <div class="msg flex">
                <span class="text nowrap" v-if="v.sendContent">[草稿]{{ v.sendContent}}</span>
                <span class="text nowrap" v-else>{{ v.content}}</span>
                <span class="num" v-if="v.num">{{ v.num }}</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="null" v-else></div>
      </ScrollView>
    </div>
  </PageView>
  <!-- 搜索 -->
  <Search v-model:show="sea.show" @confirm="searchClick"></Search>
</template>

<style lang="less" scoped>
/* 消息 */
.msg_sea_body{padding: 10px; background-color: #FFF;}
.msg_sea{height: 40px; line-height: 40px; font-size: 16px; color: @IconColor; background-color: #F2F4F8; border-radius: 20px;}
.msg_sea i{display: inline-block; width: 32px; font-size: 20px; text-align: center;}
.msg_body{width: 100%; height: calc(100% - 60px);}
.msg_list{overflow: hidden;}
.msg_list li{padding: 10px 16px; background-color: #FFF;}
.msg_list .bgImg{width: 56px; height: 56px; line-height: 56px; text-align: center; background-color: #F2F4F8; border-radius: 50%;}
.msg_list .bgImg i{font-size: 28px; color: @IconColor;}
.msg_list_info{width: calc(100% - 72px);}
.msg_list_info .title{line-height: 32px;}
.msg_list_info h2{font-size: 16px; font-weight: bold;}
.msg_list_info .time{font-size: 12px; color: @Info;}
.msg_list_info .msg{line-height: 20px;}
.msg_list_info .text{display: block; width: calc(100% - 40px); color: @Info;}
.msg_list_info .num{padding: 0 6px; font-size: 12px; background-color: @Danger; color: #FFF; border-radius: 10px;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
/* JS组件 */
import Request from '../../library/request';
import Ui from '../../library/ui';
import Time from '../../library/time';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';
import Search from './search.vue';

// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const scrollObj = ref();
const scrollTop = ref(0);
// 消息
const sea = ref({show:false, key:'', list:<any>[]});

/* 监听 */
watch(()=>state.isLogin, (val: boolean)=>{
  if(val) {
    loadData();
  }
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
});
onActivated(()=>{
  // 跳转位置
  nextTick(()=>{
    scrollObj.value.setScrollTop(scrollTop.value);
  });
});
/* 离开页面 */
onBeforeRouteLeave(() =>{
  // 记忆位置
  scrollTop.value = scrollObj.value.getScrollTop();
  return true;
});

/* 搜索-点击 */
const searchClick = (row: any): void => {
  // 已存在
  for(let v of state.msg.group) {
    if(v.gid==row.gid && v.fid==row.fid) {
      return msgClick(v, 300);
    }
  }
  // 追加
  const data: any = {
    gid: row.gid,
    fid: row.fid,
    title: row.title,
    content: '',
    img: row.img,
    time: Time.Date('Y-m-d H:i:s'),
    num: 0,
  }
  state.msg.group.unshift(data);
  return msgClick(data, 300);
}

/* 消息-点击 */
const msgClick = (row: any, time: number=0): void => {
  state.msg.gid = row.gid;
  state.msg.fid = row.fid;
  state.msg.title = row.title;
  state.msg.img = row.img;
  setTimeout(()=>{
    router.push({path: '/msg/show'});
  }, time);
}

/* 加载数据 */
const loadData = (): void => {
  // 请求
  Request.Post('msg/list', {token: state.token}, (res:any)=>{
    const {code, msg, data} = res.data;
    if(code===0) {
      state.msg.group = data.list;
      state.msg.num = data.num;
    }
  });
}

/* 日期转换 */
const getMsgDate = (d: string): string => {
  const day: string = Time.Date('Y-m-d');
  const t1: number = Time.StrToTime(day+' 00:00:00');
  const t2: number = Time.StrToTime(d);
  let str: string = t2>=t1?d.substring(11, 16):d.substring(5, 10);
  return str;
}

</script>