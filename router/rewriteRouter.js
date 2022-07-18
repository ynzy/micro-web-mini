import { patchRouter } from '../utils'
import { turnApp } from './routerHanle'

// 重写window路由跳转
export const rewriteRouter = () => {
  window.history.pushState = patchRouter(window.history.pushState, 'micro_push')
  window.history.replaceState = patchRouter(window.history.replaceState, 'micro_replace')

  // 添加路由跳转事件监听
  window.addEventListener('micro_push', turnApp)
  window.addEventListener('micro_replace', turnApp)
  // 监听 浏览器返回按钮事件
  window.onpopstate = function () {
    turnApp()
  }
}