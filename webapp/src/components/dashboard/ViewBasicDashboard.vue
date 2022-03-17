<template>
  <div class="basic">
    <div class="header">
      <Button appearance="subtle-link"
        spacing="none"
        :is-disabled="busy"
        @click.exact="refresh"
        @click.ctrl.exact="refresh($event, true)">

        <RefreshIcon
          slot="icon-before"
          size="small"
          :title="$t('common.refresh')" />
      </Button>
    </div>

    <div class="content">
      <div class="title">
        <h3>{{ $t(`dashboard.basic.title.${hasHints ? 'default' : 'allGood'}`) }}</h3>
      </div>

      <div class="description">
        <p v-if="hasHints">{{ $t('dashboard.basic.description.default') }}</p>
        <p v-else v-for="text in $t('dashboard.basic.description.allGood')" :key="text">{{text}}</p>
      </div>

      <LabelGroup v-if="hasHints"
        class="top-hints"
        is-centered
        :labels="hints" />
    </div>

    <div class="footer">
      <div class="buttons">
        <Button appearance="primary"
          v-if="hasHints"
          :isLoading="busy"
          @click.prevent="apply">

          {{ $t('dashboard.basic.button.apply') }}
        </Button>

        <Button :appearance="hasHints ? 'subtle' : 'primary'"
          :is-disabled="busy"
          @click.prevent="more">

          {{ $t(hasHints ? 'common.more' : 'dashboard.basic.button.more') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, RefreshIcon } from '@spartez/vue-atlaskit'

import LabelGroup from './label/LabelGroup'
import mixin from '../../mixins/inline-dialog'

export default {
  name: 'ViewBasicDashboard',
  components: {
    Button,
    RefreshIcon,
    LabelGroup
  },
  mixins: [
    mixin
  ],
  data() {
    return {
      busy: false
    }
  },
  computed: {
    hints() {
      return this.$store.getters.hints.top
    },

    hasHints() {
      return this.hints.length > 0
    }
  },
  methods: {
    async apply() {
      this.busy = true

      try {
        await this.$store.dispatch('addLabels')
        this.refresh()
      } catch (err) {
        this.handleServerError('addLabels')
        this.busy = false
      }
    },

    refresh(event, force = false) {
      this.$emit('refresh', { force })
    },

    more() {
      this.$store.dispatch('openDialog', 'dashboard')
      this.$store.dispatch('hideInlineDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.basic {
  display: flex;
  flex-direction: column;

  .header {
    align-self: flex-end
  }

  .content {
    .title {
      h3 {
        margin: 0 0 20px 0
      }
    }

    .description {
      p {
        margin: 0 0 20px 0
      }
    }

    .top-hints {
      box-sizing: border-box;
      padding: 0 5px;
      margin-bottom: 20px
    }
  }

  .footer {
    align-self: flex-end;
    flex-grow: 1
  }
}
</style>
