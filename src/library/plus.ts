/* Plus */
export default class Plus {

  /* 是否加载 */
  public static Ready(callback: any): void {
    document.addEventListener("plusready", callback, false);
  }

  /* 返回键 */
  public static Back(callback: any): void {
    // @ts-ignore
    plus.key.addEventListener('backbutton', ()=>{
      // @ts-ignore
      const webview = plus.webview.currentWebview();
      webview.canBack(callback);
    });
  }

  /* 是否手机浏览器 */
  public static isMobile(): boolean {
    const ua = navigator.userAgent;
    const isTouch = 'ontouchstart' in window;
    return /Android|webOS|Mobi|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (isTouch && window.innerWidth < 1024);
  }

  /* 浏览器-通知 */
  public static showNotification(title: string, options = {}) {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options)
        }
      });
    }
  }

}