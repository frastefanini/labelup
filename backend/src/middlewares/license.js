import i18n from 'i18n'

import { isLicensingEnabled } from '../utils/license'
import LabelUpError from '../utils/error'

const buildError = (code) => {
  const message = i18n.__(`app.error.${code}`)
  return new LabelUpError(message, code, null, 403)
}

export default function() {
  return (req, res, next) => {
    if (isLicensingEnabled()) {
      const license = req.context.context.license

      if (!license) {
        const error = buildError('AE01')
        next(error)

        return
      }

      if (!license.active) {
        const error = buildError('AE02')
        next(error)

        return
      }
    }

    next()
  }
}
