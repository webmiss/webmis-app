<template>
  <div id="app">
    <!-- 更新APP -->
    <div v-if="update.show" class="update_body">
      <div class="update_ct verticalCenter">
        <div class="logo"><div></div></div>
        <div class="loading" :style="{backgroundImage: 'linear-gradient(to right, #6FB737, #6FB737 '+update.loading+', #000000 '+update.loading+', #000000 100%)'}"></div>
        <div class="load_msg">{{update.msg}}</div>
        <div class="load_button">
          <button v-if="update.down" @click="updateDown()">{{ update.button }}</button>
        </div>
      </div>
      <div class="update_copy"><h1>{{info.title}}</h1><h2>{{info.copy}}</h2></div>
    </div>
    <!-- 更新APP End -->
    <!-- 页面 -->
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <keep-alive :include="state.keepAlive">
          <component :is="Component" class="view" />
        </keep-alive>
      </transition>
    </router-view>
    <!-- 页面 End -->
  </div>
</template>

<style lang="less">
/* 表单缩放问题 */
@media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
  select:focus, textarea:focus, input:focus { font-size: 16px !important; }
}
/* 样式 */
@import url('./assets/style/icon.less');
@import url('./assets/style/ui.less');
@import url('./assets/style/app.less');
</style>
<style lang="less" scoped>
/* 更新 */
.update_body{position: absolute; z-index: 999; width: 100%; height: 100%; background-color: @update_bg;}
.update_copy{position: fixed; width: 100%; left: 0; bottom: 15px; line-height: 20px; text-align: center; padding: 10px 0; color: @update_copy;}
.update_copy h1{font-size: 16px;}
.update_copy h2{font-size: 10px; font-weight: normal;}
.update_ct{width: 220px;}
.update_ct .logo{width: 100px; height: 100px; margin: 0px auto 20px; border-radius: 50%; background-color: @update_logo;}
.update_ct .logo div{height: 100%; background: url('./assets/logo.svg') no-repeat center; background-size: 65%;}
.update_ct .loading{height: 4px; border-radius: 2px; background: none;}
.update_ct .load_msg{color: @update_msg; text-align: center; padding: 8px 0; font-size: 14px;}
.update_ct .load_button{text-align: center; padding-top: 16px;}
.update_ct .load_button button{width: auto; height: 36px; line-height: 36px; padding: 0 20px; font-size: 14px; background-color: @update_but; color: @update_text;}
</style>

<script lang="ts" src="./App.ts"></script>
