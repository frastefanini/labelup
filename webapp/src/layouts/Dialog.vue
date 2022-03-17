<template>
  <div class="dialog">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DialogLayout'
}
</script>

<style lang="scss" scoped>
@import '../style/color.scss';

.dialog {
  background: $N0;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 30px
}
</style>
