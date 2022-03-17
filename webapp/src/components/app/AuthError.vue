<template>
  <div class="auth-error">
    <AppError
      :title="$t('app.error.auth.title')"
      :message="$t('app.error.auth.message')" />
  </div>
</template>

<script>
import AppError from './AppError'

export default {
  name: 'AuthError',
  components: {
    AppError
  }
}
</script>
