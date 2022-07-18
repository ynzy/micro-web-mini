export const isFunction = (value) => typeof value === 'function';

let defaultValue = {};
// 代理沙箱
export class ProxySandBox {
  constructor() {
    this.proxy = null;
    this.active();
  }
  active() {
    // 当我们操作window对象时，操作的是代理对象
    // 设置的值放在defaultValue中
    this.proxy = new Proxy(window, {
      get(target, propKey) {
        // console.log('propKey', propKey);
        // 函数做特殊处理，this指向原对象
        if (isFunction(target[propKey])) {
          return target[propKey].bind(target)
        }
        // 如果代理值查找不到就使用原值
        return defaultValue[propKey] || target[propKey];
      },
      set(target, propKey, value) {
        defaultValue[propKey] = value
        return true
      }
    });
  }
  inactive() {
    defaultValue = {};
    console.log('关闭沙箱');
  }
}
