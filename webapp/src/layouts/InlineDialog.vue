<template>
  <div class="inlinedialog">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InlineDialogLayout'
}
</script>

<style lang="scss" scoped>
@import '../style/color.scss';

.inlinedialog {
  background: $N0
}
</style>
