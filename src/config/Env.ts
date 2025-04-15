/* 配置文件 */
export default class Env {

  public static mode: string = 'dev';              // 模式: 开发(dev)
  public static title: string = 'WebMIS';       // 项目名称
  public static version: string = '3.0.0';      // 版本
  public static lang: string = 'zh_CN'          // 语言
  public static copy: string = '©'+(new Date()).getFullYear()+' webmis.vip';
  public baseUrl: string = '';                  // 网址
  public apiUrl: string = 'api/';               // 接口地址
  public socketUrl: string = '';                // Socket地址

  /* 构造函数 */
  constructor() {
    if(Env.mode=='dev') {
      this.baseUrl = 'http://localhost:9000/';
      // this.socketUrl = 'ws://127.0.0.1:9001';
      this.socketUrl = 'wss://php.webmis.vip/wss';
    } else {
      this.baseUrl = 'https://php.webmis.vip/';
      this.socketUrl = 'wss://php.webmis.vip/wss';
    }
    this.apiUrl = this.baseUrl+this.apiUrl;
  }

  /* 请求 */
  public request(): object {
    return {
      headers: {
        "Content-Type": "application/json;charset=utf-8"  // 表单方式
      },
      responseType: 'json', //返回类型
      timeout: 180000,      //超时设置
    }
  }

  /* Socket */
  public socket(): object {
    return {
      start: true,              // 启动
      server: this.socketUrl,   // 服务器
      channel: 'api',           // 频道
      time: 3000,               // 重连时间
      heartbeat: 10000,         // 心跳时间
    }
  }

  /* Update */
  public static update(): object {
    return {
      start: true,              // 启动
      iosUrl: 'itms-apps://itunes.apple.com/cn/app/tao-bao-sui-shi-sui-xiang/id387682726?mt=8',
    }
  }

}