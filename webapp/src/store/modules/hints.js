import http from '../../utils/http'

const actions = {
  requestHints({ getters }) {
    return http.post(`/content/${getters.contentId}/hint`)
  }
}

export default {
  actions
}
