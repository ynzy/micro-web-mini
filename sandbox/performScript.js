// 执行应用的 js 内容 new Function 篇
export const performScriptForFunction = (script, appName, global) => {
  window.proxy = global;

  // 让 script 在函数中执行，隔离环境，执行的window对象是个参数，并不是全局的window对象
  const scriptText =
    `return (window => {
      try {
       ${script}
       return window['${appName}']
      } catch (err) {
          console.error('runScript error:' + err);
      }
    })(window.proxy)`;
  return new Function(scriptText)();
}

// 执行应用中的 js 内容 eval篇
// 通过 global 来代替 window 进行执行
export const performScriptForEval = (script, appName, global) => {
  // 我们在子应用打包配置中设置了library，全局变量名
  // 我们通过执行window.appName 来获取子应用声明周期
  // library window.appName

  window.proxy = global;

  const scriptText =
    `((window) => {
      try {
       ${script}
       return window['${appName}']
      } catch (err) {
          console.error('runScript error:' + err);
      }
    })(window.proxy)`;
  return eval(scriptText);
}
