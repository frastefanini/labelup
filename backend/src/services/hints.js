import i18n from 'i18n'

import { getBody } from './confluence/content'
import { updateProperty, deleteProperty } from './confluence/content/property'
import { publishDocument } from '../publishers/docs'
import { convert } from '../utils/adf'
import { compress } from '../utils/compression'
import bus from '../utils/event'
import LabelUpError from '../utils/error'
import { generateInitProperty, getContentProperty } from '../services/property'

const handleErrors = async (clientKey, content, errors) => {
  await deleteProperty(clientKey, content.id, process.env.CONTENT_PROPERTY_KEY)

  const code = getMappedUIErrorCode(errors)
  const error = {
    code,
    message: i18n.__(`hints.error.${code}`)
  }
  bus.emit(clientKey, 'hints:error', {
    content,
    error
  })
}

const getMappedUIErrorCode = (errors) => {
  const textErrorCodes = ['I402', 'L401']
  const langDetectErrorCodes = ['L402']
  const unsupportedLangErrorCodes = ['L403']
  let filtered

  filtered = errors.filter(error => textErrorCodes.includes(error.code))
  if (filtered.length) {
    return 'HEUIT11'
  }

  filtered = errors.filter(error => langDetectErrorCodes.includes(error.code))
  if (filtered.length) {
    return 'HEUIL02'
  }

  filtered = errors.filter(error => unsupportedLangErrorCodes.includes(error.code))
  if (filtered.length) {
    return 'HEUIL01'
  }

  return 'HEUIG21'
}

const generateHints = async (clientKey, content) => {
  const body = await getBody(clientKey, content.id)
  const data = convert(body)

  let doc
  try {
    doc = await compress(data)
  } catch (err) {
    const code = 'HE11'
    throw new LabelUpError(i18n.__(`hints.error.${code}`), code, err)
  }

  if (doc) {
    return await publishDocument(clientKey, content, doc)
  }
}

export async function updateHints(clientKey, content, body) {
  const errors = body.errors
  if (errors.length) {
    await handleErrors(clientKey, content, errors)
    return
  }

  const contentId = content.id
  const currentProperty = await getContentProperty(clientKey, contentId, process.env.CONTENT_PROPERTY_KEY)
  if(!currentProperty) {
    const code = 'HE04'
    throw new LabelUpError(i18n.__(`hints.error.${code}`), code)
  }

  let newPropertyValue = currentProperty.value
  const hints = body.hints
  if (hints) {
    newPropertyValue.hints = hints
  }
  newPropertyValue.status = 'ready'
  const updated = body.created
  if (updated) {
    newPropertyValue.updated = updated
  }
  const property = await updateProperty(clientKey, contentId, process.env.CONTENT_PROPERTY_KEY, newPropertyValue)

  if(property) {
    bus.emit(clientKey, 'hints:generated', { content })
  } else {
    const code = 'HE13'
    throw new LabelUpError(i18n.__(`hints.error.${code}`), code)
  }
}

export async function requestHints(clientKey, content, userAccountId) {
  const propertyInit = generateInitProperty(userAccountId, content)

  let property
  try {
    property = await updateProperty(clientKey, content.id, process.env.CONTENT_PROPERTY_KEY, propertyInit)
  } catch (err) {
    if(err instanceof LabelUpError) {
      throw err
    } else {
      const code = 'HE12'
      throw new LabelUpError(i18n.__(`hints.error.${code}`), code, err)
    }
  }

  if(!property) {
    const code = 'HE12'
    throw new LabelUpError(i18n.__(`hints.error.${code}`), code, err)
  }

  return await generateHints(clientKey, content)
}
