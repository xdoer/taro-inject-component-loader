import generate from '@babel/generator'
import traverse from '@babel/traverse'
import utils from '@babel/types'
import { parse } from '@babel/parser'
import { getOptions } from 'loader-utils'
import { validate } from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    'IMPORT_SPECIFIER': {
      type: 'string'
    },
    'COMPONENT_NAME': {
      type: 'string'
    }
  },
  additionalProperties: false
}

export default function (source: string, map: any) {
  // @ts-ignore
  const webpackEnv = this

  const options = getOptions(webpackEnv)

  validate(schema as any, options, { name: 'taro-inject-component-loader' })

  const { IMPORT_SPECIFIER = '', COMPONENT_NAME = '' } = options || {}

  // get current file path
  const { sources = [] } = map || {}
  const [filePath] = sources

  // is page
  const isPage = /(package-.+\/)?pages\/.+\/index\.tsx$/.test(filePath)

  if (isPage) {

    // generate ast
    const ast: any = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties'],
    })

    // page has insert component
    let insert = false

    traverse(ast, {
      ImportDeclaration(path: any) {
        if (path.node?.source?.value === IMPORT_SPECIFIER) {
          insert = true
        }
      }
    })

    if (!insert) {
      let importedDeclaration = false
      let importedComponent = false

      traverse(ast, {
        // add import declaration
        ImportDeclaration(path: any) {
          if (!importedDeclaration) {
            importedDeclaration = true
            path.insertBefore(
              utils.importDeclaration(
                [utils.importSpecifier(utils.identifier('' + COMPONENT_NAME), utils.identifier('' + COMPONENT_NAME))],
                utils.stringLiteral('' + IMPORT_SPECIFIER)
              )
            )
          }
        },

        // class component
        FunctionExpression(path: any) {
          if (path.node?.id?.name === 'render') {
            path.node?.body?.body[0]?.argument?.arguments?.push(createElement('' + COMPONENT_NAME))
          }
        },

        // function component
        ExportDefaultDeclaration(path: any) {
          const exportType = path.node?.declaration?.type

          const isFnExport = exportType === "FunctionDeclaration"
          if (isFnExport) {
            const mainFnBody = path.node?.declaration?.body?.body
            const length = mainFnBody.length
            const last = mainFnBody[length - 1]
            if (last.type === 'ReturnStatement') {
              if (last.argument?.callee?.property?.name === 'createElement' && !importedComponent) {
                const reactCreateArguments = last.argument.arguments
                importedComponent = true
                reactCreateArguments.push(createElement('' + COMPONENT_NAME))
              }
            }
          }
        },
      })
      source = generate(ast).code
    }
  }

  return source
}

function createElement(name: string) {
  const reactIdentifier = utils.identifier("React")
  const createElementIdentifier = utils.identifier("createElement")
  const callee = utils.memberExpression(reactIdentifier, createElementIdentifier)
  return utils.callExpression(callee, [utils.identifier(name)])
}
