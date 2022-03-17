import i18n from '../i18n'

export default {
  methods: {
    handleServerError(actionName) {
      const message = i18n.t(`server.error.${actionName}`)

      console.error(message)
      this.$store.dispatch('createErrorFlag', message)
    }
  }
}
