import Logger from 'atlassian-connect-express/lib/internal/logger'

import { isDevEnv } from './env'

const logger = Object.create(Logger)

logger.debug = (...args) => {
  if (isDevEnv()) {
    logger.info.apply(null, args)
  }
}

export default logger
