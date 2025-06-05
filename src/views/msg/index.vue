<template>
  <PageView bgColor="linear-gradient(to bottom, #FFF 0%, #F8F8F8 100%)" barColor="#FFF" barBgColor="#007DFF">
    <template #bar_title>消息中心</template>
    <div class="msg_sea_body">
      <div class="msg_sea flex_center"><i class="ui ui_search"></i><span>搜索</span></div>
    </div>
    <div class="msg_body">
      <ScrollView ref="scrollObj" v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false">
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
          <li class="flex mtop1" @click="openUrl('/msg/show')">
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

<style lang="less" scoped>
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
</style>

<script setup lang="ts">
import { ref, onMounted, onActivated, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const scrollObj = ref();
const scrollTop = ref(0);

/* 创建完成 */
onMounted(()=>{
  loadData();
});
onActivated(()=>{
  // 跳转位置
  nextTick(()=>{
    scrollObj.value.setScrollTop(scrollTop.value);
  });
});
/* 离开页面 */
onBeforeRouteLeave((to, from) =>{
  // 记忆位置
  scrollTop.value = scrollObj.value.getScrollTop();
  return true;
});

/* 打开连接 */
const openUrl = (url: string, params: any={}): void => {
  if(!state.isLogin) router.push({path: '/user/login'});
  router.push({path: url, query: params});
}

/* 首页-数据 */
const loadData = (): void => {

}

</script>