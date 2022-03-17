import RestClient from '../../../utils/rest'

const BASE_URL = '/content'

const _getVersion = async (restClient, contentId, versionNumber) => {
  const url = `${BASE_URL}/${contentId}/version/${versionNumber}`
  const version =  await restClient.get(url)

  return version
}

export async function getVersion(clientKey, contentId, versionNumber) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _getVersion(restClient, contentId, versionNumber)
}
