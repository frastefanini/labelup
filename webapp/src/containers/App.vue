<template>
  <div class="app">
    <component :is="layout">
      <template v-if="error">
        <AuthError v-if="error.reason === 'auth'" />
        <LicenseError v-else-if="error.reason === 'license'" />
      </template>
      <transition v-else name="fade" mode="out-in" appear>
        <router-view />
      </transition>
    </component>
  </div>
</template>

<script>
import '@spartez/vue-atlaskit/dist/bundle.css'
import { mapGetters } from 'vuex'

import bus from '../utils/event'
import { getQueryParam } from '../utils/browser'
import * as Socket from '../utils/socket'

import AuthError from '../components/app/AuthError'
import LicenseError from '../components/app/LicenseError'

const defaultTarget = 'inlinedialog'

export default {
  name: 'App',
  components: {
    AuthError,
    LicenseError
  },
  data() {
    return {
      error: null,
      socket: null
    }
  },
  created() {
    window.addEventListener('unload', this.disconnect)
  },
  async mounted() {
    bus.$on('app:error', this.onError)

    await this.$store.dispatch('fetchContext')
    this.connect()
  },
  computed: {
    ...mapGetters([
      'contentId'
    ]),
    layout() {
      const target = getQueryParam('target')
      return (target || defaultTarget) + '-layout'
    }
  },
  methods: {
    async connect() {
      if (!this.socket) {
        this.socket = await Socket.create(this.contentId)

        this.socket.onConnect(() => {
          console.debug('Client connected')
          bus.$emit('socket:connected')
        })

        this.socket.onDisconnect(() => {
          console.debug('Client disconnected')
          bus.$emit('socket:disconnected')
        })

        this.socket.onEventReceived('hints:generated', () => {
          bus.$emit('status:updated')
        })

        this.socket.onEventReceived('hints:error', (event) => {
          const error = event.error

          if (error) {
            bus.$emit('status:error', error.message)
          }
        })

        this.socket.connect()
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    },

    onError(error) {
      this.error = error
    }
  }
}
</script>

<style lang="scss">
body {
  overflow: hidden;
  background: none;

  .app {
    Button[appearance="primary"] {
      font-weight: bold
    }
  }
}
</style>
