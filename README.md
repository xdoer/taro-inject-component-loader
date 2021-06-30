# Taro React 小程序注入全局组件

## 缘由

众所周知，小程序中不能定义全局组件，如果我们想自定义一个 modal 弹窗，来替代 **wx.showModal** 的话，则需要在每个页面手动的引入组件。随着项目越来越大，手动引入组件无疑是繁琐和低效的，因而抽空开发了这个 webpack-loader 代替手动操作。

## 作用

为每个页面注入全局组件。支持主包和分包，支持类写法和函数写法。

## 语法支持

下面提到的写法中，都支持注入组件。

```tsx
// 导出匿名函数
export default function() {}

// 导出具名函数
export default function A() {}

// 导出匿名箭头函数
export default () => {}

// 导出匿名类
export default class {}

// 导出具名类
export default class A {}
```

此外，还可以使用标识符导出

```tsx
// 导出普通函数
function A() {}

const A = function() {}

// 导出箭头函数
const A = () => {}

// 导出类
class A {}

const A = class {}

const A = class extends Component {}

export default A
```

> - 箭头函数必须写括号和 return 返回。即只支持 `const A = () => { return <View></View> }` 这种形式，不支持 `const A = () => <View></View>`
> - 页面必须有默认导出

## 环境

`taro react`

## 安装

`npm install taro-inject-component-loader -D` 。

## 配置

### 配置项

> - importSpecifier 导入标识符
> - componentName 导入的组件名称
> - isPage 判断当前遍历到的文件是否为页面（可选配置）

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

                  // 需要根据文件路径、判断遍历到的文件是否为页面
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

## 效果

### 源代码

```tsx
import { View } from '@taro/components'

export default function Index() {
  return <View>哈哈哈哈哈</View>
}
```

### 注入后的代码

```tsx
import { View } from '@taro/components'
import { BaseComponent } from '@components/BaseComponent'

export default function Index() {
  return (
    <View>
      哈哈哈哈哈
      <BaseComponent />
    </View>
  )
}
```

> - 会自动注入为页面根节点的最后一个子元素。
> - 当识别到文件手动导入了组件、则会跳过代码注入。即: 上面示例中，如果手动导入了 BaseComponent 组件，无论有没有用到这个组件，代码都不会注入。

## 代码示例

[ts 版本](example/ts-taro-react/config/index.js)

[js 版本](example/js-taro-react/config/index.js)
