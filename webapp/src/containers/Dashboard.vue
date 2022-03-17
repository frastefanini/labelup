<template>
  <div class="dashboard">
    <Loading v-if="loading" />
    <transition v-else name="fade" mode="out-in" appear>
      <router-view @refresh="onRefresh" />
    </transition>
  </div>
</template>

<script>
import bus from '../utils/event'

import Loading from '../components/common/Loading'

export default {
  name: 'Dashboard',
  components: {
    Loading
  },
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    await this.refresh()

    bus.$on('labels:updated', this.refresh)
  },
  methods: {
    async onRefresh(event) {
      if (event && event.force) {
        this.reload()
      } else {
        await this.refresh()
      }
    },

    async refresh() {
      this.loading = true

      try {
        await this.$store.dispatch('fetchLabelsAndHints')
      } catch (err) {
        this.handleServerError('fetchLabelsAndHints')
      }

      this.loading = false
    },

    reload() {
      this.$router.push('/')
    }
  }
}
</script>
