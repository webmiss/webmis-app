<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-action_sheet_body">
      <div class="wm-action_sheet_mask" :style="{opacity: opacity}" @click="close()"></div>
      <div class="wm-action_sheet_content" :style="{transform: 'translateY('+translateY+')'}">
        <div class="wm-action_sheet_title">
          <b>{{ title }}</b>
          <i class="ui ui_close" @click="close()"></i>
        </div>
        <ul class="wm-action_sheet_list mtop1">
          <li v-for="v in actions" @click="subConfirm(v.value)" :style="{color: active==v.value?activeColor:''}">{{ v.label }}</li>
          <li v-if="showCancel" class="mtop10" :style="{color: cancelColor}" @click="subCancel()">{{ cancelText }}</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
.wm-action_sheet_body{position: absolute; top: 0; left: 0; z-index: 999; width: 100%; height: 100%;}
.wm-action_sheet_mask{position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); transition: opacity 0.3s;}
.wm-action_sheet_content{overflow: hidden; position: absolute; z-index: 2; bottom: 0; width: 100%; transform: translateY(0%); text-align: center; background-color: #F8F8F8; border-radius: 8px 8px 0 0; transition: transform 0.3s;}
.wm-action_sheet_title{position: relative; height: 50px; line-height: 50px; text-align: center; background-color: #FFF; color: @Info;}
.wm-action_sheet_title b{font-size: 16px; font-weight: 500;}
.wm-action_sheet_title i{position: absolute; top: 50%; right: 4px; transform: translateY(-50%); width: 40px; height: 40px; line-height: 40px; text-align: center; font-size: 14px;}
.wm-action_sheet_list{overflow: hidden; user-select: none; }
.wm-action_sheet_list li{height: 50px; line-height: 50px; text-align: center; font-size: 16px; background-color: #FFF;}
.wm-action_sheet_list li:active{background-color: @Active;}
.wm-action_sheet_list .active{color: @Primary; background-color: @Primary6;}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/* 参数 */
const props = defineProps({
  visible: { type: Boolean, default: false },             // 是否显示
  title: { type: String, default: '标题' },               // 标题
  active: { type: String, default: <any>'' },             // 默认值
  actions: { type: Array<any>, default: [] },             // 选项 [{label:'男', value:'男'}, {label:'女', value:'女'}]
  activeColor: { type: String, default: '#0064C8' },      // 选择颜色
  showCancel: { type: Boolean, default: true },           // 是否显示取消按钮
  cancelText: { type: String, default: '取消' },          // 取消按钮文本
  cancelColor: { type: String, default: '#73767A' },      // 确认按钮颜色
});
const emit = defineEmits(['confirm', 'cancel', 'update:visible']);
/* 变量 */
const opacity = ref('0');
const translateY = ref('100%');

/* 创建完成 */
onMounted(()=>{
  // 动画
  setTimeout(()=>{
    opacity.value = '1';
    translateY.value = '0%';
  }, 300);
});

/* 确定 */
const subConfirm = (value: any) => {
  emit('confirm', value);
  close();
};

/* 取消 */
const subCancel = () => {
  emit('cancel');
  close();
};

/* 关闭 */
const close = () => {
  opacity.value = '0';
  translateY.value = '100%';
  setTimeout(()=>{
    emit('update:visible', false);
  }, 300);
};

</script>