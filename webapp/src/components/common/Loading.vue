<template>
  <div class="loading">
    <Spinner size="large" />
  </div>
</template>

<script>
import { Spinner } from '@spartez/vue-atlaskit'

export default {
  name: 'Loading',
  components: {
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center
}
</style>
