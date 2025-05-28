<template>
  <div v-if="isShow" class="app_start_body" :style="{background: bgColor, opacity: opacity}">
    <div class="app_start">
      <div class="app_start_logo"></div>
      <h1 class="app_start_title">{{ Env.title }}</h1>
      <span class="app_start_version">v{{ Env.version }}</span>
    </div>
    <div class="app_start_copy" :style="{color: color}">{{ Env.copy }}</div>
  </div>
</template>

<style lang="less" scoped>
.app_start_body{position: absolute; z-index: 9999; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; transition: opacity 0.3s;}
.app_start{margin-top: -64px; text-align: center;}
.app_start_logo{width: 160px; height: 160px; background: url('../../assets/logo.svg') no-repeat center; background-size: 64%;}
.app_start_title{font-size: 21px; line-height: 32px;}
.app_start_version{font-size: 14px; line-height: 24px; color: #666;}
.app_start_copy{position: absolute; bottom: 20px;}
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
/* JS组件 */
import Env from '../../config/Env';

/* 参数 */
const props = defineProps({
  show: {type: Boolean, default: true},          // 是否显示
  time: {type: Number, default: 3000},           // 停留时间
  color: {type: String, default: '#999'},        // 背景颜色
  bgColor: {type: String, default: 'linear-gradient(to bottom, #FFF 0%, #F2F2F2 100%)'},     // 背景颜色
});
const emit = defineEmits(['update:show']);
// 变量
const isShow = ref(false);
const opacity = ref(1);

/* 监听 */
watch(()=>props.show, (val:boolean)=>{
  isShow.value = val;
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
  isShow.value = props.show;
  setTimeout(()=>{
    opacity.value = 0;
    emit('update:show', false);
    setTimeout(()=>{ isShow.value = false; }, 300);
  }, props.time)
});

</script>