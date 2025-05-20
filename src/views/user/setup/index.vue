<template>
  <PageView bgColor="linear-gradient(to bottom, #F8F8F8 0%, #F8F8F8 100%)">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>设置</template>
    <ScrollView :isUpper="false" :isLower="false">
      <ul class="menu_list mbottom10">
        <li class="flex mtop1">
          <div class="flex ico"><b>用户ID</b></div>
          <div class="flex" @click="Copy(state.uinfo.uid)">
            <span class="info">{{ state.uinfo.uid || '-' }}</span>
            <i class="ui ui_copy"></i>
          </div>
        </li>
        <li class="flex mtop1">
          <div class="flex ico"><b>登录帐号</b></div>
          <div class="flex" @click="Copy(state.uinfo.uname)">
            <span class="info">{{ state.uinfo.uname || '-' }}</span>
            <i class="ui ui_copy"></i>
          </div>
        </li>
        <li class="flex mtop10">
          <div class="flex ico"><b>清理缓存</b></div>
          <div class="flex"><span class="info">0.00 MB</span><i class="ui ui_arrow_right"></i></div>
        </li>
        <li class="flex mtop1">
          <div class="flex ico"><b>关于我们</b></div>
          <div class="flex"><span class="info">{{ Env.version }}</span><i class="ui ui_arrow_right"></i></div>
        </li>
        <li class="flex mtop10">
          <wmButton effect="text" type="danger" width="100%" height="100%" @click="logout()">退出登录</wmButton>
        </li>
      </ul>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
</style>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
/* JS组件 */
import Env from '../../../config/Env';
import Storage from '../../../library/storage';
import Ui from '../../../library/ui';
import Util from "../../../library/utils";
/* 组件 */
import PageView from '../../../components/view/page.vue';
import ScrollView from '../../../components/view/scroll.vue';
import wmButton from '../../../components/form/button/index.vue';

const { proxy } = getCurrentInstance() as any ;
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const page = ref({num: 1, limit: 30});

/* 复制 */
const Copy = (val: string): void => {
  Util.CopyText(val);
  Ui.Toast('复制成功');
}

/* 退出登录 */
const logout = async (): Promise<void> => {
  const res = await proxy.$showModal({title:'切换帐号', content:'是否退出登录'});
  if(res.confirm) {
    // 缓存信息
    state.isLogin = false;
    state.token = '';
    state.uinfo = {};
    Storage.removeItem('token');
    Storage.removeItem('uinfo');
    // 返回首页
    router.go(-1);
  }
}

</script>