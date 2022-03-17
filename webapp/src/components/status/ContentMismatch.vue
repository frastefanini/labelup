<template>
  <div class="content-mismatch">
    <div class="content">
      <div class="title">
        <h3>{{ $t('status.error.contentMismatch.title') }}</h3>
      </div>

      <div class="description">
        <p v-for="text in $t('status.error.contentMismatch.description')" :key="text">{{text}}</p>
      </div>
    </div>

    <div class="footer">
      <Button appearance="primary" @click.prevent="reload">
        {{ $t('common.reload') }}
      </Button>
    </div>
  </div>
</template>

<script>
import { Button } from '@spartez/vue-atlaskit'

export default {
  name: 'ContentMismatch',
  components: {
    Button
  },
  methods: {
    reload() {
      this.$store.dispatch('goToContentView')
    }
  }
}
</script>

<style lang="scss" scoped>
.content-mismatch {
  display: flex;
  flex-direction: column;

  .content {
    .title {
      margin-bottom: 20px;

      h3 {
        margin: 0
      }
    }

    .description {
      margin-bottom: 20px;

      p {
        margin: 0 0 20px 0;

        &:last-of-type {
          margin: 0
        }
      }
    }
  }

  .footer {
    align-self: flex-end;
    flex-grow: 1
  }
}
</style>
