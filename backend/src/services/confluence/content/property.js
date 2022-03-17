import i18n from 'i18n'

import RestClient from '../../../utils/rest'
import LabelUpError from '../../../utils/error'
import logger from '../../../utils/log'

const BASE_URL = '/content'

const _getProperty = async (restClient, id, key) => {
  const url = `${BASE_URL}/${id}/property/${key}`
  const property =  await restClient.get(url)

  return property
}

const _deleteProperty = async (restClient, id, key) => {
  const url = `${BASE_URL}/${id}/property/${key}`
  try {
    await restClient.delete(url)
    return
  } catch (err) {
    if (err.statusCode != 403 && err.statusCode != 404) {
      logger.error(`Failed to delete property on content id ${id}.`)
    }
    return
  }
}

const _getPropertyVersion = async (restClient, id, key) => {
  try {
    const property = await _getProperty(restClient, id, key)
    return property.version.number
  } catch (err) {
    if (err.statusCode != 404) {
      const code = 'HE04'
      throw new LabelUpError(i18n.__(`hints.error.${code}`), code, err)
    }
    return 0
  }
}

const _updateProperty = async (restClient, id, key, value) => {
  const url = `${BASE_URL}/${id}/property/${key}`
  let version
  try {
    version = await _getPropertyVersion(restClient, id, key)
  } catch (err) {
    if (err instanceof LabelUpError) {
      throw err
    } else {
      logger.error(`Property update failed with error: ${err.message}`)
      return
    }
  }

  const data = {
    value,
    version: {
      number: version + 1
    }
  }

  const property = await restClient.put(url, data)
  return property
}

export async function updateProperty(clientKey, id, key, value) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _updateProperty(restClient, id, key, value)
}

export async function getProperty(clientKey, id, key) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _getProperty(restClient, id, key)
}

export async function deleteProperty(clientKey, id, key) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _deleteProperty(restClient, id, key)
}
