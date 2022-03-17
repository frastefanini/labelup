import axios from 'axios'

import bus from '../utils/event'
import { getToken } from './auth'

class Http {
  constructor() {
    axios.defaults.baseURL = '/api'

    axios.interceptors.request.use(async (config) => {
      const token = await getToken()

      if (token) {
        config.headers['Authorization'] = `JWT ${token}`
      }

      return config
    })

    axios.interceptors.response.use(response => {
      return response
    }, error => {
      if (error && error.response) {
        const status = error.response.status
        let reason

        switch (status) {
          case 401:
            reason = 'auth'
          break;

          case 403:
            reason = 'license'
          break;
        }

        if (reason) {
          bus.$emit('app:error', { reason })
          return Promise.resolve(error)
        }
      }

      return Promise.reject(error)
    })
  }

  request(method, url, data, params) {
    return axios.request({
      url,
      data,
      params: params,
      method
    })
  }

  get(url, params) {
    return this.request('get', url, null, params)
  }

  post(url, data, params) {
    return this.request('post', url, data, params)
  }

  put(url, data, params) {
    return this.request('put', url, data, params)
  }
}

export default new Http()
