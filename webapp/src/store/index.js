import Vue from 'vue'
import Vuex from 'vuex'

import confluence from './modules/confluence'
import hints from './modules/hints'
import labels from './modules/labels'
import status from './modules/status'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    confluence,
    hints,
    labels,
    status
  }
})
