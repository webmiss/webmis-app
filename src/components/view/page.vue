<template>
  <div class="wm-page_body" :style="{background: bgColor, color: color}">
    <div class="wm-page_bar" :style="{backgroundColor: barBgColor, boxShadow: barShadow, height: barHeight, lineHeight: 'calc('+barHeight+' - 10px)', paddingTop: 'calc('+state.statusHeight+'px + 5px)'}">
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
    <div v-if="immersed" :style="{height: 'calc('+height+' - '+state.statusHeight+'px)'}">
      <slot></slot>
    </div>
    <div v-else :style="{height: 'calc('+height+' - '+barHeight+' - '+state.statusHeight+'px)', paddingTop: 'calc('+barHeight+' + '+state.statusHeight+'px)'}">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less">
.wm-page_body{width: 100%; height: 100%;}
.wm-page_bar{position: absolute; z-index: 99; top: 0; width: 100%; padding: 5px 10px; box-sizing: border-box;}
.wm-page_bar_left{position: absolute; left: 10px;}
.wm-page_bar_right{position: absolute; right: 10px;}
.wm-page_bar_right .text{padding: 5px 10px;}
.wm-page_bar_title{height: 100%; text-align: center; font-size: 16px; font-weight: bold;}
</style>

<script setup lang="ts">
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
  barShadow: {type: String, default: '0 0 1px rgba(0,0,0,0.2)'},  // 状态栏-阴影
});
const emit = defineEmits(['update:value', 'data']);
// 状态
const store = useStore();
const state = store.state;

</script>