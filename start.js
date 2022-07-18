import { setMainLifeCycle } from './const/mainLifeCycle'
import { setList, getList } from './const/subApps'
import { Custom } from './customEvent'
import { prefetch } from './loader/prefetch'
import { rewriteRouter } from './router/rewriteRouter'
import { currentApp } from './utils'

const custom = new Custom()
custom.on('test', (data) => {
  console.log(data);
})

window.custom = custom

// 实现路由拦截
rewriteRouter()

export const registerMicroApps = (appList, lifeCycle) => {
  // console.log('appList', appList)
  //! 设置子应用列表
  setList(appList);
  // 设置主应用声明周期
  setMainLifeCycle(lifeCycle)
}

// 启动微前端框架
export const start = () => {
  // 首先验证当前子应用列表是否为空
  const apps = getList()
  if (!apps.length) {
    //  子应用列表为空
    throw Error('子应用列表为空，请正确注册')
  }
  // 有子应用列容，查找到符合当前路由的子应用
  const app = currentApp()
  if (app) {
    const { pathname, hash } = window.location
    const url = pathname + hash
    window.history.pushState('', '', url)
    // 设置当前子应用标识
    window.__CURRENT_SUB_APP__ = app.activeRule
  }

  // 预加载 - 加载接下来所有的子应用，但是不显示
  prefetch()
}