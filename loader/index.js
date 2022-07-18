import { fetchResource } from "../utils/fetchResource"
import { sandbox } from '../sandbox';
import { performScriptForEval, performScript } from '../sandbox/performScript';
// 加载html的方法
export const loadHtml = async (app) => {
  // 1. 子应用需要显示在哪里
  let container = app.container // #id 
  // console.log(app);
  // 2. 子应用入口
  let entry = app.entry
  const [dom, allScript] = await parseHtml(entry, app.name)
  // console.log(allScript);
  const ct = document.querySelector(container)
  if (!ct) {
    throw Error(`${app.name} 的容器不存在，请查看是否正确指定`);
  }
  ct.innerHTML = dom

  allScript.map((item) => {
    // performScript(item)
    // performScriptForEval(item);
    sandbox(app, item);
  });
  return app
}

// 根据子应用的name做缓存
const cache = {}

export const parseHtml = async (entry, name) => {
  if (cache[name]) {
    return cache[name]
  }
  // 通过 get 请求获取页面信息
  const html = await fetchResource(entry)

  const div = document.createElement('div')
  div.innerHTML = html // 针对此元素做处理

  // 标签、link、script(src,js)
  let allScript = []
  const [dom, scriptUrl, script] = await getResources(div, entry)
  // console.log([dom, scriptUrl, script]);
  // 获取所有js资源
  const fetchedScripts = await Promise.all(scriptUrl.map(async item => await fetchResource(item)))
  // console.log('fetchedScripts', fetchedScripts)
  allScript = script.concat(fetchedScripts)
  cache[name] = [dom, allScript]
  return [dom, allScript]
}

/**
 * 对子应用页面进行解析，获取资源
 * @param {*} root 根元素
 * @param {*} entry 子应用入口
 * @returns [dom, scriptUrl, script]
 */
export const getResources = (root, entry) => {
  const scriptUrl = [] // 完整url的数组
  const script = [] // script内部有执行内容的数组
  const dom = root.outerHTML // outerHtml 包含当前节点根标签内容
  // 深度解析
  function deepParse(element) {
    const children = element.children
    const parent = element.parent
    // 1. 处理位于 script 中的内容
    if (element.nodeName.toLowerCase() === 'script') {
      const src = element.getAttribute('src')
      // 如果没有src，说明script标签中有内容
      if (!src) {
        script.push(element.outerHTML)
      } else {
        if (src.startsWith('http')) {
          scriptUrl.push(src) // 完成url地址
        } else {
          scriptUrl.push(`http:${entry}/${src}`) // 本地url地址
        }
      }
      if (parent) {
        parent.replaceChild(document.createComment('此 js 文件已经被微前端替换'), element)
      }
    }

    // link 也会有js的内容
    if (element.nodeName.toLowerCase() === 'link') {
      const href = element.getAttribute('href')
      if (href.endsWith('.js')) {
        if (href.startsWith('http')) {
          scriptUrl.push(href) // 完成url地址
        } else {
          scriptUrl.push(`http:${entry}/${href}`) // 本地url地址
        }
      }
    }

    // children 中包含一些元素
    for (let i = 0; i < children.length; i++) {
      deepParse(children[i])
    }
  }
  deepParse(root)
  return [dom, scriptUrl, script]
}