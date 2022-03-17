import i18n from 'i18n'
import moment from 'moment'

import LabelUpError from '../utils/error'
import { getProperty } from './confluence/content/property'

export function generateInitProperty(userAccountId, content) {
  return {
    created: moment().utc().unix(),
    createdBy: userAccountId,
    status: 'pending',
    parent: content,
    hints: []
  }
}

export async function getContentProperty(clientKey, contentId, contentPropertyKey) {
  let property
  try {
    property = await getProperty(clientKey, contentId, contentPropertyKey)
  } catch (err) {
    if (err.statusCode != 404) {
      throw new LabelUpError(i18n.__('status.error.SE01'))
    }
  }
  return property
}
