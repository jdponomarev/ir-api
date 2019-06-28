# ir-api

A NodeJS client for Independent Reserve's API.

## Features

- Complete support for all of Independent Reserve's public and private API methods.
- Method parameter validation
- automatically delays then retries idempotent methods on request timeout (up to 3 times)
- Small package size (62K) with no external dependencies. ([`axios`](https://github.com/axios/axios) is a peer-dependency however.)
- 100% test coverage

[![NPM](https://nodei.co/npm/ir-api.png)](https://nodei.co/npm/ir-api/)

## Usage

Please familiarise yourself with [Independent Reserve's API Documentation](https://www.independentreserve.com/api)

### Create an account

You will need an account at [Independent Reserve](https://www.independentreserve.com/invite/AJNEHL) and you will need to generate an API Key and API Secret.

#### Please use my referral code if you create an account.

- [`www.independentreserve.com/invite/AJNEHL`](https://www.independentreserve.com/invite/AJNEHL)

### Install

#### NodeJS

```sh
npm install axios ir-api
```

#### React Native

**See below for instructions on using with React Native**

## The API

The API calls follow [the official documentation](https://www.independentreserve.com/api) but start with a lower case letter instead of upper case.

Similarly all returned data will have keys that start with lower case instead of upper case.

### Public Methods

```js
const ir = require('ir-api')

const { getValidPrimaryCurrencyCodes } = ir()

getValidPrimaryCurrencyCodes()
  .then(codes => {
    console.log('codes', codes)
  })
  .catch(error => {
    console.error(error)
  })
```

### Private Methods

```js
const ir = require('ir-api')

const { getOpenOrders } = ir('my-api-key', 'my-api-secret')

getOpenOrders()
  .then(data => {
    console.log('data', data)
  })
  .catch(error => {
    console.error(error)
  })
```

### Passing parameters to methods

Parameters are passed as an object, so for example

```js
getOpenOrders({
  primaryCurrencyCode: 'Xbt',
  secondaryCurrencyCode: 'Usd'
})
  .then(data => {
    console.log('data', data)
  })
  .catch(error => {
    console.error(error)
  })
```

### Configuring `axios`

Under the hood the `ir-api` uses [`axios`](https://github.com/axios/axios) as its transport layer with the following defaults:

```js
{
  baseURL: 'https://api.independentreserve.com',
  timeout: 2500
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Independent Reserve Javascript API (github.com/davesag/ir-api)'
  }
}
```

You can change this by passing your own configuration object into the `ir` function.

```js
const ir = require('ir-api')

const { getAccounts } = ir('my-api-key', 'my-api-secret', {
  timeout: 500,
  headers: { 'User-Agent': 'My amazing app' }
})
```

You can supply any [configuration options that `axios` supports](https://github.com/axios/axios#axioscreateconfig), however if you change the `baseURL`, or `Content-Type` you will find the API calls stop working, so I don't advise doing that.

If your app needs to run integration tests against a mock IR server (maybe you built one for this purpose) then this is where you'd override the `baseURL`.

Independent Reserve's public API server can be quite slow which is why the `timeout` is set to `2500` by default. It's much faster if you use an `apiKey` and `apiSecret` however.

### Default parameters

- `nonce`: computed for you
- `pageIndex`: `1`
- `pageSize`: `25`
- `signature`: computed for you

### using `async` / `await`

All methods return a resolved promise so you can safely use `async` / `await`

### Example

See [this gist](https://gist.github.com/davesag/3567876481344419827e514bae78a02b) for an example of using the API to retrieve your IR balance, then get the market rates for each of your coins, convert to Australian Dollars and display a simple ASCII table with the results and a total.

### Error Handling

- API request errors (in the case where the API server does not respond, such as a timeout error) are returned as a `RequestError`. You can look in `error.details` for more information about the specific error.
- API response errors (when the API responds with an error code) are returned as a `ResponseError`. You can look in `error.status` for the status code and `error.details` for more information.
- any other errors are simply thrown as normal javascript errors.
- The API defines certain method parameters as required, as numbers, etc. If the values you pass in fail validation a `ValidationError` will be thrown. You can inspect `error.errors` for a map of the fields that failed validation and which validation they failed. The validations are by no means exhaustive but serve to save developers a request to the Independent Reserve servers if something is blatantly wrong.

#### Handling timeouts

The Independent Reserve API occasionally times out. The client will automatically attempt up to 3 retries of any timed-out idempotent request, with a delay of 250ms on first retry, 500ms on second, and 750ms on third. It will also extend the default timeout on each retried request.

If you still keep seeing timeout errors then you can set a longer base request `timeout` duration as outlined in the configuration example above. The default `timeout` is 2500ms.

#### Validating Cryptocurrency Addresses

This API client does not know in advance which cryptocurrencies are supported by Independent Reserve, and as such it's not possible to compile a complete set of cryptocurrency address format validators.

Developers using this library are encouraged to use the many 3rd party cryptocurrency address validators that already exist, depending on their specific use cases.

## Use with React Native

You can use `ir-api` with React Native but you need to do some prep-work first.

### Install shims

You will use [`rn-nodeify`]((https://github.com/tradle/rn-nodeify).

Please do go read the docs at [`tradle/rn-nodeify`](https://github.com/tradle/rn-nodeify) first so you get the general idea.

#### with `npm`

```sh
npm i axios ir-api react-native-randombytes react-native-crypto
npm i -D rn-nodeify
react-native link react-native-randombytes
./node_modules/.bin/rn-nodeify --hack --install
```

#### with `yarn`

```sh
yarn add axios ir-api react-native-randombytes react-native-crypto
yarn add -D rn-nodeify
react-native link react-native-randombytes
./node_modules/.bin/rn-nodeify --yarn --hack --install
```

### Then edit `shim.js`

open up `shim.js` which was created with the above steps and uncomment the last line.

```js
require('crypto')
```

### Then add it to your project

As early in the project as you can, such as in `<projectRoot>/index.js`, add `import './shim'`

## Development

[![Greenkeeper badge](https://badges.greenkeeper.io/davesag/ir-api.svg)](https://greenkeeper.io/)

<!-- prettier-ignore -->
| branch | status | coverage | notes |
| ------ | ------ | -------- | ----- |
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/ir-api/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/ir-api/tree/develop) | [![codecov](https://codecov.io/gh/davesag/ir-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/ir-api) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/ir-api/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/ir-api/tree/master) | [![codecov](https://codecov.io/gh/davesag/ir-api/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/ir-api) | Latest stable release |

### Prerequisites

- [NodeJS](htps://nodejs.org), version 8.10.0 or better (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)

### Initialisation

```sh
npm install
```

### Test it

- `npm test` — runs the unit tests
- `npm run test:unit:cov` — runs the unit tests with code coverage
- `npm run test:mutants` — runs the mutation tests

### Lint it

```sh
npm run lint
```

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).

### Other ways to contribute

- Join Independent Reserve using my referral code [`www.independentreserve.com/invite/AJNEHL`](https://www.independentreserve.com/invite/AJNEHL)
- Send me Ether. `0xbd64860033c15c0af5df5a886b997f63a7723d5a`
- Send me Bitcoin. `1HiqYdJZGmGDaj1ryKjEjaB2RRZuZebZxZ`
