/* Plus */
export default class Plus {

  /* 是否加载 */
  public static Ready(callback: any): void {
    document.addEventListener("plusready", callback, false);
  }

}