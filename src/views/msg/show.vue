<template>
  <PageView bgColor="#F2F2F2">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>{{ state.msg.title }}</template>
    <template #bar_right>
      <i class="ui ui_more more" @click="showMore()"></i>
    </template>
    <div class="msg_body" :style="{height: msgHeight}" @click="msgClose()">
      <ScrollView class="msg_content" v-model:refreshing="scroll.refreshing" @refresh="onLoad" :isLower="false" :upper="20">
        <!-- Msg -->
        <div class="wm-msg_ct">
            <template v-if="state.msg.list.length>0">
              <template v-for="(v,k) in state.msg.list" :key="k">
                <!-- Time -->
                <div class="time">{{ getMsgTime(state.msg.list[k-1]?state.msg.list[k-1].time:v.time, v.time) }}</div>
                <!-- Msg Left -->
                <div class="msg_left flex_left" v-if="v.fid!=state.uinfo.uid">
                  <div class="img bgImg" :style="{backgroundImage: v.img?'url('+v.img+')':''}">
                    <i class="ui ui_image" v-if="!v.img"></i>
                  </div>
                  <div class="msg_body flex_left">
                    <div class="content msg_ct" v-if="v.format===0">
                      <span class="arrow"></span>
                      <span class="red" v-if="v.loading"></span>
                      <pre>{{ v.content }}</pre>
                    </div>
                    <div class="content file_ct" v-else-if="v.format===1">
                      <span class="arrow"></span>
                      <div class="img_ct" v-if="isImgage(v.content.type)">
                        <div class="wm-ui_load" v-if="v.loading"><span><i class="ui ui_loading"></i></span></div>
                        <img :src="v.base64?v.base64:v.content.url+v.content.file" @click="msgImgView(v.content.url+v.content.file)">
                      </div>
                      <div class="other_ct" v-else>
                        <i class="ui ui_file"></i>
                        <div class="text_body">
                          <h2 class="nowrap">{{ v.content.name }}</h2>
                          <div class="text">
                            {{ Format.FileSize(v.content.size) }}&nbsp;&nbsp;|&nbsp;&nbsp;
                            <a v-if="v.loading">取消</a>
                            <a v-else @click="msgDownload(v.content.url+v.content.file, v.content.name)">下载</a>
                          </div>
                          <div v-if="v.loading" class="load" :style="{backgroundImage: 'linear-gradient(to right, #6FB737, #6FB737 '+v.load+'%, #F2F2F2 '+v.load+'%, #F2F2F2 100%)'}"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Msg Right -->
                <div class="msg_right flex_right" v-else>
                  <div class="msg_body flex_right">
                    <div class="content msg_ct" v-if="v.format===0">
                      <span class="arrow"></span>
                      <span class="red" v-if="v.loading"></span>
                      <pre>{{ v.content }}</pre>
                    </div>
                    <div class="content file_ct" v-else-if="v.format===1">
                      <span class="arrow"></span>
                      <div class="img_ct" v-if="isImgage(v.content.type)">
                        <div class="wm-ui_load" v-if="v.loading"><span><i class="ui ui_loading"></i></span></div>
                        <img :src="v.base64?v.base64:v.content.url+v.content.file" @click="msgImgView(v.content.url+v.content.file)">
                      </div>
                      <div class="other_ct" v-else>
                        <i class="ui ui_file"></i>
                        <div class="text_body">
                          <h2 class="nowrap">{{ v.content.name }}</h2>
                          <div class="text">
                            {{ Format.FileSize(v.content.size) }}&nbsp;&nbsp;|&nbsp;&nbsp;
                            <a v-if="v.loading">取消</a>
                            <a v-else @click="msgDownload(v.content.url+v.content.file, v.content.name)">下载</a>
                          </div>
                          <div v-if="v.loading" class="load" :style="{backgroundImage: 'linear-gradient(to right, #6FB737, #6FB737 '+v.load+'%, #F2F2F2 '+v.load+'%, #F2F2F2 100%)'}"></div>
                        </div>
                      </div>
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
      <div class="ico"></div>
      <div class="input">
        <div class="text">{{ msgData.content }}</div>
        <textarea v-model="msgData.content" @input="msgInput" @paste="msgCtrlV" @focus="msgFocus" @blur="msgClose()" @keydown.enter.exact="msgSend" :disabled="!state.msg.title" enterkeyhint="send"></textarea>
      </div>
      <div class="ico" @click="msgOpenFile()"><i class="ui ui_add"></i></div>
    </div>
    <!-- <div class="msg_tools_ct"></div> -->
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
.msg_content .content{position: relative; max-width: 100%; border-radius: 4px; color: #000; word-break: break-all;}
.msg_content .content pre{white-space: pre-wrap;}
.msg_content .arrow{position: absolute; width: 10px; height: 10px; top: 18px; transform: rotate(45deg);}
.msg_content .red{position: absolute; width: 8px; height: 8px; top: 20px; background-color: @Danger; border-radius: 50%;}
.msg_content .msg_left{padding: 10px;}
.msg_content .msg_left .arrow{left: -4px; background-color: #FFF;}
.msg_content .msg_left .msg_body{margin-left: 10px; width: calc(100% - 116px);}
.msg_content .msg_right{padding: 10px;}
.msg_content .msg_right .arrow{right: -4px; background-color: #B2E281;}
.msg_content .msg_right .msg_body{margin-right: 10px; width: calc(100% - 116px);}
/* Msg-Text */
.msg_content .msg_left .msg_ct{background-color: #FFF; line-height: 24px; padding: 10px 16px;}
.msg_content .msg_left .msg_ct .red{right: -16px;}
.msg_content .msg_right .msg_ct{background-color: #B2E281; line-height: 24px; padding: 10px 16px;}
.msg_content .msg_right .msg_ct .red{left: -16px;}
/* Msg-File */
.msg_content .file_ct{position: relative; background-color: #FFF;}
.msg_content .file_ct .img_ct{position: relative; overflow: hidden; border: #FFF 1px solid; border-radius: 4px;}
.msg_content .file_ct .img_ct img{cursor: pointer; max-width: 100%; max-height: 240px;}
.msg_content .file_ct .other_ct{position: relative; padding: 10px; background-color: #FFF; display: flex; justify-content: space-between;}
.msg_content .file_ct .other_ct i{width: 72px; height: 72px; font-size: 48px; color: @IconColor; background-color: #F2F2F2; border-radius: 4px; display: flex; justify-content: center; align-items: center;}
.msg_content .file_ct .other_ct .text_body{position: relative; padding: 0 10px; max-width: 160px;}
.msg_content .file_ct .other_ct .text_body h2{line-height: 40px; font-size: 14px;}
.msg_content .file_ct .other_ct .text_body .text{line-height: 24px; white-space: nowrap;}
.msg_content .file_ct .other_ct .load{position: absolute; bottom: 0; width: calc(100% - 20px); height: 4px; background-color: #F2F2F2; border-radius: 2px;}
/* Tools */
.msg_tools{width: 100%; min-height: 40px; padding: 5px 0; background-color: #F8F8F8; display: flex; justify-content: space-between; align-items: flex-end;}
.msg_tools .ico{width: 50px; height: 40px; display: flex; justify-content: center; align-items: center;}
.msg_tools .input{position: relative; width: calc(100% - 100px); background-color: #FFF; border-radius: 4px;}
.msg_tools .input textarea, .msg_tools .input .text{padding: 10px; line-height: 20px; font-size: 16px; white-space: pre-wrap; box-sizing: border-box;}
.msg_tools .input textarea{overflow: hidden; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; outline: none;}
.msg_tools .input .text{visibility: hidden; min-height: 40px;}
.msg_tools .ui_add{font-size: 18px;}
.msg_tools_ct{height: 280px; background-color: #F2F2F2;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
import Time from '../../library/time';
import Files from '../../library/files';
import Format from '../../library/format';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';
import { title } from 'process';

// 公共
const { proxy } = getCurrentInstance() as any ;
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const page = ref({num:1, limit:12});
const msgData = ref({content:''});
const msgHeight = ref('calc(100% - 50px)');
// 间隔时间
let msgTime = ref(600);

/* 监听-新信息 */
watch(()=>state.msg.readId, (val: number)=>{
  if(val>0) msgRead([val], false);
  msgToBottom(1000);
  state.msg.readId = 0;
},{ deep: true });

/* 创建完成 */
onMounted(()=>{
  // 返回
  if(state.msg.gid==='' || state.msg.fid==='') router.go(-1);
  // 默认值
  for(let v of state.msg.group) {
    if(v.gid===state.msg.gid && v.fid===state.msg.fid) {
      state.msg.title = v.title;
      state.msg.img = v.img;
      msgData.value.content = v.sendContent || '';
    }
  }
  // 刷新
  setTimeout(()=>{ onRefresh(); }, 300);
});
/* 页面销毁 */
onBeforeUnmount(()=>{
  state.msg.gid = '';
  state.msg.fid = '';
  state.msg.title = '';
  state.msg.img = '';
  state.msg.list = [];
});

/* 更多 */
const showMore = async (): Promise<void> => {
  const res = await proxy.$actionSheet({
    title: '更多',
    active: '',
    actions:[
      {label: '清空聊天记录', value: 'clear'},
    ]
  });
  if(res.confirm) {
    if(res.content.value==='clear') console.log('clear');;
  }
}

/* 消息-输入 */
const msgInput = (e: any): void => {
  // 设置高度
  msgHeight.value = 'calc(100% - '+(e.target.scrollHeight+10)+'px)';
  // 缓存消息
  for(let v of state.msg.group) {
    if(v.gid===state.msg.gid && v.fid===state.msg.fid) v.sendContent = msgData.value.content;
  }
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

/* 工具 */
const showTools = (): void => {
}

/* 消息-粘贴图片 */
const msgCtrlV = async (e: any): Promise<void> => {
  const items = e.clipboardData?.items;
  if(!items) return;
  for(const item of items) {
    if (item.type.includes('image')) {
      const blob = item.getAsFile();
      msgUploadFile(blob);
    }
  }
}
/* 消息-打开文件 */
const msgOpenFile = (): void => {
  if(!state.msg.title) return ;
  // 选择文件
  Files.Select({multiple: true, mimeType:[]}, (files:any)=>{
    for(let v of files) msgUploadFile(v);
  }, (err: string)=>{
    Ui.Toast(err);
  });
}
/* 消息-上传文件 */
const msgUploadFile = async (fileObj: any): Promise<void> => {
  // 压缩图片
  const {blob, base64}: any = await imgCompress(fileObj);
  // 获取签名
  Request.Post('msg/oss_sgin?lang='+state.lang, {
    token: state.token,
    filename: fileObj.name,
  }, (res:any)=>{
    const {code, msg, data}: any = res.data;
    if(code!==0) return Ui.Toast(msg);
    // 本地
    const loading: number = Time.TimeMicro();
    const time: string = Time.Date('Y-m-d H:i:s');
    const msgData: any = {
      gid: state.msg.gid,
      fid: parseInt(state.uinfo.uid),
      uid: state.msg.fid,
      is_new: false,
      time: time,
      format: 1,
      title: state.uinfo.name,
      img: state.uinfo.img,
      content: {
        name: fileObj.name,
        type: fileObj.type,
        size: fileObj.size,
        ext: data.ext,
        url: data.host,
        file: data.key,
      },
      loading: loading,
      load: 0,
      base64: base64,
    };
    state.msg.list.push(msgData);
    const k: number = state.msg.list.length-1;
    // 底部
    msgToBottom();
    // 签名直传
    let formData = new FormData();
    formData.append('OSSAccessKeyId', data.accessid);
    formData.append('policy', data.policy);
    formData.append('Signature', data.signature);
    formData.append('key', data.key);
    formData.append('file', blob);
    Request.Post(data.host, formData, (res: any)=>{
      if(res.data) Ui.Toast(res.data);
    }, (e:any)=>{
      Ui.Toast('文件上传失败');
    }, {
      headers: {
        "Content-Type": "multipart/form-data;charset=utf-8"  // 表单方式
      },
      onUploadProgress:(event: any) => {
        let complete = (event.loaded/event.total*100 | 0);
        state.msg.list[k].load = complete;
        // 发送
        if(complete===100) {
          msgData['type'] = 'msg';
          msgData['base64'] = '';
          state.socket.send(JSON.stringify(msgData));
        }
      }
    });
  });
}
/* 消息-下载文件 */
const msgDownload = (file: string, filename: string): void => {
  Files.ShareFile(file, filename, '下载', '消息文件').then((res: boolean)=>{
    if(!res) {
      Ui.Toast('分享失败!');
      Files.Down(file, filename);
    }
  });
}
/* 消息-消息 */
const msgImgView = (img: string): void => {
  let i: number = 0;
  let index: number = 0;
  let imgs: any = [];
  for (let v of state.msg.list) {
    if (v.format!==1 || !isImgage(v.content.type)) continue;
    if (v.content.url+v.content.file == img) index = i;
    imgs.push({label: v.content.name, value: v.content.url+v.content.file});
    i++;
  }
  proxy.$previewImage({index: index, images: imgs});
}

/* 消息-发送 */
const msgSend = (event: any=null): void => {
  // 禁止换行
  if(event) event.preventDefault();
  if(!state.msg.title || msgData.value.content.trim()=='') return ;
  // 本地
  const loading: number = Time.TimeMicro();
  const time: string = Time.Date('Y-m-d H:i:s');
  const data: any = {
    gid: state.msg.gid,
    fid: parseInt(state.uinfo.uid),
    uid: state.msg.fid,
    is_new: false,
    time: time,
    format: 0,
    title: state.uinfo.name,
    img: state.uinfo.img,
    content: msgData.value.content.trim(),
    loading: loading,
  };
  state.msg.list.push(data);
  // 发送
  if(state.socket) {
    data.type = 'msg';
    state.socket.send(JSON.stringify(data));
  }
  // AI助理
  if(state.msg.gid===1) {
    state.msg.list.push({
      fid: state.msg.fid,
      uid: 0,
      format: 0,
      is_new: false,
      time: time,
      title: state.msg.title,
      img: state.msg.img,
      content: '...',
      loading: loading+1,
    });
  }
  // 底部
  msgToBottom();
  // 清空
  msgClear();
}
/* 消息-清空 */
const msgClear = (): void => {
  msgData.value.content = '';
  for(let v of state.msg.group) {
    if(v.gid===state.msg.gid && v.fid===state.msg.fid) v.sendContent = '';
  }
}

/* 下拉刷新 */
const onRefresh = (): void => {
  page.value.num = 1;
  scroll.value.finished = false;
  state.msg.list = [];
  loadData();
}
/* 上拉加载 */
const onLoad = (): void => {
  if(scroll.value.finished) {
    if(state.msg.list.length>0) return Ui.Toast('已无历史消息!');
    return;
  }
  page.value.num += 1;
  loadData();
}

/* 加载数据 */
const loadData = (): void => {
  if(!state.token) return;
  // 请求
  Request.Post('msg/show?lang='+state.lang, {
    token: state.token,
    gid: state.msg.gid,
    fid: state.msg.fid,
    page: page.value.num,
    limit: page.value.limit,
  }, (res:any)=>{
    const {code, msg, data} = res.data;
    if(code===0) {
      // 重置刷新
      scroll.value.refreshing = true;
      // 数据
      if(data.length>0) {
        state.msg.list.unshift(...data);
        // 标记已读
        let ids: Array<any> = [];
        for(let v of data) {
          if(v.is_new) ids.push(v.id);
        }
        msgRead(ids);
      } else {
        scroll.value.finished = true;
        onLoad();
      }
      // 调转底部
      if(page.value.num===1) msgToBottom();
    } else return Ui.Toast(msg);
  });
}
/* 消息-调转底部 */
const msgToBottom = (time: number=300): void => {
  setTimeout(()=>{
    document.querySelector('#msgBottom')?.scrollIntoView(true);
    state.msg.isBottom = false;
  }, time);
}
/* 消息-标记已读 */
const msgRead = (ids: any=[], isNum: boolean=true): void => {
  if(ids.length==0) return;
  // 扣减数量
  if(isNum) {
    state.msg.num -= ids.length;
    for(let v of state.msg.group) {
      if(v.gid===state.msg.gid && v.fid===state.msg.fid) {
        v.num -= ids.length;
        if(v.num<0) v.num = 0;
      }
    }
  }
  // 提交
  Request.Post('msg/read?lang='+state.lang, {
    token: state.token,
    ids: ids,
  }, (res:any)=>{
    const {code, msg}: any = res.data;
    if(code!==0) Ui.Toast(msg);
  });
}

/* 时间转换 */
const getMsgTime = (t1: string, t2: string): string => {
  if(t1===t2) return '';
  if(!t1) return Time.FormatTime(t2);
  return Time.TimeSize(t1, t2)>msgTime.value?Time.FormatTime(t2):'';
}

/* 图片-判断 */
const isImgage = (type: string): boolean => {
  const arr: Array<string> = ['image/jpeg', 'image/png', 'image/gif'];
  return arr.includes(type);
}
/* 图片-压缩 */
const imgCompress = (fileObj: any): any => {
  return new Promise((resolve) => {
    // 是否图片
    if(!isImgage(fileObj.type)) return resolve({blob: fileObj, base64: ''});
    // 压缩
    Files.FileToBase64(fileObj, (base64: any)=>{
      Files.ImageCompress(base64, {width:1024, type:fileObj.type}, (imgBase64: any)=>{
        Files.Base64ToFile(imgBase64, fileObj.name, (blob:any)=>{
          return resolve({blob: blob, base64: imgBase64});
        }, (err: string)=>{
          Ui.Toast(err);
        });
      }, (err: string)=>{
        Ui.Toast(err);
      });
    });
  });
}

</script>