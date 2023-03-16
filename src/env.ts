/* 模式: dev(开发) */
const mode: string = '';

/* 接口 */
let baseUrl: string, socket: string;
if(mode=='dev'){
  baseUrl = 'http://localhost:9000/';
  socket = 'ws://localhost:9001/';
}else{
  baseUrl = 'https://api.cszb.vip/';
  socket = 'wss://api.cszb.vip/wss';
}

/* 配置 */
const now = new Date();
export default {
  title: 'WebMIS VueAPP',                               // 应用名称
  version: '1.0.0',                                     // 应用版本
  copy: 'Copyright © WebMIS.vip ' + now.getFullYear(),  // 版权信息
  baseUrl: baseUrl,                                     //数据地址
  apiUrl: baseUrl+'m/',                                 //数据接口地址
  /* Token */
  token: '',
  /* 请求 */
  request: {
    headers: {
      "Content-Type": "application/json;charset=utf-8"  // 表单方式
    },
    responseType: 'json', //返回类型
    timeout: 10000, //超时设置
  },
  /* 状态栏 */
  statusBar:{
    height: 48, //默认高度
    color: '#333',  //字体颜色
    bgColor:'#FFF'  //背景颜色
  },
  /* 更新 */
  update: {
    start: true,
    iosUrl: 'itms-apps://itunes.apple.com/cn/app/tao-bao-sui-shi-sui-xiang/id387682726?mt=8', //IOS下载链接
  },
  /* Login */
  login: {
    start: true,  //Token验证
    api: 'user/token',  //验证接口
    uinfo: 'uinfo', //用户信息
    time: 10000, //间隔时间
  },
  /* 高德地图 */
  amap: {
    start: true,  //开启定位
    jsapi_key: 'd956f0c3e15489a1b5bf291e5d133c8a',  
  },
  /* Socket */
  socket: {
    channel: 'api',
    start: false, //启动
    server: socket, //链接地址
    time: 3000, //重连时间
    heartbeat: 10000, //心跳检测时间
  },
  /* 消息 */
  msg: {
    content: 'content',  //阅读：title(标题)、content(内容)
    browser: false,  //浏览器信息
  },
  /* 小程序 */
  wx_type: 0, //正式版(0)、测试版(1)、体验版(2)
  wx_id: 'gh_a6ddccd2bb08', // 应用ID
}
