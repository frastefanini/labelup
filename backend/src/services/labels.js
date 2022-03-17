import i18n from 'i18n'

import { getLabels } from './confluence/content/label'
import { getProperty } from './confluence/content/property'
import { createLabels } from './confluence/content/label'
import LabelUpError from '../utils/error'

const buildLabel = (label, type) => {
  if (type === 'label') {
    return {
      text: label.name,
      type
    }
  }
  if (type === 'hint') {
    return {
      text: label.text,
      relevance: label.relevance,
      type
    }
  }
}

const buildConfluenceLabel = (label) => {
  return {
    prefix: 'global',
    name: label.text
  }
}

async function getContentLabels(clientKey, contentId) {
  let response
  try {
    response = await getLabels(clientKey, contentId)
  } catch (err) {
    const code = 'LE01'
    throw new LabelUpError(i18n.__(`labels.error.${code}`), code, err)
  }
  if (!response) {
    const code = 'LE01'
    throw new LabelUpError(i18n.__(`labels.error.${code}`), code, err)
  }
  return response.results
}

async function getHints(clientKey, contentId) {
  let property
  try {
    property = await getProperty(clientKey, contentId, process.env.CONTENT_PROPERTY_KEY)
  } catch (err) {
    const code = 'LE03'
    if (err.statusCode != 404) {
      const code = 'LE02'
    }
    throw new LabelUpError(i18n.__(`labels.error.${code}`), code, err)
  }
  if (!property || !property.value || !property.value.hints) {
    const code = 'LE02'
    throw new LabelUpError(i18n.__(`labels.error.${code}`), code, err)
  }

  return property.value.hints
}

export async function getAllLabels(clientKey, contentId) {
  let result = {}
  const confluenceLabels = await getContentLabels(clientKey, contentId)
  if(confluenceLabels) {
    result.labels = confluenceLabels.map(function (label) {
      if(label.prefix === 'global') {
        return buildLabel(label, 'label')
      }
    })
  }

  const hints = await getHints(clientKey, contentId)
  result.hints = hints.map(hint => buildLabel(hint, 'hint'))

  return result
}

export async function modifyLabels(clientKey, contentId, labels) {
  const data = labels.map(label => buildConfluenceLabel(label))
  let response
  try {
    response = await createLabels(clientKey, contentId, data)
  } catch (err) {
    const code = 'LE04'
    throw new LabelUpError(i18n.__(`labels.error.${code}`), code, err)
  }
  if (!response) {
    const code = 'LE01'
    throw new LabelUpError(i18n.__(`labels.error.${code}`), code, err)
  }
  return response.results
}
