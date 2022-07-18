import { getList } from "../const/subApps";

/**
 * 给当前路由跳转打补丁
 * @param {*} globalEvent 全局原生事件
 * @param {*} eventName 事件名称
 * @returns 
 * 
 * window.history.pushState = patchRouter(window.history.pushState, 'micro_push')
 * window.history.pushState = 函数return的部分
 */
export const patchRouter = (globalEvent, eventName) => {
  return function () {
    const e = new Event(eventName);
    // console.log('arguments', arguments)
    // console.log('this', this)
    // this 指向当前当前监听的函数
    globalEvent.apply(this, arguments); //? 不apply会造成什么问题？
    window.dispatchEvent(e)
  }
}

// 获取当前子应用
export const currentApp = () => {
  const currentUrl = window.location.pathname.match(/(\/\w+)/)[0];
  return filterApp('activeRule', currentUrl)
}

// 通过路由获取子应用
export const findAppByRoute = (router) => {
  return filterApp('activeRule', router)
}

// 过滤出当前子应用
const filterApp = (key, value) => {
  const currentApp = getList().filter(item => item[key] === value)
  return currentApp.length ? currentApp[0] : {}
}
// 子应用是否做了切换
export const isTurnChild = () => {
  // 上一个子应用
  window.__ORIGIN_APP__ = window.__CURRENT_SUB_APP__

  // 匹配 /vue3/ /vue2 输出 /vue3 格式
  const currentApp = window.location.pathname.match(/(\/\w+)/)

  if (!currentApp) {
    return false
  }

  // 如果子应用和当前路由相等，则没有做切换
  if (window.__CURRENT_SUB_APP__ === currentApp[0]) {
    return false
  }

  window.__CURRENT_SUB_APP__ = currentApp[0]
  // console.log(window.__ORIGIN_APP__, window.__CURRENT_SUB_APP__);
  return true
}