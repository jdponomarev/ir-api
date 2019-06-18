const axios = require('axios')
const { transportOptions: defaults, defaultHeaders } = require('../defaults')
const transformResponse = require('./transformResponse')
const transformError = require('./transformError')

let transport

const makeTransport = ({ headers: heads, ...options }) => {
  const headers = heads
    ? {
        ...defaultHeaders,
        ...heads
      }
    : defaultHeaders

  transport = axios.create({
    ...defaults,
    ...options,
    headers
  })

  transport.interceptors.response.use(transformResponse, transformError)
  // any other config
}

const getTransport = (options = {}) => {
  if (!transport) makeTransport(options)
  const get = async path => transport.get(path)
  const post = async (path, data) => transport.post(path, data)

  return { get, post }
}

const close = () => {
  transport = undefined
}

module.exports = { getTransport, close }
