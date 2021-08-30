const payloadBuilder = require('../../utils/payloadBuilder')
const { getTransport } = require('../../utils/transport')
const { defaultParams } = require('../../defaults')
const { validateFields } = require('../../validation')
const isPositiveNumber = require('../../validation/isPositiveNumber')

const validation = {
  primaryCurrencyCode: ['isRequired'],
  pageIndex: ['isPositiveNumber'],
  pageSize: [isPositiveNumber(50)]
}

// https://www.independentreserve.com/products/api#GetDigitalCurrencyDepositAddresses
const getDigitalCurrencyDepositAddresses = (apiKey, apiSecret) => {
  const buildPayload = payloadBuilder(apiKey, apiSecret)

  return async ({
    primaryCurrencyCode,
    pageIndex = defaultParams.pageIndex,
    pageSize = defaultParams.pageSize
  }) => {
    const payload = { primaryCurrencyCode, pageIndex, pageSize }
    // eslint-disable-next-line fp/no-unused-expression
    validateFields(payload, validation)
    const path = 'Private/GetDigitalCurrencyDepositAddresses'
    const { post } = getTransport()
    return post(path, buildPayload(path, payload))
  }
}

module.exports = getDigitalCurrencyDepositAddresses
