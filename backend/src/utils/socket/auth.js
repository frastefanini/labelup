import { extend } from 'lodash'
import { createRequest, createResponse } from 'node-mocks-http'
import { getVerifiedClaims } from 'atlassian-connect-express/lib/middleware/authentication'

import addon from '../../addon'
import logger from '../log'

export async function checkValidToken(socket, next) {
  if (/no-auth/.test(process.env.AC_OPTS)) {
    logger.warn('Auth verification is disabled, skipping validation of request.')

    next()
    return
  }

  const req = createRequest({ url: socket.handshake.url })
  const res = createResponse({ req })
  let params

  try {
    params = await getVerifiedClaims(addon, req, res, true)
  } catch (err) {
    next(err)
    return
  }

  const context = {
    clientKey: params.clientKey
  }

  socket.context = extend({}, socket.context || {}, context)
  next()
}
