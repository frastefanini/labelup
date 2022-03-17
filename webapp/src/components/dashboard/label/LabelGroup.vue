<template>
  <div class="label-group"
    :class="{ centered: isCentered }">

    <Label v-for="label in labels"
      :key="label.text"
      :label="label"
      :disabled="!isEditable"
      :color="color"
      @click="onClick"
      @remove="onRemove" />
  </div>
</template>

<script>
import Label from './Label'

export default {
  name: 'LabelGroup',
  components: {
    Label
  },
  props: {
    isCentered: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    labels: {
      type: Array,
      required: true
    },
    color: {
      type: String
    }
  },
  methods: {
    onClick(label) {
      this.$emit('click', label)
    },

    onRemove(label) {
      this.$emit('remove', label)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/color.scss';

.label-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  scrollbar-width: thin;
  scrollbar-color: $N100 transparent;

  &::-webkit-scrollbar {
    width: 5px
  }

  &::-webkit-scrollbar-thumb {
    background-color: $N100;
    border-radius: 20px
  }

  &.centered {
    justify-content: center
  }
}
</style>
