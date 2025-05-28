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

}