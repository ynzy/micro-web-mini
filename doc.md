# npm 包发布
1. npm账号
2. npm登录 npm login
3. npm whoami 查看当前登录的账号
4. npm publish 发布
5. npm unpublish 取消发布

## 版本号
* `"version": "1.0.0"`
* 主版本号 1 做了不会向下兼容的改动
* 次版本号 0 做了会向下兼容的功能新增
* 修订号   0 做了会向下兼容的问题修正

## 修改版本
* 修订号   npm version patch
* 次版本号 npm version minor
* 主版本号 npm version major