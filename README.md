# Taro React 小程序注入全局组件

## 缘由

众所周知，小程序中不能定义全局组件，如果我们想自定义一个 modal 弹窗，来替代 **wx.showModal** 的话，则需要在每个页面手动的引入组件。随着项目越来越大，手动引入组件无疑是繁琐和低效的，因而抽空开发了这个 webpack-loader 代替手动操作。

## 作用

为每个页面注入全局组件。支持主包和分包，支持类写法和函数写法。

## 环境

`taro react`

## 安装

`npm install taro-inject-component-loader -D` 。

## 配置

### 配置项

>* importSpecifier 导入标识符
>* componentName 导入的组件名称
>* isPage 判断当前遍历到的文件是否为页面（可选配置）

isPage 不传的情况下，默认会将 `src/pages/页面名称/index.[tj]sx` 和 `src/package-模块名称/pages/页面名称/index.[tj]sx` 这两种情形下的文件识别为页面。

### 配置示例

```ts
  webpackChain(chain) {
    chain.merge({
      module: {
        rule: {
          injectBaseComponentLoader: {
            test: /\.tsx$/,
            use: [
              {
                loader: 'taro-inject-component-loader',
                options: {
                  // 导入标识符
                  importSpecifier: '@components/BaseComponent', 

                  // 导入组件名
                  componentName: 'BaseComponent',

                  // 判断遍历到的文件是否为页面
                  isPage(filePath) {
                    return /(package-.+\/)?pages\/.+\/index\.tsx$/.test(filePath)
                  }
                },
              },
            ],
          },
        },
      },
    });
  },
```

注入后的代码示例

```tsx
import { BaseComponent } from '@components/BaseComponent'

...

<BaseComponent />

...
```

## 代码示例

[ts版本](example/ts-taro-react/config/index.js)

[js版本](example/js-taro-react/config/index.js)
