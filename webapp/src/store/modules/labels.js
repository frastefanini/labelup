import { chain } from 'lodash'

import http from '../../utils/http'
import * as types from '../mutation-types'

const MIN_RELEVANCE = 0.70000
const MAX_HINTS = 5

const state = {
  hints: [],
  labels: []
}

const mutations = {
  [types.SET_HINTS] (state, hints) {
    state.hints = hints
  },

  [types.SET_LABELS] (state, labels) {
    state.labels = labels
  }
}

const actions = {
  async fetchLabelsAndHints({ commit, getters }) {
    const res = await http.get(`/content/${getters.contentId}/label`)

    if (res) {
      commit(types.SET_HINTS, res.data.hints)
      commit(types.SET_LABELS, res.data.labels)
    }
  },

  async addLabels({ getters }, labels) {
    labels = labels || getters.hints.top

    if (labels) {
      const data = {
        labels: labels.map(label => ({
          text: label.text
        }))
      }

      await http.put(`/content/${getters.contentId}/label`, data)
    }
  }
}

const getters = {
  hints: (state, getters) => {
    const labels = getters.labels

    const hints = chain(state.hints)
      .map(hint => {
        hint.text = hint.text.toLowerCase()
        return hint
      })
      .orderBy(['relevance', 'text'], ['desc', 'asc'])
      .value()

    const top = chain(hints)
      .filter(hint => hint.relevance > MIN_RELEVANCE)
      .slice(0, MAX_HINTS)
      .differenceWith(labels, (hint, label) => hint.text === label.text)
      .value()

    const others = chain(hints)
      .differenceWith(top, (hint, topHint) => hint.text === topHint.text)
      .differenceWith(labels, (hint, label) => hint.text === label.text)
      .value()

    return {
      top,
      others
    }
  },

  labels: state => {
    return state.labels
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
