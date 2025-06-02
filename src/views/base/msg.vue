<template>
  <PageView bgColor="#F8F8F8">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>{{ info.title }}</template>
    <ScrollView v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false">
      MSG
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
.html_time{line-height: 40px; text-align: center; font-size: 12px; color: @Info;}
.html_date{padding: 10px 16px; line-height: 24px; background-color: #FFF;}
.html_body{padding: 16px; line-height: 24px; font-size: 14px; background-color: #FFF;}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
import Time from '../../library/time';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';

// 状态
const route = useRoute();
const router = useRouter();
// 变量
const info = ref({title:'用户呢称', time:'', cdate:'', udate:'', content:''});
const scroll = ref({refreshing: false, loading: false, finished: false});

/* 创建完成 */
onMounted(()=>{
  // loadData();
});

/* 加载数据 */
const loadData = (): void => {
  // 请求
  Request.Post('index/html', {name: route.query.name}, (res:any)=>{
    const {code, msg, time, data} = res.data;
    if(code===0 && data) {
      info.value.time = time;
      info.value.title = data.title;
      info.value.content = data.content;
      info.value.cdate = Time.Date('Y年m月d日', Time.StrToTime(data.ctime));
      info.value.udate = Time.Date('Y年m月d日', Time.StrToTime(data.utime));
      // 重置刷新
      scroll.value.refreshing = false;
    } else return Ui.Toast(msg);
  });
}

</script>