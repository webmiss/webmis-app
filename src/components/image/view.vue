<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-preview_body" :style="{opacity: opacity}">
      <div class="wm-preview_top" :style="{top: safe_top}">
        <i class="ui ui_close" @click="close()"></i>
        <span v-if="title">{{title}}</span>
      </div>
      <div class="wm-preview_swipe" @wheel.passive="wheelRoller" @touchstart.passive="TouchStart" @touchmove.passive="TouchMove" @touchend.passive="TouchEnd">
        <div ref="previewTrack" class="wm-preview_track">
          <div class="wm-preview_item" :style="{width: width+'px'}">
            <div class="wm-preview_image">
              <img :src="url">
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
.wm-preview_body{position: fixed; z-index: 999; top: 0; left: 0; width: 100%; height: 100%; color: #FFF; background-color: #000; opacity: 0; transition: opacity 0.4s;}
.wm-preview_top{position: absolute; z-index: 2; padding: 8px 10px; width: 100%; height: 40px; display: flex; justify-content: center; align-items: center;}
.wm-preview_top .ui_close{position: absolute; left: 10px; bottom: 8px; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;}
.wm-preview_swipe{overflow: hidden; position: relative; width: 100%; height: 100%; touch-action: pan-x; -webkit-overflow-scrolling: touch;}
.wm-preview_track{cursor: grab; height: 100%; transition-property: transform; display: flex;}
.wm-preview_item{position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;}
.wm-preview_image{width: 100%; transition-property: transform;}
.wm-preview_image img{width: 100%;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Store from '../../store/index';

/* 参数 */
const props = defineProps({
  visible: {type: Boolean, default: false},               // 是否显示
  title: {type: String, default: ''},                     // 标题
  url: {type: String, default: ''},                       // 图片地址
  tolerance: {type: Number, default: 0.2},                // 滑动容差: 0-0.5scaleN
  minScale: {type: Number, default: 1},                   // 缩放: 最小
  maxScale: {type: Number, default: 3},                   // 缩放: 最大
});
const emit = defineEmits(['update:visible', 'update:index', 'close']);
// 变量
const opacity = ref('0');
const safe_top = ref('env(safe-area-inset-top)');
const width = ref(0);
const previewTrack = ref(null);
// 屏幕宽高
const screen: Array<any> = [window.innerWidth, window.innerHeight];
// 移动
let startX=0, startY=0, moveX=0, moveY=0, recX=0, recY=0;
// 缩放
const scale = ref(1);
let isScale = false;
let scaleN = 1;
let initialDistance = 0;

/* 监听 */
watch(()=>Store.state.routeAction, (val: string)=>{
  if(val==='prev') close();
},{ deep: true });

/* 创建完成 */
onMounted(()=>{
  // 初始化
  width.value = window.innerWidth;
  let obj: any = previewTrack.value;
  obj.style.width = width.value+'px';
  // 动画
  opacity.value = '1';
  try{
    // @ts-ignore 状态栏
    if(plus.os.name.toLowerCase()!=='ios') safe_top.value = plus.navigator.getStatusbarHeight()+'px';
  } catch(e: any) {
    safe_top.value = '0px';
  }
});

/* 开始 */
const TouchStart = (e: any): void => {
  isScale = false;
  if(e.touches.length===2) {
    isScale = true;
    initialDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  } else {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  }
};

/* 移动 */
const TouchMove = (e: any): void => {
  // 容器
  const obj: any = previewTrack.value;
  if(!obj) return;
  const imgObj = obj.children[0].children[0];
  // 缩放
  if(isScale) {
    if(e.touches.length!==2) return;
    const currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    const s = currentDistance / initialDistance;
    const n = s>1?s-1:-(1-s);
    scaleN = scale.value+n;
    imgObj.style.transform = 'scale('+scaleN+')';
    imgObj.style.transitionDuration = '0ms';
  } else {
    moveX = e.touches[0].pageX - startX + recX;
    moveY = e.touches[0].pageY - startY + recY;
    obj.style.transform = `translate(${moveX}px, ${moveY}px)`;
    obj.style.transitionDuration = '0ms';
  }
};

/* 结束 */
const TouchEnd = (): void => {
  recX = moveX;
  recY = moveY;
  // 缩放
  if(isScale) {
    if(scaleN<props.minScale) scaleN=props.minScale;
    if(scaleN>props.maxScale) scaleN=props.maxScale;
    const obj: any = previewTrack.value;
    const imgObj = obj.children[0].children[0];
    scale.value = scaleN;
    imgObj.style.transform = 'scale('+scaleN+')';
  }
  float();
};

/* 当前图片的可移动的范围 */
const float = (): void => {
  const obj: any = previewTrack.value;
  if(!obj) return;
  const imgObj = obj.children[0].children[0];
  const imgWh: Array<any> =  [Math.floor(imgObj.offsetWidth*scaleN), Math.floor(imgObj.offsetHeight*scaleN)];
  // 可移动的范围
  const scope: Array<any> = [(imgWh[0] - screen[0]) / 2, (imgWh[1] - screen[1]) / 2];
  // 图片宽大于等于屏幕
  if(imgWh[0] > screen[0]){
    if(recX > scope[0]) recX = scope[0];
    if(recX < -scope[0]) recX = -scope[0];
  }else {
    startX = 0;
    moveX = 0;
    recX = 0;
  }
  // 图片高大于等于屏幕
  if(imgWh[1] > screen[1]){
    if(recY > scope[1]) recY = scope[1];
    if(recY < -scope[1]) recY = -scope[1];
  }else {
    startY = 0;
    moveY = 0;
    recY = 0;
  }
  obj.style.transform = `translate(${recX}px, ${recY}px)`;
  obj.style.transitionDuration = '300ms';
}

/* 鼠标滚轮 */
const wheelRoller = (e: any): void => {
  scaleN += -e.deltaY/1000;
  if(scaleN<props.minScale) scaleN=props.minScale;
  if(scaleN>props.maxScale) scaleN=props.maxScale;
  const obj: any = previewTrack.value;
  const imgObj = obj.children[0].children[0];
  imgObj.style.transform = 'scale('+scaleN+')';
  float();
}

/* 关闭 */
const close = (): void => {
  emit('close');
  // 隐藏
  opacity.value = '0';
  setTimeout(()=>{
    emit('update:visible', false);
  }, 400);
}

</script>