<template>
  <div class="wm-page_body" :style="{background: bgColor, color: color}">
    <div class="wm-page_bar" :style="{color: barColor, background: barBgColor, boxShadow: barShadow, height: barHeight, lineHeight: 'calc('+barHeight+' - 10px)', paddingTop: 'calc('+safe_top+' + 5px)'}">
      <div class="wm-page_bar_left" v-if="$slots.bar_left">
        <slot name="bar_left"></slot>
      </div>
      <div class="wm-page_bar_right" v-if="$slots.bar_right">
        <slot name="bar_right"></slot>
      </div>
      <div class="wm-page_bar_title" v-if="$slots.bar_title">
        <slot name="bar_title"></slot>
      </div>
    </div>
    <div v-if="immersed" class="wm-page_content" :style="{height: 'calc('+height+' - '+safe_top+')'}">
      <slot></slot>
    </div>
    <div v-else class="wm-page_content" :style="{height: 'calc('+height+' - '+barHeight+' - '+safe_top+' - 10px)', paddingTop: 'calc('+barHeight+' + '+safe_top+' + 10px)'}">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less">
.wm-page_body{width: 100%; height: 100%;}
.wm-page_bar{position: absolute; z-index: 99; top: 0; width: calc(100% - 20px); padding: 5px 10px; display: flex; justify-content: center; align-items: center;}
.wm-page_bar_left{position: absolute; left: 10px;}
.wm-page_bar_right{position: absolute; right: 10px;}
.wm-page_bar_right .text{padding: 5px 10px;}
.wm-page_bar_title{text-align: center; font-size: 16px; font-weight: bold; display: flex; justify-content: center; align-items: center;}
.wm-page_content{padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Plus from '../../library/plus';

/* 参数 */
const props = defineProps({
  immersed: {type: Boolean, default: false},                      // 沉浸式
  color: {type: String, default: ''},                             // 文本颜色
  bgColor: {type: String, default: ''},                           // 背景颜色
  width: {type: String, default: '100%'},                         // 宽
  height: {type: String, default: '100%'},                        // 高
  barHeight: {type: String, default: '50px'},                     // 状态栏-高度
  barColor: {type: String, default: ''},                          // 状态栏-文本颜色
  barBgColor: {type: String, default: '#FFF'},                    // 状态栏-背景颜色
  barShadow: {type: String, default: '0 0 1px rgba(0,0,0,0.2)'},  // 状态栏-阴影
});
const emit = defineEmits(['update:value', 'data']);
// 状态
const store = useStore();
const state = store.state;
const safe_top = ref('env(safe-area-inset-top)');

/* 加载完成 */
onMounted(()=>{
  Plus.Ready(()=>{
    // @ts-ignore
    if(plus.os.name.toLowerCase()==='android') safe_top.value = state.statusHeight+'px';
  });
});

</script>