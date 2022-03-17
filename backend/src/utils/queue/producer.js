import i18n from 'i18n'
import crypto from 'crypto'
import moment from 'moment'
import { isObject } from 'lodash'
import { Producer as SQSProducer } from 'sqs-producer'

import logger from '../log'
import LabelUpError from '../error'

class Producer {

  #producer

  constructor(options) {
    this.#producer = SQSProducer.create(options)
    logger.info(`SQS producer created with queue URL ${options.queueUrl}`)
  }

  getMessageIdFromBody(body) {
    const now = moment().utc().unix()

    return crypto
      .createHash('sha256')
      .update(body)
      .update(now.toString(16))
      .digest('hex')
  }

  convertAttributes(attributes) {
    const result = {}

    for (let key in attributes) {
      if (result.hasOwnProperty(key)) {
        continue
      }

      const value = attributes[key]

      if (isObject(value)) {
        result[key] = {
          DataType: 'String',
          StringValue: JSON.stringify(value)
        }
      }
    }

    return result
  }

  async send(body, groupId, attributes) {
    const id = this.getMessageIdFromBody(body)
    const messageAttributes = this.convertAttributes(attributes)

    const message = {
      id,
      body,
      groupId,
      deduplicationId: id,
      messageAttributes
    }
    let result
    try {
      result = await this.#producer.send(message)
    } catch (err) {
      const code = 'HE21'
      throw new LabelUpError(i18n.__(`hints.error.${code}`), code, err)
    }
    return result
  }
}

export default Producer
