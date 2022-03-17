import ace from 'atlassian-connect-express'

import app from './app'
import { descriptorTransformer } from './utils/ace'

// Bootstrap ACE
const addon = ace(app, {
  config: {
    descriptorTransformer
  }
})

// See config.json
const port = addon.config.port()
app.set('port', port)

// Include ACE middleware
app.use(addon.middleware())

export default addon
