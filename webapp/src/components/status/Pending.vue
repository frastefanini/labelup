<template>
  <div class="pending">
    <div class="header">
      <Button appearance="subtle-link"
        spacing="none"
        @click.prevent="refresh">

        <RefreshIcon
          slot="icon-before"
          size="small"
          :title="$t('common.refresh')" />
      </Button>
    </div>

    <div class="content">
      <div class="title">
        <h3>{{ $t('status.pending.title') }}</h3>
      </div>

      <div class="description">
        <p>{{ $t('status.pending.description') }}</p>
      </div>

      <div class="spinner-wrapper">
        <Spinner size="medium" />
      </div>
    </div>
  </div>
</template>

<script>
import { Button, RefreshIcon, Spinner } from '@spartez/vue-atlaskit'

export default {
  name: 'Pending',
  components: {
    Button,
    RefreshIcon,
    Spinner
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.pending {
  display: flex;
  flex-direction: column;

  .header {
    align-self: flex-end
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .title {
      margin-bottom: 20px;

      h3 {
        margin: 0
      }
    }

    .description {
      margin-bottom: 20px;

      p {
        margin: 0
      }
    }

    .spinner-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center
    }
  }
}
</style>
