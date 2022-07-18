
import { ProxySandBox } from './proxySandBox';
import { performScriptForEval, performScriptForFunction } from './performScript';
import { SnapShotSandBox } from './snapshotSandBox';

// 子应用生命周期处理、环境变量设置
export const sandbox = (app, script) => {
  // 创建沙箱环境
  const proxy = new ProxySandBox();
  if (!app.proxy) {
    app.proxy = proxy;
    uino.sandbox = proxy
  }

  // 1. 设置微前端环境
  window.__MICRO_WEB__ = true;

  // 2. 运行js文件，获取子应用生命周期
  const lifeCycle = performScriptForFunction(script, app.name, proxy.proxy);
  // const lifeCycle = performScriptForEval(script, app.name, proxy.proxy);
  // console.log('lifeCycle', lifeCycle);
  // 将子应用生命周期挂载到app上
  // beforeLoaded 生命周期执行完之后，我们挂载了子应用这些生命周期，所以后面生命周期都会触发到
  if (isCheckLiftCycle(lifeCycle)) {
    app.bootstrap = lifeCycle.bootstrap;
    app.mount = lifeCycle.mount;
    app.unmount = lifeCycle.unmount;
  }


}

// 判断是否有生命周期
function isCheckLiftCycle(lifeCycle) {
  return lifeCycle && lifeCycle.bootstrap && lifeCycle.mount && lifeCycle.unmount;
}