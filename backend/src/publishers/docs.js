import Producer from '../utils/queue/producer';
import { buildQueueUrl } from '../utils/queue'

const region = process.env.SQS_REGION

const queueUrl = buildQueueUrl({
  region,
  accountId: process.env.SQS_ACCOUNT_ID,
  queueName: process.env.SQS_DOCS_QUEUE_NAME
}, true)

const producer = new Producer({
  region,
  queueUrl
})

export async function publishDocument(clientKey, content, doc) {
  return await producer.send(doc, clientKey, { content })
}
