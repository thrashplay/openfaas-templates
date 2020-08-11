// Copyright (c) Alex Ellis 2017. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict"

const path = require('path')
const express = require('express')
const { default: OpenAPIBackend } = require('openapi-backend')

// utilities
const { getOpenApiPath, getOperationsPath } = require('./config')
const handleValidationFail = require('./handle-validation-fail')
const handleResponse = require('./handle-response')

async function init() {
  const operations = require(`./function/${getOperationsPath()}`)
  const openApiDocument = path.resolve('function', getOpenApiPath())

  const api = new OpenAPIBackend({ definition: openApiDocument })

  api.register({
    postResponseHandler: handleResponse,
    validationFail: handleValidationFail,
    ...operations,
  })
  api.init()

  const port = process.env.http_port || 3000

  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())
  app.use((req, res) => api.handleRequest(req, req, res))

  app.listen(port, () => {
    console.log(`node12-openapi-service, listening on port: ${port}`)
  })
}

init()