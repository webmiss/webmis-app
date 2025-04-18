<template>
  <div class="wm-tabbar_body">
    <div v-for="v in columns" class="wm-tabbar_ct" :style="{
      height: 'calc(100% - '+height+')',
      visibility: active===v.slot?'inherit':'hidden',
    }">
      <slot v-if="v.slot" :name="v.slot"></slot>
      <span v-else>{{ v.label }}</span>
    </div>
    <ul class="wm-tabbar_bottom flex" :style="{height: height, color: color, backgroundColor: bgColor, boxShadow: shadow}">
      <li v-for="v in columns" @click="tabClick(v)" :style="{color: v.slot===active?activeColor:''}">
        <i class="icon" :class="v.icon"></i>
        <span class="name">{{ v.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.wm-tabbar_body{overflow: hidden; position: relative; width: 100%; height: 100%;}
.wm-tabbar_ct{position: absolute; width: 100%;}
.wm-tabbar_bottom{user-select: none; width: 100%; position: absolute; bottom: 0;}
.wm-tabbar_bottom li{display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center;}
.wm-tabbar_bottom .icon{font-size: 24px;}
.wm-tabbar_bottom .name{zoom: 0.8; font-size: 12px; padding-top: 4px;}
</style>

<script setup lang="ts">

/* 参数 */
const props = defineProps({
  active: {default: ''},                                      // 默认值
  columns: {type: Array<any>, default: []},                   // 字段: [{label: '首页', icon: 'icons icon_home', slot: 'index'}]
  height: {type: String, default: '55px'},                    // 高度
  color: {type: String, default: '#999'},                     // 文本颜色
  bgColor: {type: String, default: '#FFF'},                   // 背景颜色
  activeColor: {type: String, default: '#0064C8'},            // 选中颜色
  shadow: {type: String, default: '0 0 1px rgba(0,0,0,0.2)'}, // 阴影
});
const emit = defineEmits(['update:active', 'update:change']);

/* 切换 */
const tabClick = (d: any): void => {
  // 事件
  emit('update:active', d.slot);
  emit('update:change', d);
}

</script>