import { isDevEnv } from './env'
import { isLicensingEnabled } from './license'

import { production as config } from '../../../config.json'
import { number as clientVersion } from '../../../webapp/version.json'

const enableLicensing = (descriptor) => {
  descriptor.enableLicensing = isLicensingEnabled()
}

const setDevAppKey = (descriptor) => {
  if (isDevEnv()) {
    descriptor.key += '.dev'
  }
}

const setClientVersion = (descriptor) => {
  for (let type in descriptor.modules) {
    const modules = descriptor.modules[type]

    for (let module of modules) {
      if (module.cacheable && module.url) {
        module.url += `&version=${clientVersion}`
      }
    }
  }
}

export function descriptorTransformer(descriptor) {
  setDevAppKey(descriptor)
  enableLicensing(descriptor)
  setClientVersion(descriptor)

  return descriptor
}

export const { whitelist: allowedDomains } = config
