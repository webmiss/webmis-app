<template>
  <div class="wm-scroll_body" :style="{backgroundColor: bgColor, color: color}">
    <div class="wm-scroll_ct"
      :style="{transform: `translateY(${distance}px)`}"
      @touchstart="TouchStart"
      @touchmove="TouchMove"
      @touchend="TouchEnd"
    >
      <div class="wm-scroll_refresh">
        {{ isRefreshing ? '加载中...' : distance > 60 ? '释放刷新' : '下拉刷新' }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less">
.wm-scroll_body{position: relative; overflow: auto; touch-action: pan-y; width: 100%; height: 100%;}
.wm-scroll_ct{position: absolute; top: -60px; width: 100%; height: calc(100% + 48px); transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);}
.wm-scroll_refresh{height: 60px; line-height: 60px; text-align: center;}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

/* 参数 */
const props = defineProps({
  immersed: {type: Boolean, default: false},                      // 沉浸式
  color: {type: String, default: ''},                             // 文本颜色
  bgColor: {type: String, default: ''},                           // 背景颜色
  width: {type: String, default: '100%'},                         // 宽
  height: {type: String, default: '100%'},                        // 高
  barHeight: {type: String, default: '48px'},                     // 状态栏-高度
  barBgColor: {type: String, default: '#FFF'},                    // 状态栏-背景颜色
  barShadow: {type: String, default: '0 0 1px rgba(0,0,0,0.2)'},  // 状态栏-背景颜色
});
const emit = defineEmits(['update:value', 'data']);
// 状态
const store = useStore();
const state = store.state;
// 变量
const startY = ref(0);
const distance = ref(0);
const isRefreshing = ref(false);

/* 开始 */
const TouchStart = (e: any): void => {
  startY.value = e.touches[0].pageY;
};

/* 移动 */
const TouchMove = (e: any): void => {
  if (window.scrollY <= 0) {
    const currentY = e.touches[0].pageY;
    distance.value = currentY - startY.value;
  }
};

/* 结束 */
const TouchEnd = async () => {
  if (distance.value > 60) {
    isRefreshing.value = true;
    // await fetchData();
    console.log('下拉刷新');
    isRefreshing.value = false;
  }
  distance.value = 0;
};

</script>