import Vue from 'vue'

import router from './router'
import store from './store'
import i18n from './i18n'

import App from './containers/App'
import DialogLayout from './layouts/Dialog'
import InlineDialogLayout from './layouts/InlineDialog'
import errors from './mixins/errors'

import { isDevEnv } from './utils/env'

Vue.config.productionTip = isDevEnv()

// Global layouts
Vue.component('dialog-layout', DialogLayout)
Vue.component('inlinedialog-layout', InlineDialogLayout)

// Global mixins
Vue.mixin(errors)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
