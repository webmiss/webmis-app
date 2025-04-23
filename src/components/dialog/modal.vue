<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-show_modal_mask" :style="{opacity: opacity}">
      <div class="wm-show_modal_body" :style="{transform: 'translate(-50%, '+translateY+')'}">
        <h3 class="wm-show_modal_title">{{ title }}</h3>
        <div class="wm-show_modal_content">
          <p v-if="!editable">{{ content }}</p>
          <input v-else v-model="inputValue" :placeholder="placeholder" />
        </div>
        <div class="wm-show_modal_footer">
          <button v-if="showCancel" @click="subCancel" :style="{ color: cancelColor }">{{ cancelText }}</button>
          <button @click="subConfirm" :style="{ color: confirmColor }">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
.wm-show_modal_mask{position: fixed; top: 0; left: 0; z-index: 999; width: 100%; height: 100%; background-color: rgba(0,0,0,0.3); transition: opacity 0.3s;}
.wm-show_modal_body{overflow: hidden; position: absolute; top: 50%; left: 50%; width: calc(100% - 40px); max-width: 640px; transform: translate(-50%, -50%); text-align: center; background-color: #FFF; border-radius: 8px; transition: transform 0.3s;}
.wm-show_modal_title{padding: 16px 10px 0; line-height: 40px; font-size: 16px; font-weight: 540;}
.wm-show_modal_content{padding: 16px 16px 32px; line-height: 24px; color: @Info;}
.wm-show_modal_content input{padding: 0 10px; width: 100%; height: 40px; box-sizing: border-box; border: none; background: none; appearance: none; outline: none; font: 400 14px Arial; caret-color: @Primary; border: @BaseBorder 1px solid; border-radius: 4px; background-color: #FFF;}
.wm-show_modal_content input:focus{outline: none; border-color: @Primary; background-color: @Primary5; border: 1px solid @Primary; box-shadow: none;}
.wm-show_modal_footer{display: flex; width: 100%; height: 48px;}
.wm-show_modal_footer button{border: none; font-size: 16px; background-color: #FFF; box-shadow: 0 0 1px rgba(0,0,0,0.3); display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center;}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/* 参数 */
const props = defineProps({
  visible: { type: Boolean, default: false },             // 是否显示
  title: { type: String, default: '标题' },               // 标题
  content: { type: String, default: '内容' },             // 内容
  showCancel: { type: Boolean, default: true },           // 是否显示取消按钮
  cancelText: { type: String, default: '取消' },          // 取消按钮文本
  cancelColor: { type: String, default: '#303236' },      // 确认按钮颜色
  confirmText: { type: String, default: '确定' },         // 确认按钮文本
  confirmColor: { type: String, default: '#0064C8' },     // 确认按钮颜色
  editable: { type: Boolean, default: false },            // 是否显示输入框
  placeholder: { type: String, default: '请输入' },       // 输入框提示文本
});
const emit = defineEmits(['confirm', 'cancel', 'update:visible']);
/* 变量 */
const inputValue = ref('');
const opacity = ref('0');
const translateY = ref('-60%');

/* 创建完成 */
onMounted(()=>{
  // 默认值
  if(props.editable) inputValue.value = props.content;
  // 动画
  setTimeout(()=>{
    opacity.value = '1';
    translateY.value = '-50%';
  }, 300);
});

/* 确定 */
const subConfirm = () => {
  emit('confirm', inputValue.value);
  close();
};

/* 取消 */
const subCancel = () => {
  emit('cancel');
  close();
};

/* 关闭 */
const close = () => {
  inputValue.value = '';
  opacity.value = '0';
  translateY.value = '-60%';
  setTimeout(()=>{
    emit('update:visible', false);
  }, 300);
};

</script>