import os from 'os'

import app from './app'
import addon from './addon'
import server from './server'
import hintsListener from './listeners/hints'
import bus from './utils/event'
import logger from './utils/log'
import * as Socket from './utils/socket'
import { isDevEnv } from './utils/env'

const port = app.get('port')

// Boot the HTTP server
server.listen(port, async () => {
  logger.info(`App server running at http://${os.hostname()}:${port}`)

  // Create the socket
  const socket = Socket.create(server)
  bus.socket = socket

  // Enables auto registration/de-registration of app into a host in dev mode
  if (isDevEnv()) {
    await addon.register()
  }

  // Start hints listeners
  hintsListener.listen()
})
