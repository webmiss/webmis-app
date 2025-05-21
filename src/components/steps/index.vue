<template>
  <div class="wm-steps_body">
    <div v-for="(v, k) in options" class="wm-steps" :class="k==active?'active':''">
      <div class="wm-steps_title">
        <h2 v-if="v.label">{{ v.label }}</h2>
        <span class="time">{{ v.time }}</span>
      </div>
      <div class="wm-steps_text" v-html="v.value"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wm-steps_body{position: relative; overflow: hidden; padding: 0 10px 0 40px;}
.wm-steps_body::before{content: ''; position: absolute; top: 20px; left: 18px; width: 3px; height: calc(100% - 20px); background-color: @BaseFill;}
.wm-steps{position: relative; padding: 10px 0;}
.wm-steps:last-child::after{content: ''; position: absolute; left: -25px; bottom: 0; width: 10px; height: calc(100% - 24px); background-color: #FFF;}
.wm-steps_title{position: relative; line-height: 24px; display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;}
.wm-steps_title::before,.wm-steps_title::after{content: ''; position: absolute; z-index: 1; border-radius: 50%;}
.wm-steps_title::before{left: -29px; width: 16px; height: 16px; background-color: @BaseFill;}
.wm-steps_title::after{left: -25px; width: 8px; height: 8px; background-color: @Info;}
.wm-steps_title h2{font-size: 15px; padding-right: 8px; font-weight: bold;}
.wm-steps_title .time{font-size: 14px; color: @Info;}
.wm-steps_text{line-height: 24px;}
.wm-steps.active .wm-steps_title::after{background-color: @Primary;}
.wm-steps.active,.wm-steps.active .time{color: @Primary;}
</style>

<script setup lang="ts">

/* 参数 */
const props = defineProps({
  active: { type: Number, default: 0 },             // 默认值
  options: { type: Array<any>, default: [] },       // 数据: [{time:'', label:'', value:''}]
});

</script>