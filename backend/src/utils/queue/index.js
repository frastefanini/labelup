export function buildQueueUrl(options, fifo = false) {
  let url = `https://sqs.${options.region}.amazonaws.com/` +
    `${options.accountId}/` +
    options.queueName

  if (fifo) {
    url += '.fifo'
  }

  return url
}
