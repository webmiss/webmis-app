<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-preview_body" :style="{opacity: opacity}">
      <div class="wm-preview_top">
        <i class="ui ui_close" @click="close()"></i>
        <span>{{ page }}/{{ props.images.length }}</span>
      </div>
      <div class="wm-preview_swipe" @touchstart.passive="TouchStart" @touchmove.passive="TouchMove" @touchend.passive="TouchEnd">
        <div ref="previewTrack" class="wm-preview_track">
          <div v-for="img in images" class="wm-preview_item" :style="{width: width+'px'}">
            <div class="wm-preview_image">
              <img :src="img">
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
.wm-preview_item{width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;}
.wm-preview_image{width: 100%;}
.wm-preview_image img{width: 100%;}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/* 参数 */
const props = defineProps({
  visible: {type: Boolean, default: false},               // 是否显示
  title: {type: String, default: '标题'},                 // 标题
  images: {type: Array<any>, default: []},                // 图片地址
  index: {type: Number, default: 0},                      // 索引
  tolerance: {type: Number, default: 0.2},                // 容差: 0-0.5
});
const emit = defineEmits(['update:visible', 'update:index', 'close']);
// 变量
const page = ref(1);
const width = ref(0);
const opacity = ref('0');
const previewTrack = ref(null);
// 移动
let startX=0, distance=0;
let move = ref(0);

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
  const touch = e.touches?e.touches[0]:e;
  startX = touch.pageX;
};

/* 移动 */
const TouchMove = (e: any): void => {
  if(props.images.length<=1) return;
  const touch = e.touches?e.touches[0]:e;
  distance = touch.pageX - startX;
  let x: number = move.value+distance;
  if(x > width.value) move.value = -(props.images.length-1)*width.value;
  else if(x < -props.images.length*width.value) move.value = 0;
  // 容器
  let obj: any = previewTrack.value;
  if(!obj) return;
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
};

/* 结束 */
const TouchEnd = (): void => {
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