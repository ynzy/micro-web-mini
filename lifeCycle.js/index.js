import { getMainLifeCycle } from "../const/mainLifeCycle";
import { loadHtml } from "../loader";
import { findAppByRoute } from "../utils";

export const lifeCycle = async () => {
  // 获取到上一个子应用
  const prevApp = findAppByRoute(window.__ORIGIN_APP__);
  // 获取到要跳转的子应用
  const nextApp = findAppByRoute(window.__CURRENT_SUB_APP__);
  // console.log(prevApp, nextApp);
  if (!nextApp) {
    return
  }
  // 有上一个子应用，销毁子应用
  // console.log(' prevApp', prevApp)
  // console.log(' nextApp', nextApp)
  if (prevApp && prevApp.unmount) {
    if (prevApp.proxy) {
      prevApp.proxy.inactive() // 将沙箱销毁
    }
    await destoryed(prevApp)
  }
  // 下一个子应用
  const app = await beforeLoad(nextApp)
  await mounted(app)
}
// 微前端的生命周期 - beforeLoad
export const beforeLoad = async (app) => {
  await runMainLifecycle('beforeLoad')
  app && app.beforeLoad && app.beforeLoad()

  const appContext = await loadHtml(app)  // 获取 子应用 显示内容

  return appContext
}
// 微前端的生命周期 - mounted
export const mounted = async (app) => {
  app && app.mount && app.mount({
    appInfo: app.appInfo,
    entry: app.entry
  })
  await runMainLifecycle('mounted')
}
// 微前端的生命周期 - destoryed
export const destoryed = async (app) => {
  app && app.unmount && app.unmount()
  // 对应的执行以下主应用的声明周期
  await runMainLifecycle('destoryed')
}
// 执行主应用生命周期
export const runMainLifecycle = async (type) => {
  const mainLife = getMainLifeCycle()
  await Promise.all(mainLife[type].map(async item => await item()))
}