<template>
  <div class="label" @click.stop="onClick">
    <WrappedComponent :wrap="hasTooltip">
      <Tooltip :label="$t('label.relevance', { relevance })"
        placement="top"
        #wrapper />

      <Tag :tag="tag"
        :index="0"
        :count="1"
        :class="[
          color,
          { disabled: !hasTooltip && disabled }
        ]"
        @on-remove="onRemove" />
    </WrappedComponent>
  </div>
</template>

<script>
import WrappedComponent from 'vue-wrapped-component'
import { Tooltip } from '@spartez/vue-atlaskit'
import Tag from '@vue-atlaskit/Tag'

export default {
  name: 'Label',
  components: {
    Tag,
    Tooltip,
    WrappedComponent
  },
  props: {
    label: {
      type: Object,
      required: true
    },

    disabled: {
      type: Boolean,
      default: false
    },

    color: {
      type: String,
      default: 'neutral'
    }
  },
  computed: {
    tag() {
      const text = this.label.text

      return {
        id: text,
        label: text,
        disabled: this.disabled
      }
    },

    hasTooltip() {
      return !!this.label.relevance
    },

    relevance() {
      const relevance = this.label.relevance

      if (!relevance) {
        return 0
      }

      return Math.round(relevance * 100)
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.label)
    },

    onRemove() {
      this.$emit('remove', this.label)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/color.scss';

.tag:last-of-type {
  margin: 5px;
  align-items: stretch;

  &.disabled {
    pointer-events: none
  }

  &.neutral {
    background-color: $N20;
    color: $N700
  }

  &.purple {
    background-color: $P75;
    color: $P500
  }

  &.yellow {
    background-color: $Y100;
    color: $N500
  }

  ::v-deep .label {
    font-size: 14px;
    color: inherit
  }

  ::v-deep .remove-tag {
    height: unset;
    color: inherit;

    span[size="xsmall"] {
      color: inherit !important
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.075)
    }
  }
}
</style>
