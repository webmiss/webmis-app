<template>
  <div class="msg_search_body" :style="{visibility:isShow?'inherit':'hidden'}">
    <PageView bgColor="#F8F8F8">
      <template #bar_left><i class="back ui ui_arrow_left" @click="close()"></i></template>
      <template #bar_title>
        <div class="msg_search">
          <i class="ui ui_search"></i>
          <wm-input ref="msgSearch" v-model:value="sea.key" @update:value="serachVal($event)" @keyup.enter="serachVal($event.target.value)" placeholder="联系人" padding="10px 10px 10px 40px" enterkeyhint="search"></wm-input>
        </div>
      </template>
      <template #bar_right>
        <div class="msg_quit" @click="close()">取消</div>
      </template>
      <ScrollView :isLower="false">
        <ul class="msg_user_list" v-if="sea.list.length>0">
          <li v-for="v in sea.list" @click="searchClick(v)">
            <div class="bgImg" :style="{backgroundImage: v.img?'url('+v.img+')':''}">
              <i class="ui ui_user" v-if="!v.img"></i>
            </div>
            <div class="name nowrap">{{ v.title }}</div>
          </li>
        </ul>
        <div class="null" v-else></div>
      </ScrollView>
    </PageView>
  </div>
</template>

<style lang="less" scoped>
.msg_search_body{position: fixed; z-index: 999; left: -1px; top: 0; width: calc(100% + 2px); height: 100%; background-color: #F8F8F8;}
.msg_search_body .null{height: 50%;}
.msg_quit{width: 50px; text-align: center;}
.msg_search{position: relative; width: calc(100% - 100px); padding-right: 10px;}
.msg_search i{position: absolute; z-index: 1; top: 50%; transform: translateY(-50%); width: 40px; height: 100%; font-size: 24px; color: @IconColor; font-weight: normal;}
.msg_search .ui_search{left: 0; font-size: 20px;}
.msg_user_list{padding: 8px 0;}
.msg_user_list li{margin: 1px auto; padding: 8px 16px; background-color: #FFF; display: flex; justify-content: space-between; align-items: center;}
.msg_user_list li:active{background-color: #F2F2F2;}
.msg_user_list .bgImg{width: 48px; height: 48px; display: flex; justify-content: center; align-items: center; background-color: #F2F2F2; border-radius: 4px;}
.msg_user_list .bgImg i{font-size: 24px; color: @IconColor;}
.msg_user_list .name{width: calc(100% - 48px); padding: 0 10px; font-size: 15px; box-sizing: border-box;}
</style>

<script setup lang="ts">
import { ref, watch, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
/* JS组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';
import wmInput from '../../components/form/input/index.vue';

/* 参数 */
const props = defineProps({
  show: {type: Boolean, default: false},   // 是否显示
});
/* 公共 */
const emit = defineEmits(['update:show', 'confirm']);
const { proxy } = getCurrentInstance() as any ;
/* 状态 */
const store = useStore();
const state = store.state;
/* 变量 */
const isShow = ref(false);
const sea = ref({key:'', list:<any>[]});

/* 监听 */
watch(()=>props.show, (val:boolean)=>{
  isShow.value = val;
  if(val) {
    sea.value.key = '';
    sea.value.list = [];
    proxy.$refs.msgSearch.focus();
  }
}, { deep: true });

/* 搜索内容 */
const serachVal = (val: string): void => {
  const key: string = val.trim();
  if(val) {
    Request.Post('msg/sea?lang='+state.lang, {
      token: state.token,
      key: key,
    }, (res:any)=>{
      const d = res.data;
      if(d.code==0) sea.value.list = d.data;
    });
  } else {
    sea.value.list = [];
  }
}

/* 搜索-点击 */
const searchClick = (row: any): void => {
  emit('confirm', row);
  close();
}

/* 关闭 */
const close = (): void => {
  // 隐藏
  emit('update:show', false);
}

</script>