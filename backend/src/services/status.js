import i18n from 'i18n'
import { isEqual } from 'lodash'

import { getContentProperty } from '../services/property'
import { isVersionCurrent } from '../services/version'
import LabelUpError from '../utils/error'

const buildStatus = (code, message) => {
  let msg
  msg = message ? message : i18n.__(`status.message.${code}`)
  return {
    code: code,
    message: msg
  }
}

const hasStatus = (property, status) => {
  const propertyStatus = property.value.status
  if (!propertyStatus) {
    const code = 'SN11'
    throw new LabelUpError(i18n.__(`status.message.${code}`), code)
  }
  return  propertyStatus === status
}

const matchesContentVersion = (property, content) => {
  const propertyContent = property.value.parent
  if (!propertyContent) {
    const code = 'SN12'
    throw new LabelUpError(i18n.__(`status.message.${code}`), code)
  }
  return isEqual(propertyContent, content)
}

export function getStatusFromProperty(property, content) {
  if (!property) {
    return buildStatus('SN14')
  }

  let matchesVersion
  try {
    matchesVersion = matchesContentVersion(property, content)
  } catch (err) {
    return buildStatus(err.statusCode, err.message)
  }
  if (!matchesVersion) {
    return buildStatus('SN13')
  }

  let pending
  try {
    pending = hasStatus(property, 'pending')
  } catch (err) {
    return buildStatus(err.statusCode, err.message)
  }
  if (pending) {
    return buildStatus('SP02')
  }

  return buildStatus('SP01')
}

export async function getStatus(clientKey, content) {
  const currentVersion = await isVersionCurrent(clientKey, content.id, content.version)
  if (!currentVersion) {
    return buildStatus('SN10')
  }
  const property = await getContentProperty(clientKey, content.id, process.env.CONTENT_PROPERTY_KEY)
  return getStatusFromProperty(property, content)
}
