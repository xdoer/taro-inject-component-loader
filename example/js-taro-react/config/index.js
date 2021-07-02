const path = require('path')

const config = {
  projectName: 'js-taro-react',
  date: '2021-2-16',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  alias: {
    '@components': path.resolve(__dirname, '..', 'src/components'),
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            injectBaseComponentLoader: {
              test: /\.jsx$/,
              use: [
                {
                  loader: path.resolve(__dirname, '../../../dist/index.js'),
                  options: {
                    importPath: '@components/BaseComponent',
                  },
                },
              ],
            },
          },
        },
      })
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            injectBaseComponentLoader: {
              test: /\.jsx$/,
              use: [
                {
                  loader: path.resolve(__dirname, '../../../dist/index.js'),
                  options: {
                    importSpecifier: '@components/BaseComponent',
                    componentName: 'BaseComponent',
                    isPage(filePath) {
                      return /(package-.+\/)?pages\/.+\/index\.jsx$/.test(filePath)
                    },
                  },
                },
              ],
            },
          },
        },
      })
    },
  },
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
