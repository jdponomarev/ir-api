const payloadBuilder = require('../../utils/payloadBuilder')
const { getTransport } = require('../../utils/transport')
const { validateFields } = require('../../validation')

const validation = {
    // orderGuids: ['isRequired', 'isGuid']
}

// https://www.independentreserve.com/products/api#CancelOrders
const cancelOrders = (apiKey, apiSecret) => {
  const buildPayload = payloadBuilder(apiKey, apiSecret)

  return async ({ orderGuids }) => {
    const payload = { orderGuids }
    // eslint-disable-next-line fp/no-unused-expression
    validateFields(payload, validation)
    const path = 'Private/CancelOrders'
    const { post } = getTransport()
    return post(path, buildPayload(path, payload))
  }
}

module.exports = cancelOrders
