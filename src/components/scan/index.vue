<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-scan_body">
      <div class="wm-scan_mask" :style="{opacity: opacity}"></div>
      <div class="wm-scan_content" :style="{transform: 'translate3D('+translateX+', 0, 0)', opacity: opacity}">
        <div class="wm-scan_top">
          <i class="ui ui_close" @click="close()"></i>
          <h2>{{ title }}</h2>
        </div>
        <div class="wm-scan">
          <!-- 视频 -->
          <div class="video" v-show="!msg">
            <div id="reader"></div>
          </div>
          <!-- 授权 -->
          <div v-if="msg">
            <div class="msg">{{ msg }}</div>
            <div class="perm" @click="handleScanClick()">摄像头授权</div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </Teleport>
</template>

<style lang="less" scoped>
.wm-scan_body{position: fixed; z-index: 999; left: 0; top: 0; width: 100%; height: 100%;}
.wm-scan_mask{position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.3s;}
.wm-scan_content{overflow: hidden; position: absolute; z-index: 2; left: 0; top: 0; width: 100%; height: 100%; color: #FFF; background-color: #000; transition: transform 0.3s ease-in-out, opacity 0.3s;}
.wm-scan_top{position: relative; line-height: 40px; padding: 8px 10px; display: flex; justify-content: center; align-items: center;}
.wm-scan_top h2{font-size: 15px; font-weight: normal;}
.wm-scan_top .ui_close{position: absolute; left: 10px; bottom: 8px; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;}
.wm-scan{position: relative; width: 100%; height: calc(100% - 56px); text-align: center; display: flex; justify-content: center; align-items: center;}
.wm-scan .msg{padding: 16px 32px; line-height: 24px; color: @Info;}
.wm-scan .perm{display: inline-block; margin: 0 auto; padding: 4px 32px; line-height: 40px; border-radius: 24px; background-color: @Minor;}
.wm-scan .video{overflow: hidden; position: absolute; width: 100%; height: 100%;}
.wm-scan #reader{width: 100%; top: calc(50% - 56px); transform: translateY(-50%);}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

/* 参数 */
const props = defineProps({
  visible: { type: Boolean, default: false },             // 是否显示
  title: { type: String, default: '扫描' },               // 标题
  facingMode: { type: String, default: 'environment' },   // 摄像头: environment(后置)，user(前置)
  fps: { type: Number, default: 10 },                     // 帧频
  width: { type: Number, default: 250 },                  // 宽
  height: { type: Number, default: 250 },                 // 高
  isClose: { type: Boolean, default: true },              // 扫码成功退出
});
const emit = defineEmits(['confirm', 'cancel', 'update:visible']);
/* 变量 */
const opacity = ref('0');
const translateX = ref('100%');
const msg = ref(<any>'');
const stream = ref(<any>null);
const html5QrCode = ref(<any>null);

  /* 创建完成 */
onMounted(()=>{
  // 动画
  setTimeout(()=>{
    opacity.value = '1';
    translateX.value = '0%';
    msg.value = '获取授权';
    handleScanClick();
  }, 100);
  // 监听后退
  window.addEventListener('popstate', close);
});
/* 页面销毁 */
onUnmounted(()=>{
  window.removeEventListener('popstate', close);
});

/* 获取摄像头授权 */
const handleScanClick = async (): Promise<void> => {
  msg.value = '';
  try {
    // 是否支持
    if(!navigator.mediaDevices?.getUserMedia) {
      msg.value = '浏览器不支持摄像头访问';
      return ;
    }
    // 授权
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: props.facingMode }    // 摄像头
    });
    stream.value.getTracks().forEach((track: any) => track.stop());
    // 扫描
    startScan();
  } catch (err) {
    msg.value = err.message;
  }
}

/* 扫描 */
const startScan = (): void => {
  html5QrCode.value = new Html5Qrcode('reader');
  html5QrCode.value.start(
    {facingMode: props.facingMode},                                 // 摄像头
    {fps: 30, qrbox: {width: props.width, height: props.height}},   // 配置
  (text: string, res: any)=>{
    // 扫描成功
    emit('confirm', text);
    // 是否关闭
    if(props.isClose) close();
  }, (err: any)=>{
    // 扫描错误
    // console.log(err);
  }).catch((err: any)=>{
    msg.value = '启动失败!';
  });
}

/* 关闭 */
const close = () => {
  stream.value.getTracks().forEach((track: any) => track.stop());
  html5QrCode.value?.stop();
  emit('cancel');
  // 动画
  opacity.value = '0';
  translateX.value = '100%';
  setTimeout(()=>{
    emit('update:visible', false);
  }, 300);
};

</script>