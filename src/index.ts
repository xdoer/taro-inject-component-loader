import generate from '@babel/generator'
import traverse from '@babel/traverse'
import utils from '@babel/types'
import { parse } from '@babel/parser'
import { getOptions } from 'loader-utils'
import { validate } from 'schema-utils'

const schema = {
  type: 'object',
  properties: {
    importSpecifier: {
      type: 'string',
    },
    componentName: {
      type: 'string',
    },
    isPage: {
      instanceof: 'Function',
    },
  },
  additionalProperties: false,
}

export default function(source: string) {
  // @ts-ignore
  const webpackEnv = this

  const options = getOptions(webpackEnv)

  validate(schema as any, options, { name: 'taro-inject-component-loader' })

  const { importSpecifier = '', componentName = '', isPage = defaultJudgePage } = options || {}

  // 获取原始文件地址
  const filePath = webpackEnv.resourcePath

  if (typeof isPage === 'function' && isPage(filePath)) {
    // 生成 AST
    const ast: any = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties'],
    })

    /**
     * 如果有导入申明，则默认表示已手动导入了组件
     */
    let insert = false

    traverse(ast, {
      ImportDeclaration(path: any) {
        if (path.node?.source?.value === importSpecifier) {
          insert = true
        }
      },
    })

    if (!insert) {
      // 记录组件插入状态
      const state = {
        importedDeclaration: false,
        importedComponent: false,
      }

      traverse(ast, {
        // 添加申明
        ImportDeclaration(path: any) {
          if (!state.importedDeclaration) {
            state.importedDeclaration = true
            path.insertBefore(
              utils.importDeclaration(
                [
                  utils.importSpecifier(
                    utils.identifier('' + componentName),
                    utils.identifier('' + componentName),
                  ),
                ],
                utils.stringLiteral('' + importSpecifier),
              ),
            )
          }
        },

        // 类组件
        ClassMethod(path: any) {
          if (path.node.key.name === 'render') {
            const body = path.node?.body?.body || []
            const last = body[body?.length - 1]
            insertComponent(last, '' + componentName, state)
          }
        },

        // 函数式组件
        ExportDefaultDeclaration(path: any) {
          const exportType = path.node?.declaration?.type
          if (exportType === 'FunctionDeclaration') {
            const mainFnBody = path.node?.declaration?.body?.body
            const length = mainFnBody.length
            const last = mainFnBody[length - 1]
            insertComponent(last, '' + componentName, state)
          }
        },
      })
      source = generate(ast).code
    }
  }

  return source
}

function createElement(name: string) {
  const reactIdentifier = utils.identifier('React')
  const createElementIdentifier = utils.identifier('createElement')
  const callee = utils.memberExpression(reactIdentifier, createElementIdentifier)
  return utils.callExpression(callee, [utils.identifier(name)])
}

function createJSX(name: string) {
  return utils.jSXElement(
    utils.jSXOpeningElement(utils.jsxIdentifier('' + name), [], true),
    null,
    [],
    true,
  )
}

function insertComponent(node: any, componentName: string, state: any) {
  if (node?.type === 'ReturnStatement') {
    // createElement
    if (node.argument?.callee?.property?.name === 'createElement' && !state.importedComponent) {
      state.importedComponent = true
      const reactCreateArguments = node.argument.arguments
      reactCreateArguments.push(createElement(componentName))
    }
    // JSX
    if (node.argument?.type === 'JSXElement' && !state.importedComponent) {
      state.importedComponent = true
      node.argument.children.push(createJSX(componentName))
    }
  }
}

function defaultJudgePage(filePath: string) {
  return /(package-.+\/)?pages\/.+\/index\.[tj]sx$/.test(filePath)
}
