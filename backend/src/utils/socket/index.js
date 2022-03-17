import io from 'socket.io'

import { checkValidToken } from './auth'
import logger from '../log'

const getClientKey = ({ context }) => {
  if (context) {
    return context.clientKey
  }

  return null
}

const onDisconnect = (reason) => {
  logger.debug(`Client disconnected: ${reason}`)
}

const onConnect = (socket) => {
  logger.debug('Client connected')
  socket.on('disconnect', onDisconnect)

  const clientKey = getClientKey(socket)

  if (clientKey) {
    logger.debug(`Client has joined room ${clientKey}`)
    socket.join(clientKey)
  }
}

export function create(srv) {
  const socket = io(srv)
  socket.use(checkValidToken)
  socket.on('connect', onConnect)

  logger.info(`Socket created, path: ${socket.path()}`)
  return socket
}
