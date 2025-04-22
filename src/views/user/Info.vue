<template>
  <PageView bgColor="#F8F8F8">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>编辑资料</template>
    <ScrollView :isUpper="false" :isLower="false">
      <div class="me_info">
        <div class="me_info_img" :style="{backgroundImage:state.uinfo.img?'url('+(state.uinfo.img)+')':'', backgroundSize: state.uinfo.img?'100%':'60%'}"></div>
        <div class="me_info_text">UID: {{ state.uinfo.uid || '-' }}</div>
      </div>
      <ul class="menu_list">
              <li class="mtop10">
                <div class="flex ico"><b>呢称</b></div>
                <div class="flex"><span>{{ state.uinfo.nickname || '请输入' }}</span><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><b>部门</b></div>
                <div class="flex"><span>{{ state.uinfo.department || '-' }}</span></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><b>职务</b></div>
                <div class="flex"><span>{{ state.uinfo.position || '-' }}</span></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><b>姓名</b></div>
                <div class="flex"><span>{{ state.uinfo.name || '-' }}</span></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><b>性别</b></div>
                <div class="flex"><span>{{ state.uinfo.gender || '请选择' }}</span><i class="ui ui_arrow_right"></i></div>
              </li>
              <li class="mtop1">
                <div class="flex ico"><b>生日</b></div>
                <div class="flex"><span>{{ state.uinfo.birthday || '请选择' }}</span><i class="ui ui_arrow_right"></i></div>
              </li>
            </ul>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
.me_info{position: relative; height: 200px; background-color: #FFF;}
.me_info_img{position: absolute; z-index: 2; width: 120px; height: 120px; left: 50%; top: 48%; transform: translate(-50%, -50%); border-radius: 50%; border: #FFF 2px solid; background-image: url('../../assets/logo.svg'); background-size: 60%; background-color: #F2F4F8; background-repeat: no-repeat; background-position: center;}
.me_info_text{position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const page = ref({num: 1, limit: 30});

/* 创建完成 */
onMounted(()=>{
  loadData();
});

/* 加载数据 */
const loadData = (): void => {
  console.log('uinfo');
}

</script>