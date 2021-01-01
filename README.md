# Taro React 小程序注入全局组件

## 缘由

众所周知，小程序中不能定义全局组件，如果我们想自定义一个 modal 弹窗，来替代 **wx.showModal** 的话，则需要在每个页面手动的引入组件。随着项目越来越大，手动引入组件无疑是繁琐和低效的，因而抽空开发了这个 webpack-loader 代替手动操作。

## 作用

为每个页面注入全局组件。支持主包和分包，支持类写法和函数写法。

## 环境

`taro react typescript`

## 使用

~~将本仓库拉到本地，安装后运行 **npm build** 命令，然后将 **dist** 文件夹拷贝到你的项目里，在 **config/index.js** 配一下就好了。~~

直接 `npm install taro-inject-component-loader -D` 即可。

配置示例:

```ts
  webpackChain(chain) {
    chain.merge({
      module: {
        rule: {
          injectBaseComponentLoader: {
            test: /\.tsx$/,
            use: [
              {
                // loader: path.resolve(__dirname, '../../../dist'), // loader 路径
                loader: 'taro-inject-component-loader',
                options: {
                  IMPORT_SPECIFIER: '@components/BaseComponent',  // 导入标识符
                  COMPONENT_NAME: 'BaseComponent',  // 导入组件名
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

## 经验分享

Taro 中内置了 babel-loader 处理文件，使用自定义 loader 只能通过 webpack-clain 配置，但 webpack-clain 似乎没办法改变 loader 执行顺序，所以我们的 loader 拿到的 source 数据实际是经过 babel-loader 加工过的数据，这位开发调试带来的巨大的困难。

我是这样做的

> - 在 loader 中用将 node fs api, 将 source 写入文件
> - 打开 source 文件，拷贝代码
> - 粘贴到 [astexplorer](https://astexplorer.net/) 即可查看到 AST 代码结构
> - 根据代码结构就可以很顺畅的编写代码了
