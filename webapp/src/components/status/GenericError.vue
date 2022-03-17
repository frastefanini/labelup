<template>
  <div class="error">
    <div class="content">
      <div class="message-wrapper">
        <SectionMessage
          appearance="error"
          :title="$t('status.error.generic.title')">

          <p>{{message}}</p>
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
import { SectionMessage, Button } from '@spartez/vue-atlaskit'

export default {
  name: 'GenericError',
  components: {
    SectionMessage,
    Button
  },
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    retry() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.error {
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
