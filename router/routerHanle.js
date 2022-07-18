import { lifeCycle } from "../lifeCycle.js";
import { isTurnChild } from "../utils";

export const turnApp = async (e) => {
  if (isTurnChild()) {
    console.log('子应用切换了');
    // 微前端的声明周期执行
    await lifeCycle()
  }
}