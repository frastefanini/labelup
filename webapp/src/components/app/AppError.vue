<template>
  <div class="app-error">
    <div class="content">
      <div class="message-wrapper">
        <SectionMessage
          appearance="warning"
          :title="title">

          <p>{{ message }}</p>
        </SectionMessage>
      </div>
    </div>

    <div class="footer">
      <Button appearance="subtle" @click.prevent="retry">
        {{ $t('common.retry') }}
      </Button>
    </div>
  </div>
</template>

<script>
import { reload } from '../../utils/browser'

import { SectionMessage, Button } from '@spartez/vue-atlaskit'

export default {
  name: 'AppError',
  components: {
    SectionMessage,
    Button
  },
  props: {
    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    }
  },
  methods: {
    retry() {
      reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-error {
  display: flex;
  flex-direction: column;

  .content {
    .message-wrapper {
      margin-bottom: 20px
    }
  }

  .footer {
    align-self: flex-end;
    flex-grow: 1
  }
}
</style>
