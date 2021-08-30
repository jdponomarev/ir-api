const payloadBuilder = require('../../utils/payloadBuilder')
const { getTransport } = require('../../utils/transport')

// https://www.independentreserve.com/products/api#GetFiatBankAccounts
const getFiatBankAccounts = (apiKey, apiSecret) => {
  const buildPayload = payloadBuilder(apiKey, apiSecret)

  return async () => {
    const path = 'Private/GetFiatBankAccounts'
    const { post } = getTransport()
    return post(path, buildPayload(path))
  }
}

module.exports = getFiatBankAccounts
