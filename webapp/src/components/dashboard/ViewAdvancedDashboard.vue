<template>
  <div class="advanced">
    <div class="header">
      <Button appearance="subtle"
        spacing="none"
        :is-disabled="busy"
        @click.exact="refresh"
        @click.ctrl.exact="refresh($event, true)">

        <RefreshIcon
          slot="icon-before"
          size="medium"
          :title="$t('common.refresh')" />
      </Button>
    </div>

    <div class="content">
      <div class="title">
        <h3>{{ $t('dashboard.advanced.title') }}</h3>
      </div>

      <div class="description">
        <p>{{ $t('dashboard.advanced.description') }}</p>
      </div>

      <div class="playground-wrapper">
        <div class="playground">
          <div class="section left">
            <div class="title">
              <h4>{{ $t('dashboard.advanced.playground.hints.available.title') }}</h4>
            </div>

            <LabelGroup class="hints available"
              color="purple"
              :labels="available"
              @click="addLabel" />
          </div>

          <div class="section right-top">
            <div class="title">
              <h4>{{ $t('dashboard.advanced.playground.labels.title') }}</h4>
            </div>

            <LabelGroup class="labels"
              v-if="hasLabels"
              :labels="labels" />

            <p v-else>{{ $t('dashboard.advanced.playground.labels.empty') }}</p>
          </div>

          <div class="section right-bottom">
            <div class="title">
              <div class="inner-title">
                <h4>{{ $t('dashboard.advanced.playground.hints.selected.title') }}</h4>

                <div class="warning">
                  <Tooltip v-if="tooManySelected"
                    :label="$t('dashboard.advanced.playground.hints.selected.warning.tooMany', { maxSelected })"
                    placement="right">

                    <WarningIcon size="small" />
                  </Tooltip>
                </div>
              </div>

              <Button appearance="link"
                spacing="none"
                :is-disabled="busy"
                @click.prevent="reset">

                {{ $t('common.reset') }}
              </Button>
            </div>

            <LabelGroup class="hints selected"
              color="yellow"
              is-editable
              :labels="selected"
              @remove="removeLabel" />
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p class="tips">
        <span class="icon-wrapper">
          <img class="icon" src="./res/tips.svg" />
        </span>

        <span class="text">{{ tip }}</span>
      </p>

      <div class="buttons">
        <Button appearance="primary"
          :is-disabled="!atLeastOneSelected || tooManySelected"
          :isLoading="busy"
          @click.prevent="apply">

          {{ $t('common.add') }}
        </Button>

        <Button appearance="subtle"
          :is-disabled="busy"
          @click.prevent="close">

          {{ $t('common.close') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { sample, chain } from 'lodash'
import { Button, RefreshIcon, WarningIcon, Tooltip } from '@spartez/vue-atlaskit'

import LabelGroup from './label/LabelGroup'

export default {
  name: 'ViewAdvancedDashboard',
  components: {
    Button,
    RefreshIcon,
    WarningIcon,
    LabelGroup,
    Tooltip
  },
  data() {
    return {
      busy: false,
      available: [],
      selected: [],
      maxSelected: 20
    }
  },
  computed: {
    ...mapGetters([
      'hints',
      'labels'
    ]),

    hasLabels() {
      return this.labels.length > 0
    },

    atLeastOneSelected() {
      return this.selected.length > 0
    },

    tooManySelected() {
      return this.selected.length > this.maxSelected
    },

    tip() {
      const tips = this.$t('dashboard.advanced.tips')
      return sample(tips)
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    refresh(event, force = false) {
      this.$emit('refresh', { force })
    },

    reset() {
      this.available = [...this.hints.others]
      this.selected = [...this.hints.top]
    },

    addLabel(target) {
      const available = this.available.filter(label => {
        return label.text !== target.text
      })

      this.available = [...available]
      this.selected.push(target)
    },

    removeLabel(target) {
      const selected = this.selected.filter(label => {
        return label.text !== target.text
      })

      this.selected = [...selected]

      const available = chain(this.available)
        .push(target)
        .orderBy(['relevance', 'text'], ['desc', 'asc'])
        .value()

      this.available = [...available]
    },

    async apply() {
      this.busy = true

      try {
        await this.$store.dispatch('addLabels', this.selected)
        this.closeDialog(true)
      } catch (err) {
        this.handleServerError('addLabels')
        this.busy = false
      }
    },

    close() {
      this.closeDialog(false)
    },

    closeDialog(updated) {
      this.$store.dispatch('closeDialog', { updated })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/color.scss';

.advanced {
  display: flex;
  flex-direction: column;

  .header {
    align-self: flex-end
  }

  .content {
    > .title {
      margin-bottom: 10px;

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

    .playground-wrapper {
      box-sizing: border-box;
      margin-bottom: 20px;
      padding: 20px;

      .playground {
        display: grid;
        grid-template-columns: 35% auto;
        column-gap: 40px;
        row-gap: 40px;

        .section {
          &.left {
            grid-column: 1 / 2;
            grid-row: 1 / span 2;
            display: flex;
            flex-direction: column;

            .label-group {
              max-height: 300px;
              flex-grow: 1
            }
          }

          &.right-top {
            grid-column: 2 / 3;
            grid-row: 1 / 2;

            p {
              margin: 0;
              opacity: 0.8
            }
          }

          &.right-bottom {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            display: flex;
            flex-direction: column;

            .title {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .inner-title {
                display: flex;

                .warning {
                  color: $R300;
                  margin-left: 5px;
                  cursor: pointer
                }
              }
            }

            .label-group {
              flex-grow: 1;
              min-height: 50px;
              max-height: 150px
            }
          }

          > .title {
            margin-bottom: 20px;

            h4 {
              font-weight: normal
            }
          }

          .label-group {
            &.hints {
              overflow-x: hidden;
              overflow-y: auto;
              border-radius: 5px;
              background-color: $N20;
              border: 1px solid $N40;
              box-sizing: border-box;
              padding: 5px;
            }
          }
        }
      }
    }
  }

  .footer {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tips {
      display: flex;
      align-items: center;

      .icon-wrapper {
        margin-right: 5px;

        .icon {
          width: 24px;
          height: 24px
        }
      }

      .text {
        font-size: 12px;
        opacity: 0.8
      }
    }

    .buttons {
      display: flex;
      flex-wrap: nowrap;
      margin-left: 5px
    }
  }
}
</style>
