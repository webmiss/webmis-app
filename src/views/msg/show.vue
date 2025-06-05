<template>
  <PageView bgColor="#F2F2F2">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>{{ msg.title }}</template>
    <div class="msg_body" :style="{height: msgHeight}" @click="msgClose()">
      <ScrollView class="msg_content" v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false">
        <!-- Msg -->
        <div class="wm-msg_ct">
            <template v-if="sendList.length>0">
              <template v-for="(v,k) in sendList" :key="k">
                <!-- Time -->
                <div class="time">{{ getMsgTime(sendList[k-1]?sendList[k-1].time:v.time, v.time) }}</div>
                <!-- Msg Left -->
                <div class="msg_left flex_left" v-if="v.fid!=state.uinfo.uid">
                  <div class="img bgImg" :style="{backgroundImage: v.img?'url('+v.img+')':''}">
                    <i class="ui ui_image" v-if="!v.img"></i>
                  </div>
                  <div class="msg_body flex_left">
                    <div class="content">
                      <span class="arrow"></span>
                      <span class="red" v-if="v.loading"></span>
                      <pre>{{ v.content }}</pre>
                    </div>
                  </div>
                </div>
                <!-- Msg Right -->
                <div class="msg_right flex_right" v-else>
                  <div class="msg_body flex_right">
                    <div class="content">
                      <span class="arrow"></span>
                      <span class="red" v-if="v.loading"></span>
                      <pre>{{ v.content }}</pre>
                    </div>
                  </div>
                  <div class="img bgImg" :style="{backgroundImage: v.img?'url('+v.img+')':''}">
                    <i class="ui ui_image" v-if="!v.img"></i>
                  </div>
                </div>
                <!-- Msg Right End -->
              </template>
            </template>
            <div class="msg_null" v-else>暂无消息</div>
            <div id="msgBottom"></div>
          </div>
          <!-- Msg End -->
      </ScrollView>
    </div>
    <div class="msg_tools">
      <div class="ico">1</div>
      <div class="input">
        <div class="text">{{ msg.content }}</div>
        <textarea v-model="msg.content" @input="msgInput" @focus="msgFocus" @blur="msgClose()" enterkeyhint="send"></textarea>
      </div>
      <div class="ico">2</div>
    </div>
  </PageView>
</template>

<style lang="less" scoped>
.msg_body{width: 100%; height: calc(100% - 100px);}
/* Msg */
.msg_content{position: relative;}
.msg_content .msg_null{position: absolute; color: #999; left: 50%; top: 50%; transform: translate(-50%, -50%);}
.msg_content .time{line-height: 40px; color: #999; text-align: center; font-size: 12px;}
.msg_content .img{width: 48px; height: 48px; line-height: 48px; text-align: center; background-color: #FFF; border-radius: 4px;}
.msg_content .img i{font-size: 24px; color: @BaseBorder;}
.msg_content .content{position: relative; max-width: calc(100% - 30px); line-height: 24px; padding: 10px 16px; border-radius: 4px; color: #000; word-break: break-all;}
.msg_content .content pre{white-space: pre-wrap;}
.msg_content .arrow{position: absolute; width: 8px; height: 8px; top: 20px; transform: rotate(45deg);}
.msg_content .red{position: absolute; width: 8px; height: 8px; top: 20px; background-color: @Danger; border-radius: 50%;}
.msg_content .msg_left{padding: 10px;}
.msg_content .msg_left .msg_body{margin-left: 10px; width: calc(100% - 116px);}
.msg_content .msg_left .content{background-color: #FFF;}
.msg_content .msg_left .arrow{left: -4px; background-color: #FFF;}
.msg_content .msg_left .red{right: -16px;}
.msg_content .msg_right{padding: 10px;}
.msg_content .msg_right .msg_body{margin-right: 10px; width: calc(100% - 116px);}
.msg_content .msg_right .content{background-color: #B2E281;}
.msg_content .msg_right .arrow{right: -4px; background-color: #B2E281;}
.msg_content .msg_right .red{left: -16px;}
/* Tools */
.msg_tools{width: 100%; min-height: 40px; padding: 5px 0; background-color: #F8F8F8; display: flex; justify-content: space-between; align-items: flex-end;}
.msg_tools .ico{width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;}
.msg_tools .input{position: relative; width: calc(100% - 80px); background-color: #FFF; border-radius: 4px;}
.msg_tools .input textarea, .msg_tools .input .text{padding: 10px; line-height: 20px; font-size: 16px; white-space: pre-wrap; box-sizing: border-box;}
.msg_tools .input textarea{overflow: hidden; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; outline: none;}
.msg_tools .input .text{visibility: hidden; min-height: 40px;}

</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
import Time from '../../library/time';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
// 变量
const msg = ref({title:'用户呢称', content:''});
const msgHeight = ref('calc(100% - 50px)');
const scroll = ref({refreshing: false, loading: false, finished: false});
// 消息间隔时间
let msgTime = ref(600);
// 发送内容
let sendGid = ref<number | string>('');
let sendFid = ref<number | string>('');
let sendTitle = ref('');
let sendContent = ref('');
let sendImg = ref('');
let sendList = ref(<any>[
  {gid: 1, fid: 0, uid: 0, time: '2025-06-04 09:28:00', img: 'https://php.webmis.vip/upload/robot.jpg', title:'Ai助理', content: 'Hi很高兴为您服务！'},
  {gid: 0, fid: 33028323, uid: 33028323, time: '2025-06-04 09:28:01', img: 'https://cszbvip.oss-cn-guangzhou.aliyuncs.com/user/img/1.jpg', title:'我', content: '你好'},

]);

/* 创建完成 */
onMounted(()=>{
  // loadData();
});

/* 消息-输入框高度 */
const msgInput = (e: any): void => {
  msgHeight.value = 'calc(100% - '+(e.target.scrollHeight+10)+'px)';
  console.log(e.target.scrollHeight);
}
/* 消息-阻止页面滚动 */
const msgClose = (): void => {
  (document as any).activeElement.blur();
  document.removeEventListener('touchmove', preventScroll);
}
const msgFocus = (): void => {
  document.addEventListener('touchmove', preventScroll, { passive: false });
}
const preventScroll = (e: any): void => {
  e.preventDefault();
}

/* 加载数据 */
const loadData = (): void => {
  // 请求
  // Request.Post('index/html', {name: route.query.name}, (res:any)=>{
  //   const {code, msg, time, data} = res.data;
  //   if(code===0 && data) {
  //     info.value.time = time;
  //     info.value.title = data.title;
  //     info.value.content = data.content;
  //     info.value.cdate = Time.Date('Y年m月d日', Time.StrToTime(data.ctime));
  //     info.value.udate = Time.Date('Y年m月d日', Time.StrToTime(data.utime));
  //     // 重置刷新
  //     scroll.value.refreshing = false;
  //   } else return Ui.Toast(msg);
  // });
}

/* 日期转换 */
const getMsgDate = (d: string): string => {
  const day: string = Time.Date('Y-m-d');
  const t1: number = Time.StrToTime(day+' 00:00:00');
  const t2: number = Time.StrToTime(d);
  let str: string = t2>=t1?d.substring(11, 16):d.substring(5, 10);
  return str;
}
/* 时间转换 */
const getMsgTime = (t1: string, t2: string): string => {
  if(t1===t2 || !t1) return Time.FormatTime(t2);
  return Time.TimeSize(t1, t2)>msgTime.value?Time.FormatTime(t2):'';
}

</script>