import moment from 'moment'

import { isProdEnv } from '../utils/env'

const maxAge = 60 * 60 * 24 * 365

const updateResHeaders = (res) => {
  const expires = moment()
    .add(maxAge, 'second')
    .toDate()

  res.removeHeader('Pragma')
  res.removeHeader('Surrogate-Control')
  res.setHeader('Cache-Control', `private, max-age=${maxAge}, s-maxage=${maxAge}`)
  res.setHeader('Expires', expires.toUTCString())
}

export default function() {
  return (req, res, next) => {
    if (isProdEnv()) {
      updateResHeaders(res)
    }

    next()
  }
}
