<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-preview_body" :style="{opacity: opacity}">
      <div class="wm-preview_top" :style="{top: (state.statusHeight?state.statusHeight+'px':safe_top)}">
        <i class="ui ui_close" @click="close()"></i>
        <span>{{ page }}/{{ props.images.length }}</span>
      </div>
      <div class="wm-preview_swipe" @touchstart.passive="TouchStart" @touchmove.passive="TouchMove" @touchend.passive="TouchEnd">
        <div ref="previewTrack" class="wm-preview_track">
          <div v-for="img in images" class="wm-preview_item" :style="{width: width+'px'}">
            <div class="wm-preview_image">
              <img :src="typeof img==='string'?img:img.value">
            </div>
            <div class="wm-preview_label" v-if="typeof img==='object'">{{ img.label }}</div>
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
.wm-preview_label{line-height: 24px; padding: 8px; border-radius: 8px; max-width: calc(100% - 40px); text-align: center; position: absolute; bottom: 16px; background-color: rgba(0,0,0,0.5);}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

/* 参数 */
const props = defineProps({
  visible: {type: Boolean, default: false},               // 是否显示
  title: {type: String, default: '标题'},                 // 标题
  images: {type: Array<any>, default: []},                // 图片地址
  index: {type: Number, default: 0},                      // 索引
  tolerance: {type: Number, default: 0.2},                // 滑动容差: 0-0.5scaleN
  minScale: {type: Number, default: 1},                   // 缩放: 最小
  maxScale: {type: Number, default: 3},                   // 缩放: 最大
});
const emit = defineEmits(['update:visible', 'update:index', 'close']);
// 状态
const store = useStore();
const state = store.state;
const safe_top = ref('env(safe-area-inset-top)');
// 变量
const page = ref(1);
const width = ref(0);
const opacity = ref('0');
const previewTrack = ref(null);
// 移动
let startX=0, distance=0;
let move = ref(0);
// 缩放
const scale = ref(1);
let isScale = false;
let scaleN = 0;
let initialDistance = 0;

/* 创建完成 */
onMounted(()=>{
  // 初始化
  width.value = window.innerWidth;
  let obj: any = previewTrack.value;
  obj.style.width = width.value*props.images.length+'px';
  if(props.index && props.index<props.images.length) {
    page.value = props.index+1;
    move.value = -width.value*props.index;
    obj.style.transform = 'translateX('+move.value+'px)';
  }
  // 动画
  opacity.value = '1';
});

/* 开始 */
const TouchStart = (e: any): void => {
  isScale = false;
  scaleN = 0;
  if(e.touches.length===2) {
    isScale = true;
    initialDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  } else {
    startX = e.touches[0].pageX;
  }
};

/* 移动 */
const TouchMove = (e: any): void => {
  // 容器
  const obj: any = previewTrack.value;
  if(!obj) return;
  const imgObj = obj.children[page.value-1].children[0];
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
    // 重置放大
    scaleN = 0;
    scale.value = 1;
    for(let v of obj.children) {
      v.children[0].style.transform = 'scale(1)';
      v.children[0].style.transitionDuration = '300ms';
    }
    // 滑动
    if(props.images.length<=1) return;
    distance = e.touches[0].pageX - startX;
    let x: number = move.value+distance;
    if(x > width.value) move.value = -(props.images.length-1)*width.value;
    else if(x < -props.images.length*width.value) move.value = 0;
    obj.style.transform = 'translateX('+x+'px)';
    obj.style.transitionDuration = '0ms';
    // 首尾相连
    if(x >= 0) {
      obj.children[props.images.length-1].style.transform = 'translateX(-'+props.images.length*width.value+'px)';
    } else if(x <= -(props.images.length-1)*width.value) {
      obj.children[0].style.transform = 'translateX('+props.images.length*width.value+'px)';
    } else {
      obj.children[0].style.transform = '';
      obj.children[props.images.length-1].style.transform = '';
    }
  }
};

/* 结束 */
const TouchEnd = (): void => {
  // 缩放
  if(isScale) {
    if(!scaleN) return;
    if(scaleN<props.minScale) scaleN=props.minScale;
    if(scaleN>props.maxScale) scaleN=props.maxScale;
    const obj: any = previewTrack.value;
    const imgObj = obj.children[page.value-1].children[0];
    imgObj.style.transform = 'scale('+scaleN+')';
    imgObj.style.transitionDuration = '300ms';
    scale.value = scaleN;
    scaleN = 0;
  } else {
    // 滑动
    move.value += Math.round(distance/width.value+(distance>=0?props.tolerance:-props.tolerance))*width.value;
    let obj: any = previewTrack.value;
    if(obj) {
      obj.style.transform = 'translateX('+move.value+'px)';
      obj.style.transitionDuration = '300ms';
    }
    // 页码
    let index: number = Math.abs(move.value/width.value);
    if(index>=props.images.length) index = 0;
    page.value = index+1;
  }
};

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