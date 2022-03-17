<template>
  <div class="license-error">
    <AppError
      :title="$t('app.error.license.title')"
      :message="$t('app.error.license.message')" />
  </div>
</template>

<script>
import AppError from './AppError'

export default {
  name: 'LicenseError',
  components: {
    AppError
  }
}
</script>
