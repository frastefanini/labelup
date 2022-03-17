import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import hbs from 'express-hbs'
import helmet from 'helmet'
import noCache from 'nocache'
import i18n from 'i18n'

import { allowedDomains } from './utils/ace'
import { isDevEnv } from './utils/env'

// Bootstrap Express
const app = express()

// Configure Handlebars
const viewsDir = __dirname + '/views'

app.engine('hbs', hbs.express4({
  partialsDir: viewsDir
}))

app.set('view engine', 'hbs')
app.set('views', viewsDir)

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps

app.use(helmet.referrerPolicy({
  policy: ['no-referrer']
}))

app.use(noCache())

// HSTS must be enabled with a minimum age of at least one year

app.use(helmet.hsts({
  maxAge: 60 * 60 * 24 * 365,
  includeSubDomains: false
}))

// Remove the X-Powered-By header
app.use(helmet.hidePoweredBy())

// Stop browsers from trying to MIME-sniff the content type
app.use(helmet.noSniff())

// Allowed parents that may embed the app
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'none'"],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      "*.atl-paas.net"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'"
    ],
    frameAncestors: [
      "'self'",
      ...allowedDomains
    ]
  }
}))

// Include request parsers
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cookieParser())

// Gzip responses when appropriate
app.use(compression())

// Show nicer errors in dev mode
if (isDevEnv()) {
  app.use(errorHandler())
}

// Load messages

i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  objectNotation: true,
  directory: `${__dirname}/locales`
})

app.use(i18n.init)

export default app
