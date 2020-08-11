const fs = require('fs')

const path = require('path')

module.exports = {
  /** gets the module path to load operations from */
  getOperationsPath: () => {
    if (process.env.OPERATIONS_PATH) {
      console.log(`Using operations path: ${process.env.OPERATIONS_PATH} [from OPERATIONS_PATH build_arg]`)
      return process.env.OPERATIONS_PATH
    }

    const functionPackageJson = JSON.parse(fs.readFileSync(path.resolve('function', 'package.json'), 'utf8'))
    const mainFile = functionPackageJson.main
    if (mainFile) {
      console.log(`Using operations path: ${mainFile} [from package.json "main"]`)
      return mainFile
    }

    console.log(`Using operations path: index.js [from default value]`)
    return 'index.js'
  },

  /** gets the path to the OpenAPI document */
  getOpenApiPath: () => {
    if (process.env.OPENAPI_PATH) {
      console.log(`Using OpenAPI path: ${process.env.OPENAPI_PATH} [from OPENAPI_PATH build_arg]`)
      return process.env.OPENAPI_PATH
    }

    console.log(`Using OpenAPI path: openapi.yaml [from default value]`)
    return 'openapi.yaml'
  }
}