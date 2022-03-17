import RestClient from '../../../utils/rest'

const BASE_URL = '/content'

const _getBody = async (restClient, id) => {
  const url = `${BASE_URL}/${id}`
  const content =  await restClient.get(url, {
    expand: 'body.atlas_doc_format'
  })

  return {
    title: content.title,
    body: content.body.atlas_doc_format.value
  }
}

export async function getBody(clientKey, id) {
  const restClient = RestClient.fromClientKey(clientKey)
  return _getBody(restClient, id)
}
