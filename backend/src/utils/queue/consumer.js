import { Consumer as SQSConsumer  } from 'sqs-consumer'

import logger from '../log'

class Consumer {

  #consumer

  constructor(options) {
    const consumer = SQSConsumer.create(options)
    logger.info(`SQS consumer created with queue URL ${options.queueUrl}`)

    consumer.on('message_received', this.onMessageReceived)
    consumer.on('message_processed', this.onMessageProcessed)
    consumer.on('processing_error', this.onProcessingError)
    consumer.on('error', this.onError)

    this.#consumer = consumer
  }

  start() {
    this.#consumer.start()
    logger.info('SQS consumer started')
  }

  stop() {
    logger.info('SQS consumer stopped')
    this.#consumer.stop()
  }

  isRunning() {
    return this.#consumer.isRunning
  }

  onMessageReceived(message) {
    logger.debug(`Message received' ${message.Body}`)
  }

  onMessageProcessed(message) {
    logger.debug(`Message processed: ${message.Body}`)
  }

  onProcessingError(err) {
    logger.error(`An error occurred while processing the message: ${err.message}`)
  }

  onError(err) {
    logger.error(`An error occurred while interacting with the queue: ${err.message}`)
  }
}

export default Consumer
