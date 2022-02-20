# Taro React 小程序注入全局组件

## 缘由

众所周知，小程序中不能定义全局组件，如果我们想自定义一个 modal 弹窗，来替代 **wx.showModal** 的话，则需要在每个页面手动的引入组件。随着项目越来越大，手动引入组件无疑是繁琐和低效的，因而开发了这个 webpack-loader 代替手动操作。

## 作用

为每个页面注入全局组件。支持主包和分包，支持类写法和函数写法。

## 环境

`taro react`

## 安装

`npm install taro-inject-component-loader -D` 。

## 配置

### Webpack 配置

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
                logError: true,
                options: {
                  importPath: '@components/BaseComponent',
                  isPage(filePath) {
                    // 兼容 windows
                    const formatFilePath = filePath.replace(/\\/g, '/')
                    return /(package-.+\/)?pages\/[A-Za-z0-9-]+\/index\.[tj]sx\$/.test(filePath)
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

### 配置项

| 字段       | 必填 | 默认                                                                        | 含义                   |
| ---------- | ---- | --------------------------------------------------------------------------- | ---------------------- |
| importPath | 是   | 无                                                                          | 导入路径               |
| logError   | 否   | true                                                                        | 控制台打印错误         |
| isPage     | 否   | (path) => /(package-.+\/)?pages\/[A-Za-z0-9-]+\/index\.[tj]sx\$/.test(path) | 判断当前文件是不是页面 |

isPage 不传的情况下，默认会将 `src/pages/页面名称/index.[tj]sx` 和 `src/package-模块名称/pages/页面名称/index.[tj]sx` 这两种情形下的文件识别为页面。

## 效果

### 源代码

页面组件

```tsx
<!----src/pages/index.tsx----->
import { View } from '@taro/components'

export default function Index() {
  return <View>哈哈哈哈哈</View>
}
```

要注入的组件

```tsx
<!----src/components/BaseComponent.tsx----->
import { View } from '@taro/components'

export default function () {
  return <View>WebpackInject</View>
}
```

### 注入后的代码

会自动注入为页面根节点的最后一个子元素

```tsx
<!----src/pages/index.tsx----->
import { View } from '@taro/components'
import WebpackInject from '@components/BaseComponent'

export default function Index() {
  return (
    <View>
      哈哈哈哈哈
      <WebpackInject />
    </View>
  )
}
```

## 语法支持

下面提到的写法中，都支持注入组件。对于识别为页面，但由于语法不支持，导致注入失败的页面，loader 会在控制台抛出警告，请注意查看。

```tsx
// 导出匿名函数
export default function() {
  return <View></View>
}

// 导出具名函数
export default function A() {
  return <View></View>
}

// 导出匿名箭头函数
export default () => {
  return <View></View>
}

export default () => <View></View>

// 导出匿名类
export default class {
  render() {
    return <View></View>
  }
}

// 导出具名类
export default class A {
  render() {
    return <View></View>
  }
}
```

此外，还可以使用表达式导出

```tsx
// 导出普通函数
function A() {
  return <View></View>
}

const A = function() {
  return <View></View>
}

// 导出箭头函数
const A = () => {
  return <View></View>
}
const A = () => <View></View>

// 导出类
class A {
  render() {
    return <View></View>
  }
}

const A = class {
  render() {
    return <View></View>
  }
}

const A = class extends Component {
  render() {
    return <View></View>
  }
}

export default A
```

## 注意事项

### 要注入的组件需要默认导出

```tsx
import { View } from '@taro/components'

// 默认导出
export default () => <View></View>
```

### 跳过代码注入

只要检测到页面里有 importPath 的路径，无论代码中有没有用到该组件，都不会自动注入。

```tsx
import { View } from '@taro/components'
// 因为检测到了手动从 importPath 路径导入组件， 所以不会注入组件
import WebpackInject from 'importPath'

export default () => <View></View>
```

### 高阶组件代码注入

loader 不支持高阶组件的代码注入

```tsx
const connect = () => {
  return CComponent => CComponent
}

const CustomComponent = () => {
  return <View>export default connect arrow function Component</View>
}

export default memo(connect()(CustomComponent))
```

建议手动引入要注入的组件，或者更改代码写法:

```tsx
const connect = () => {
  return CComponent => CComponent
}

const CustomComponent = () => {
  return <View>export default connect arrow function Component</View>
}

const HigherComponent = memo(connect()(CustomComponent))

export default props => {
  return (
    <Block>
      <HigherComponent {...props} />
    </Block>
  )
}
```

### 自闭合标签

自闭合标签组件不支持组件注入。

```tsx
export default () => <Button />
```

建议手动引入组件，或者将代码改为：

```tsx
export default () => (
  <Block>
    <Button />
  </Block>
)
```

### 空标签

空标签不支持组件注入。在编译的过程中，空标签会被剥去，导致找不到注入口。

```tsx
export default () => (
  return (
    <>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      <Button>点击</Button>
    </>
  )
)
```

建议手动引入组件，或者将代码改为：

```tsx
export default () => (
  return (
    <Block>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      <Button>点击</Button>
    </Block>
  )
)
```

## 代码示例

[ts 版本](example/ts-taro-react/config/index.js)

[js 版本](example/js-taro-react/config/index.js)
