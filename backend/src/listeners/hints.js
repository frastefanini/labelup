import Consumer from '../utils/queue/consumer'

import { updateHints } from '../services/hints'
import { buildQueueUrl } from '../utils/queue'
import logger from '../utils/log'

// Queue attributes
const MESSAGE_GROUP_ID_ATTR = 'MessageGroupId'

// Message attributes
const CONTENT_MSG_ATTR = 'content'

class HintsListener {

  #consumer

  constructor() {
    const region = process.env.SQS_REGION

    const queueUrl = buildQueueUrl({
      region,
      accountId: process.env.SQS_ACCOUNT_ID,
      queueName: process.env.SQS_HINTS_QUEUE_NAME
    }, true)

    this.#consumer = new Consumer({
      region,
      queueUrl,
      attributeNames: [MESSAGE_GROUP_ID_ATTR],
      messageAttributeNames: [CONTENT_MSG_ATTR],
      handleMessage: this.onHintsGenerated
    })
  }

  listen() {
    this.#consumer.start()
  }

  async onHintsGenerated(message) {
    const clientKey = message.Attributes[MESSAGE_GROUP_ID_ATTR]

    let content
    try {
      content = JSON.parse(message
        .MessageAttributes[CONTENT_MSG_ATTR]
        .StringValue)
    } catch (err) {
      logger.error('Received content malformed. Parsing failed.')
      throw err
    }

    let body
    try {
      body = JSON.parse(message.Body)
    } catch (err) {
      logger.error('Received body malformed. Parsing failed.')
      throw err
    }

    if (content && body) {
      try {
        await updateHints(clientKey, content, body)
      } catch (err) {
        logger.error(err.message)
        throw err
      }
    }
  }
}

export default new HintsListener()
