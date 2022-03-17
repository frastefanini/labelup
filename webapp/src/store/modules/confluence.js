/*global AP*/
/// <reference path="../../../lib/AP.d.ts" />

import i18n from '../../i18n'
import bus from '../../utils/event'
import * as types from '../mutation-types'

const state = {
  content: {}
}

const mutations = {
  [types.SET_CONTENT] (state, content) {
    state.content = content
  }
}

const actions = {
  async fetchContext({ commit }) {
    if (AP) {
      const context = await AP.context.getContext()

      if (context) {
        commit(types.SET_CONTENT, context.confluence.content)
      }
    }
  },

  goToContentView({ getters }, version) {
    if (AP) {
      let target = {
        contentId: getters.contentId
      }

      if (version) {
        target.versionOverride = version
      }

      AP.navigator.go('contentview', target)
    }
  },

  openDialog(_, key) {
    if (AP) {
      const dialog = AP.dialog.create({ key })

      dialog.on('close', (data) => {
        if (data.updated) {
          bus.$emit('labels:updated')
        }
      })
    }
  },

  closeDialog(_, data) {
    if (AP) {
      AP.dialog.close(data)
    }
  },

  hideInlineDialog() {
    if (AP) {
      AP.inlineDialog.hide()
    }
  },

  resizeInlineDialog() {
    if (AP) {
      AP.resize('100%', '100%')
    }
  },

  createErrorFlag(_, body) {
    if (AP) {
      AP.flag.create({
        title: i18n.t('app.name'),
        body,
        type: 'error',
        close: 'auto'
      })
    }
  }
}

const getters = {
  contentId: state => {
    return state.content.id ?? 0
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
