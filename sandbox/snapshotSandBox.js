// 快照沙箱 
// 针对给当前全局变量实现快照方式，来记录沙箱内容，子应用切换后，全局变量恢复初始值
// 应用场景：比较老版本的浏览器，同一时间只能显示一个子应用
export class SnapShotSandBox {
  constructor() {
    // 1. 代理对象
    this.proxy = window;
    this.active();
  }
  // 沙箱激活
  active() {
    this.snapshot = {}; // 创建 window 对象的沙箱快照
    // 遍历全局环境
    for (const key in window) {
      // eslint-disable-next-line no-prototype-builtins
      if (window.hasOwnProperty(key)) {
        // 将window上的属性进行拍照
        this.snapshot[key] = window[key];
      }
    }
    // console.log('沙箱激活-', new Date(), '--', this.snapshot);
  }
  // 沙箱销毁
  inactive() {
    for (const key in window) {
      // eslint-disable-next-line no-prototype-builtins
      if (window.hasOwnProperty(key)) {
        // 将上次快照的结果和本次window属性做对比
        // if (key == 'a') {
        //   console.log('对比', key, '----', window[key], '----', this.snapshot[key]);
        // }
        if (window[key] !== this.snapshot[key]) {
          // 还原window
          window[key] = this.snapshot[key];
        }
      }
    }
  }
}
