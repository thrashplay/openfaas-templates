module.exports = function (context, _req, res) {
  const body = {
    code: '0',
    details: context.validation.errors,
    status: 400,
  }

  const { errors, valid } = context.api.validateResponse(body, context.operation, 400)
  if (!valid) {
    const { method, path } = context.operation
    console.error(`Operation API does not support validation failure response. [path=${path}, method=${method}]`)
    console.error(`Invalid response content: ${JSON.stringify(body, null, 2)}`)
    console.error(`Validation errors: ${JSON.stringify(errors, null, 2)}`)
    return res.status(500).json({ 
      code: '0',
      status: 500,
    })
  }

  return res.status(400).json({
    code: '0',
    details: context.validation.errors,
    status: 400,
  })
}