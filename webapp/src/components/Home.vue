<template>
  <div class="home">
    <Loading v-if="loading" />
    <template v-else>
      <template v-if="error">
        <ContentMismatch v-if="error.category === 'contentMismatch'" />
        <GenericError v-else :message="error.message" @refresh="refresh" />
      </template>
      <Pending v-else @refresh="refresh" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Loading from './common/Loading'

import GenericError from './status/GenericError'
import Pending from './status/Pending'
import ContentMismatch from './status/ContentMismatch'

import bus from '../utils/event'

export default {
  name: 'Home',
  components: {
    Loading,
    GenericError,
    Pending,
    ContentMismatch
  },
  props: {
    isPreview: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.refresh()

    bus.$on('status:updated', this.refresh)
    bus.$on('status:error', this.setGenericError)
  },
  computed: {
    ...mapGetters([
      'currentStatus'
    ])
  },
  watch: {
    currentStatus: {
      handler: async function(status) {
        this.error = null

        if (status && status.code) {
          const code = status.code.toUpperCase()

          if (code.startsWith('SN')) {
            if (code === 'SN10') {
              this.error = {
                category: 'contentMismatch',
                message: null
              }
            } else {
              await this.requestHints()
            }
          } else {
            if (code === 'SP01') {
              this.goToDashboard()
              return
            }
          }
        }

        this.loading = false
      }
    }
  },
  methods: {
    async refresh() {
      this.loading = true

      try {
        await this.$store.dispatch('fetchStatus')
      } catch (err) {
        this.handleServerError('fetchStatus')
      }
    },

    async requestHints() {
      try {
        await this.$store.dispatch('requestHints')
      } catch (err) {
        this.handleServerError('requestHints')
      }
    },

    goToDashboard() {
      let location = '/dashboard'

      if (this.isPreview) {
        location += '/preview'
      }

      this.$router.push(location)
    },

    setGenericError(message) {
      this.error = {
        category: 'generic',
        message
      }
    }
  }
}
</script>
