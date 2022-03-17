import RestClient from '../../../utils/rest'

const BASE_URL = '/content'

const _getLabels = async (restClient, contentId) => {
  const url = `${BASE_URL}/${contentId}/label`
  const labels =  await restClient.get(url)

  return labels
}

const _createLabels = async (restClient, contentId, data) => {
  const url = `${BASE_URL}/${contentId}/label`
  const labels =  await restClient.post(url, data)

  return labels
}

export async function getLabels(clientKey, contentId) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _getLabels(restClient, contentId)
}

export async function createLabels(clientKey, contentId, labels) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _createLabels(restClient, contentId, labels)
}
