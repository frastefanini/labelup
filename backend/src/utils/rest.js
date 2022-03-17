import { isString } from 'lodash'

import addon from '../addon'
import logger from './log'

const BASE_URL = '/rest/api'

class RestClient {
  constructor(httpClient) {
    this.httpClient = httpClient
  }

  request(method, url, data, params) {
    const uri = `${BASE_URL}${url}`

    const options = {
      uri,
      json: data,
      qs: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return new Promise((resolve, reject) => {
      this.httpClient[method](options, (err, res, body) => {
        if (!err) {
          const is2xx = /^2/.test('' + res.statusCode)
          let payload = body
          if (isString(body)) {
            try {
              payload = JSON.parse(body)
            } catch (err) {
              logger.debug('Received a non-JSON response. Unable to parse.')
            }
          }
          if (is2xx) {
            resolve(payload)
          } else {
            reject(payload)
          }
        } else {
          reject(err)
        }
      })
    })
  }

  get(url, params = {}) {
    return this.request('get', url, null, params)
  }

  put(url, data, params = {}) {
    return this.request('put', url, data, params)
  }

  post(url, data, params = {}) {
    return this.request('post', url, data, params)
  }

  delete(url, params = {}) {
    return this.request('del', url, null, params)
  }

}

const fromHttpClient = (httpClient) => {
  return new RestClient(httpClient)
}

const fromClientKey = (clientKey) => {
  const httpClient = addon.httpClient({ clientKey })
  return new RestClient(httpClient)
}

const fromRequest = (req) => {
  const httpClient = addon.httpClient(req)
  return new RestClient(httpClient)
}

export default {
  fromHttpClient,
  fromClientKey,
  fromRequest
}
