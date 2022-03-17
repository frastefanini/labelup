import http from '../../utils/http'
import * as types from '../mutation-types'

const state = {
  status: {}
}

const mutations = {
  [types.SET_STATUS] (state, status) {
    state.status = status
  }
}

const actions = {
  async fetchStatus({ commit, getters }) {
    const res = await http.get(`/content/${getters.contentId}/status`)

    if (res) {
      commit(types.SET_STATUS, res.data)
    }
  }
}

const getters = {
  currentStatus: state => {
    return state.status
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
