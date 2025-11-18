<template>
  <div v-if="isShow" class="update_body" :style="{color: color, backgroundColor: bgColor}">
    <div class="update_ct">
      <div class="update_logo"></div>
      <div class="update_title">{{ title }}</div>
      <div class="update_load" :style="{backgroundImage: 'linear-gradient(to right, #6FB737, #6FB737 '+update.loading+', #000000 '+update.loading+', #000000 100%)'}"></div>
      <div class="update_msg" v-html="update.msg "></div>
      <div class="update_bottom">
        <wmButton type="primary" effect="dark" height="48px" :disabled="!update.down" @click="updateDown()">{{ update.button }}</wmButton>
      </div>
    </div>
    <div class="update_copy">{{ copy }}</div>
  </div>
</template>

<style lang="less" scoped>
.update_body{position: absolute; z-index: 1000; width: 100%; height: 100%;}
.update_ct{position: absolute; width: calc(100% - 80px); left: 50%; top: 45%; transform: translate(-50%, -50%);}
.update_logo{margin: 16px auto; width: 160px; height: 160px; background-size: 70%; background-image: url('../../assets/logo.svg'); border-radius: 50%; background-repeat: no-repeat; background-position: center; transition: All 0.5s ease-in-out;}
.update_load{margin: 8px auto; height: 6px; border-radius: 3px;}
.update_title{line-height: 48px; text-align: center; font-size: 24px;}
.update_msg{line-height: 24px; text-align: center;}
.update_bottom{padding: 16px 0; text-align: center;}
.update_copy{position: absolute; left: 50%; bottom: 32px; transform: translateX(-50%); font-size: 12px; color: rgba(255,255,255,0.4);}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
/* JS组件 */
import Env from '../../config/Env';
import Ui from '../../library/ui';
import Request from '../../library/request';
/* 组件 */
import wmButton from '../../components/form/button/index.vue';

/* 参数 */
const props = defineProps({
  show: {type: Boolean, default: false},                    // 是否显示
  color: {type: String, default: 'rgba(255,255,255,.8)'},   // 文本颜色
  bgColor: {type: String, default: '#242628'},              // 背景颜色
});
const emit = defineEmits(['update:show']);
// 状态
const title: string = Env.title+' '+Env.version;
const copy: string = Env.copy;
// 变量
const isShow = ref(false);
// 更新APP
const update = ref({os: '', down:false, loading:'1%', msg:'检测更新', file:'', size:0, button:'下载并安装'});

/* 监听 */
watch(()=>props.show, (val:boolean)=>{
  if(val) loadData();
}, { deep: true });

/* 加载数据 */
const loadData = (): void => {
  // @ts-ignore
  update.value.os = (window as any).plus?(plus.os.name as string).toLowerCase():'web';
  // update.value.os = 'android';
  Request.Post('index/version', {
    os: update.value.os,
    version: Env.version,
  }, (res:any)=>{
    const {code, msg, data} = res.data;
    if(code===0) {
      if(data.version===Env.version) return;
      // 刷新
      if(data.os==='web') {
        setTimeout(()=>{ window.location.reload(); }, 3000);
      } else {
        isShow.value = true;
        update.value.down = true;
        update.value.file = data.file;
        update.value.size = data.size;
        update.value.msg = '新版本: '+data.version+'&nbsp;&nbsp;大小: '+(data.size/1024/1024).toFixed(2)+'MB';
      }
    } else Ui.Toast(msg);
  });
}

/* 下载更新 */
const updateDown = (): void => {
  update.value.down = false;
  update.value.button = '正在下载';
  // 安卓手机
  if(update.value.os=='android') {
    // @ts-ignore 安卓手机
    let down = plus.downloader.createDownload(update.value.file, {
      'timeout': 0,
    },(d: any, status: any)=>{
      if(status == 200){
        // @ts-ignore 安装并重启
        plus.runtime.install(d.filename, {force:true},()=>{
          // @ts-ignore
          plus.runtime.restart();
        },()=>{
          Ui.Toast('安装失败!');
        });
      }else{
        update.value.down = true;
        update.value.msg = '下载失败';
      }
    });
    // 开始任务
    down.start();
    // 下载进度
    down.addEventListener('statechanged', (res: any, status: any)=>{
      // @ts-ignore
      let complete = parseInt(res.downloadedSize/update.value.size*100);
      update.value.loading = complete+'%';
      update.value.msg = '正在下载：'+update.value.loading;
      if (complete >= 100) update.value.msg = '下载完成，安装并重启';
    });
  }else if(update.value.os=='ios'){
    // 苹果手机
    Ui.Toast('请在桌面查看安装进度!');
    window.open(update.value.file);
    setTimeout(()=>{
      // @ts-ignore
      plus.runtime.quit();
    }, 3000);
  }
}

</script>