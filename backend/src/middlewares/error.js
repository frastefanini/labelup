import logger from '../utils/log'

export default function() {
  return (err, req, res, next) => {
    logger.error(err.toString())

    if (!err.statusCode) {
      err.statusCode = 500
    }

    res.status(err.statusCode).send({
      error: {
        message: err.message
      }
    })
  }
}
