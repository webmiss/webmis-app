<template>
  <div v-if="isShow" class="update_body" :style="{color: color, backgroundColor: bgColor}">
    <div class="update_ct">
      <div class="update_logo"></div>
      <div class="update_title">{{ title }}</div>
      <div class="update_load" :style="{backgroundImage: 'linear-gradient(to right, #6FB737, #6FB737 '+form.loading+', #000000 '+form.loading+', #000000 100%)'}"></div>
      <div class="update_msg" v-html="form.msg "></div>
      <div class="update_bottom">
        <wmButton type="primary" effect="dark" :disabled="form.down" @click="updateDown()">{{ form.button }}</wmButton>
      </div>
    </div>
    <div class="update_copy">{{ copy }}</div>
  </div>
</template>

<style lang="less" scoped>
.update_body{position: absolute; z-index: 1000; width: 100%; height: 100%;}
.update_ct{position: absolute; width: calc(100% - 80px); left: 50%; top: 40%; transform: translate(-50%, -50%);}
.update_logo{margin: 16px auto; width: 160px; height: 160px; border: rgba(0, 0, 0, 0.9) 1px solid; background-size: 60%; background-image: url('../../assets/logo.svg'); border-radius: 50%; background-repeat: no-repeat; background-position: center; transition: All 0.5s ease-in-out;}
.update_load{margin: 8px auto; height: 6px; border-radius: 3px;}
.update_title{line-height: 48px; text-align: center; font-size: 24px;}
.update_msg{line-height: 24px; text-align: center;}
.update_bottom{padding: 16px 0; text-align: center;}
.update_copy{position: absolute; left: 50%; bottom: 32px; transform: translateX(-50%); font-size: 12px; color: rgba(255,255,255,0.4);}
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
/* JS组件 */
import Env from '../../config/Env';
import Ui from '../../library/ui';
/* 组件 */
import wmButton from '../../components/form/button/index.vue';

/* 参数 */
const props = defineProps({
  show: {type: Boolean, default: false},                    // 是否显示
  color: {type: String, default: 'rgba(255,255,255,.8)'},   // 文本颜色
  bgColor: {type: String, default: '#242628'},              // 背景颜色
});
const emit = defineEmits(['update:show']);
// 状态
const store = useStore();
const state = store.state;
const title: string = Env.title+' '+Env.version;
const copy: string = Env.copy;
// 变量
const isShow = ref(false);
// 更新APP
const form: any = ref({show:false, os:'', down:false, loading:'1%', msg:'检测更新', file:'', total:0, button:'下载并安装'});

/* 监听 */
watch(()=>props.show, (val:boolean)=>{
  isShow.value = val;
}, { deep: true });

/* 创建完成 */
onMounted(()=>{
  loadData();
});

/* 加载数据 */
const loadData = (): void => {
  console.log('检测升级');
  setTimeout(()=>{
    isShow.value = true;
    const d: any = {version:'3.0.1', size: 3485924};
    form.value.msg = '新版本: '+d.version+'&nbsp;&nbsp;大小: '+(d.size/1024/1024).toFixed(2)+'MB';
  }, 1000);
}

/* 下载更新 */
const updateDown = (): void => {
  form.value.loading = '80%';
  form.value.down = true;
  form.value.button = '正在下载';
}

</script>