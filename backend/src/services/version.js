import i18n from 'i18n'

import { getVersion } from './confluence/content/version'

export async function isVersionCurrent(clientKey, contentId, versionNumber) {
  let version
  try {
    version = await getVersion(clientKey, contentId, versionNumber)
  } catch (err) {
    const code = 'VE01'
    throw new LabelUpError(i18n.__(`version.error.${code}`), code, err)
  }

  if(!version){
    const code = 'VE01'
    throw new LabelUpError(i18n.__(`version.error.${code}`), code, err)
  }

  return version.content.status === 'current'
}
