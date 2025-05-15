import { createStore } from 'vuex';

export default createStore({
  state: {
    statusHeight: 0,                            // 状态栏高度
    isLogin: false,                             // 登录状态
    token: '',                                  // 用户Token
    uinfo: {},                                  // 用户信息
    socket: null,                               // Socket
    msg: {gid:'', fid:'', num: 0, list: []},    // Msg
    /* 缓存路由 */
    keepAlive: ['Home'],
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
