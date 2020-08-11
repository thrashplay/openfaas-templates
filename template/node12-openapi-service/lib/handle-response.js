module.exports = function (context, _req, res) {
  if (res.headersSent) {
    return
  }

  // TODO: validate allowed status code
  // TODO: validate headers

  const { errors, valid } = context.api.validateResponse(context.response, context.operation, res.statusCode);
  if (!valid) {
    const { method, path } = context.operation
    console.error(`Operation returned invalid response. [path=${path}, method=${method}]`)
    console.error(`Invalid response content: ${JSON.stringify(context.response, null, 2)}`)
    console.error(`Validation errors: ${JSON.stringify(errors, null, 2)}`)

    return res.status(500).json({ 
      code: '0',
      status: 500,
    })
  }

  return res.status(200).json(context.response);
}