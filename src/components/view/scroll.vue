<template>
  <div class="wm-scroll_body" :style="{backgroundColor: bgColor, color: color}">
    <div class="wm-scroll_ct" :style="{scrollBehavior: behavior as any}" ref="freshContainer" @touchstart.passive="TouchStart" @touchmove.passive="TouchMove" @touchend.passive="TouchEnd" @scroll="Scroll">
      <!-- 下拉刷新 -->
      <div class="wm-scroll_refresh" :style="{marginTop: '-'+upper+'px', height: upper+'px', lineHeight: upper+'px', transform: `translateY(${distance}px)`}">
        <slot v-if="$slots.refresh" name="refresh"></slot>
        <template v-else>{{ refreshing?'加载中...':distance>60?'释放刷新':'下拉刷新' }}</template>
      </div>
      <!-- 下拉刷新 End -->
      <!-- 内容 -->
      <slot></slot>
      <!-- 内容 End -->
      <!-- 上拉加载 -->
      <div class="wm-scroll_load" v-if="loading" :style="{height: lower+'px', lineHeight: lower+'px'}">
        <slot v-if="$slots.load" name="load"></slot>
        <template v-else>加载中...</template>
      </div>
      <!-- 上拉加载 End -->
    </div>
  </div>
</template>

<style lang="less">
.wm-scroll_body{width: 100%; height: 100%;}
.wm-scroll_ct{position: relative; width: 100%; height: 100%; overflow-y: auto; touch-action: pan-y;}
.wm-scroll_refresh{position: absolute; z-index: 99; left: 0; top: 0; width: 100%; text-align: center; transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: translateZ(0);}
.wm-scroll_load{position: fixed; z-index: 99; bottom: 0; width: 100%; text-align: center;}
</style>

<script setup lang="ts">
import { ref } from 'vue';

/* 参数 */
const props = defineProps({
  refreshing: {type: Boolean, default: false},        // 刷新中
  loading: {type: Boolean, default: false},           // 加载中
  finished: {type: Boolean, default: false},          // 加载中
  color: {type: String, default: ''},                 // 文本颜色
  bgColor: {type: String, default: ''},               // 背景颜色
  upper: {type: Number, default: 64},                 // 顶部距离
  lower: {type: Number, default: 40},                 // 底部距离
  isUpper: {type: Boolean, default: true},            // 是否下拉
  isLower: {type: Boolean, default: true},            // 是否上拉
  behavior: {type: String, default: 'auto'},          // 滑动效果: auto、smooth
});
const emit = defineEmits(['update:refreshing', 'update:loading', 'update:finished', 'refresh', 'load', 'scroll']);
const freshContainer = ref(null);
// 变量
const scrollTop = ref(0);
const startY = ref(0);
const distance = ref(0);

/* 开始 */
const TouchStart = (e: any): void => {
  scrollTop.value = (freshContainer.value as any).scrollTop;
  if(scrollTop.value<=0) {
    startY.value = e.touches[0].pageY;
  }
};

/* 移动 */
const TouchMove = (e: any): void => {
  if(props.isUpper && scrollTop.value<=0) {
    const currentY = e.touches[0].pageY;
    distance.value = currentY - startY.value;
  }
};

/* 结束 */
const TouchEnd = (): void => {
  // 下拉刷新
  if(props.isUpper) {
    if (distance.value > props.upper) {
      emit('update:refreshing', true);
      emit('refresh');
    }
  }
  distance.value = 0;
};

/* 滚动 */
const Scroll = (): void => {
  const el: any = freshContainer.value;
  // 上拉加载
  if(props.isLower) {
    const isBottom: boolean = el.scrollTop+el.clientHeight >= el.scrollHeight-props.lower;
    if(isBottom && !props.loading && !props.finished) {
      emit('update:loading', true);
      emit('load');
    }
  }
  // 事件
  emit('scroll', {scrollTop:el.scrollTop, scrollHeight:el.scrollHeight, clientHeight:el.clientHeight});
}

/* 位置-获取 */
const getScrollTop = (): number => {
  return (freshContainer.value as any).scrollTop;
}
/* 位置-更新 */
const setScrollTop = (scrollTop: number): void => {
  (freshContainer.value as any).scrollTop = scrollTop;
}

/* 外部函数 */
defineExpose({getScrollTop, setScrollTop});

</script>