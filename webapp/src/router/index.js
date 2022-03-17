import Vue from 'vue'
import VueRouter from 'vue-router'
import { flatten } from 'lodash'

import store from '../store'
import dashboard from './routes/dashboard'
import home from './routes/home'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: flatten([
    dashboard,
    home
  ])
})

router.beforeEach(async (to, from, next) => {
  await store.dispatch('fetchContext')
  next()
})

export default router
