const doTest = require('../../../helpers/privateHandlerTest')

const config = {
  handler: 'getOpenOrders',
  params: { primaryCurrencyCode: 'Eth', secondaryCurrencyCode: 'Aud' },
  useDefaults: true,
  validation: {
    primaryCurrencyCode: ['isRequired'],
    secondaryCurrencyCode: ['isRequired'],
    pageIndex: ['isPositiveNumber'],
    pageSize: ['isPositiveNumber']
  }
}

doTest(config)
